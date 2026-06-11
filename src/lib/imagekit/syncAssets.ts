import fs from 'node:fs/promises'
import path from 'node:path'

import type { Payload } from 'payload'

import { getImageKitRoot } from './client'
import { listAllImageKitAssets, type ImageKitFile } from './listAll'
import { uploadBufferToImageKit, type ImageKitUploadResult } from './upload'
import { walkLocalAssets } from './walkAssets'
import { fetchRemoteFileAnyShape } from '@/seed/seedMediaUpload'

export type AssetSyncFileResult = {
  relPath: string
  filename: string
  folder: string
  size: number
  /** What happened during the upload phase. */
  upload: 'created' | 'updated' | 'skipped' | 'error'
  /** What happened during the Payload Media seed phase. */
  seed: 'created' | 'updated' | 'skipped' | 'error' | 'not-run'
  /** Resulting ImageKit URL (when known). */
  url?: string
  fileId?: string
  /** Resulting Payload Media doc id (when known). */
  mediaId?: string | number
  error?: string
}

export type AssetSyncSummary = {
  scanned: number
  uploaded: number
  updated: number
  uploadSkipped: number
  uploadErrors: number
  seeded: number
  seedUpdated: number
  seedSkipped: number
  seedErrors: number
}

/**
 * Lifecycle events fired during a sync run. Consumed by the streaming API
 * route to push progress to the client and by a console logger so the dev
 * server terminal mirrors what the client sees.
 */
export type AssetSyncEvent =
  | { type: 'scan-start'; assetsRoot: string }
  | { type: 'scan-done'; localCount: number; remoteCount: number }
  | { type: 'file-start'; index: number; total: number; relPath: string; size: number }
  | {
      type: 'file-upload'
      index: number
      total: number
      relPath: string
      action: 'created' | 'updated' | 'skipped'
    }
  | {
      type: 'file-done'
      index: number
      total: number
      relPath: string
      upload: AssetSyncFileResult['upload']
      seed: AssetSyncFileResult['seed']
      url?: string
      mediaId?: string | number
      error?: string
    }
  | { type: 'summary'; summary: AssetSyncSummary }

export type OnSyncEvent = (event: AssetSyncEvent) => void | Promise<void>

function altFor(folderRel: string, filename: string): string {
  const stem = filename.replace(/\.[a-z0-9]+$/i, '')
  const folderLeaf = folderRel.split('/').filter(Boolean).pop() || 'root'
  return `${folderLeaf}/${stem}`
}

function targetFilePath(root: string, relPath: string): string {
  return `${root}/${relPath}`
}

/**
 * Mirror ImageKit's server-side filename normalization. ImageKit allows only
 * alphanumerics + `.`, `-`, `_`; anything else (spaces, &, parens, …) is
 * replaced by `_`. We apply the same rule client-side so that:
 *   - the remote-lookup key matches what ImageKit actually stored
 *   - a re-uploaded file keeps the same canonical name
 *   - the Payload Media doc has a stable alt
 *
 * Without this, a local "foo bar.png" uploaded once as "foo_bar.png" looks
 * "missing" on every subsequent sync, the code attempts to re-upload, and
 * ImageKit refuses with a 400 (file exists, overwrite=false).
 */
export function normalizeImageKitName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_')
}

function canonicalRelPath(relPath: string): string {
  // Normalize each path segment independently — folder names can contain
  // unsafe chars too (e.g. "ui-mockups/claude folder/foo.png").
  return relPath.split('/').map(normalizeImageKitName).join('/')
}

/**
 * Walk the local `assets/` folder, push any new/changed file up to ImageKit
 * (preserving the relative folder layout), then upsert a matching Payload
 * Media doc for every touched file.
 *
 * Idempotent: files that already exist in ImageKit with the same byte size
 * are skipped (no re-upload, no re-seed). Modified files are uploaded with
 * `overwriteFile: true`, and their Media doc is patched.
 *
 * Works for any file type — images, videos, PDFs, anything ImageKit accepts.
 */
export async function syncAssetsToImageKit(args: {
  payload: Payload
  assetsRoot: string
  /** Optional progress callback. Fires after every lifecycle stage. */
  onEvent?: OnSyncEvent
}): Promise<{ results: AssetSyncFileResult[]; summary: AssetSyncSummary }> {
  const { payload, assetsRoot, onEvent } = args
  const root = getImageKitRoot()

  const emit = async (event: AssetSyncEvent) => {
    if (onEvent) {
      try {
        await onEvent(event)
      } catch {
        // Never let a progress consumer break the sync.
      }
    }
  }

  // ── Phase 1: scan local + remote ──────────────────────────────────────────
  await emit({ type: 'scan-start', assetsRoot })
  const local = await walkLocalAssets(assetsRoot)
  const { files: remote } = await listAllImageKitAssets(root)
  const remoteByPath = new Map<string, ImageKitFile>(remote.map((f) => [f.filePath, f]))
  await emit({ type: 'scan-done', localCount: local.length, remoteCount: remote.length })

  const results: AssetSyncFileResult[] = []
  const total = local.length

  // ── Phase 2: upload missing/changed files ────────────────────────────────
  for (let i = 0; i < local.length; i++) {
    const file = local[i]!
    const index = i + 1
    const folderRel = canonicalRelPath(file.subfolder)
    const canonicalFilename = normalizeImageKitName(file.filename)
    const canonicalRel = canonicalRelPath(file.relPath)
    const targetPath = targetFilePath(root, canonicalRel)
    const existing = remoteByPath.get(targetPath)

    await emit({ type: 'file-start', index, total, relPath: file.relPath, size: file.size })

    const base: AssetSyncFileResult = {
      relPath: file.relPath,
      filename: canonicalFilename,
      folder: folderRel,
      size: file.size,
      upload: 'skipped',
      seed: 'not-run',
    }

    try {
      let ikInfo: { fileId: string; filePath: string; url: string; size: number } | null = null

      if (existing && existing.size === file.size) {
        // Byte-identical → reuse remote metadata, no re-upload.
        ikInfo = {
          fileId: existing.fileId,
          filePath: existing.filePath,
          url: existing.url,
          size: existing.size ?? file.size,
        }
        base.upload = 'skipped'
        await emit({ type: 'file-upload', index, total, relPath: file.relPath, action: 'skipped' })
      } else {
        await emit({
          type: 'file-upload',
          index,
          total,
          relPath: file.relPath,
          action: existing ? 'updated' : 'created',
        })
        const buffer = await fs.readFile(file.absPath)
        const uploaded: ImageKitUploadResult = await uploadBufferToImageKit({
          buffer,
          filename: canonicalFilename,
          mimeType: file.mimeType,
          subfolder: folderRel,
          useUniqueFileName: false,
          overwriteFile: Boolean(existing),
        })
        ikInfo = uploaded
        base.upload = existing ? 'updated' : 'created'
      }

      base.fileId = ikInfo.fileId
      base.url = ikInfo.url

      // ── Phase 3: upsert Payload Media doc ────────────────────────────────
      const alt = altFor(folderRel, canonicalFilename)
      const seedResult = await upsertMediaDoc({
        payload,
        alt,
        folderRel,
        ikInfo,
        forceUpdate: base.upload !== 'skipped',
        mimeType: file.mimeType,
      })
      base.seed = seedResult.status
      base.mediaId = seedResult.id
      if (seedResult.error) base.error = seedResult.error
    } catch (err) {
      base.upload = base.upload === 'skipped' ? 'error' : base.upload
      base.seed = 'error'
      base.error = err instanceof Error ? err.message : String(err)
    }

    results.push(base)
    await emit({
      type: 'file-done',
      index,
      total,
      relPath: file.relPath,
      upload: base.upload,
      seed: base.seed,
      url: base.url,
      mediaId: base.mediaId,
      error: base.error,
    })
  }

  const summary: AssetSyncSummary = {
    scanned: results.length,
    uploaded: results.filter((r) => r.upload === 'created').length,
    updated: results.filter((r) => r.upload === 'updated').length,
    uploadSkipped: results.filter((r) => r.upload === 'skipped').length,
    uploadErrors: results.filter((r) => r.upload === 'error').length,
    seeded: results.filter((r) => r.seed === 'created').length,
    seedUpdated: results.filter((r) => r.seed === 'updated').length,
    seedSkipped: results.filter((r) => r.seed === 'skipped').length,
    seedErrors: results.filter((r) => r.seed === 'error').length,
  }

  await emit({ type: 'summary', summary })
  return { results, summary }
}

/**
 * Find-or-create a Media doc whose `alt` matches the ImageKit asset.
 *
 * - Missing → fetch the file from ImageKit (so Payload can generate image
 *   sizes when applicable) and create. Pre-fills `imagekitFileId/Path/Url`
 *   so the cloud-storage adapter skips re-upload.
 * - Existing → patches in ImageKit metadata. If `forceUpdate` is true (the
 *   file was just uploaded/updated), the doc is patched even if metadata
 *   already matched.
 */
async function upsertMediaDoc(args: {
  payload: Payload
  alt: string
  folderRel: string
  ikInfo: { fileId: string; filePath: string; url: string; size: number }
  forceUpdate: boolean
  mimeType: string
}): Promise<{
  status: AssetSyncFileResult['seed']
  id?: string | number
  error?: string
}> {
  const { payload, alt, folderRel, ikInfo, forceUpdate, mimeType } = args

  try {
    const existing = await payload.find({
      collection: 'media',
      where: { alt: { equals: alt } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const found = existing.docs[0] as unknown as
      | (Record<string, unknown> & { id: string | number; imagekitFileId?: string })
      | undefined

    if (found) {
      if (!forceUpdate && found.imagekitFileId === ikInfo.fileId) {
        return { status: 'skipped', id: found.id }
      }
      const updated = await payload.update({
        collection: 'media',
        id: found.id,
        data: {
          alt,
          imagekitFolder: folderRel,
          imagekitFileId: ikInfo.fileId,
          imagekitFilePath: ikInfo.filePath,
          imagekitUrl: ikInfo.url,
          url: ikInfo.url,
        } as Record<string, unknown>,
        overrideAccess: true,
      })
      return { status: 'updated', id: updated.id }
    }

    const filename = path.basename(ikInfo.filePath)
    const file = await fetchRemoteFileAnyShape(ikInfo.url, filename, mimeType)
    const created = await payload.create({
      collection: 'media',
      data: {
        alt,
        imagekitFolder: folderRel,
        imagekitFileId: ikInfo.fileId,
        imagekitFilePath: ikInfo.filePath,
        imagekitUrl: ikInfo.url,
      } as Record<string, unknown>,
      file,
      overrideAccess: true,
    })
    return { status: 'created', id: created.id }
  } catch (err) {
    return {
      status: 'error',
      error: err instanceof Error ? err.message : String(err),
    }
  }
}
