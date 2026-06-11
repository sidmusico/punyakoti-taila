import type { Payload } from 'payload'

import { getImageKitRoot } from '@/lib/imagekit/client'
import { listAllImageKitAssets, type ImageKitFile } from '@/lib/imagekit/listAll'
import { IMAGEKIT_CATALOG, IMAGEKIT_ROOT, type ImageKitCatalogEntry } from './imagekitCatalog.generated'
import { fetchRemoteFilePayloadShape } from './seedMediaUpload'

export type ImageKitMediaSeedResult = {
  kind: 'imagekit-media'
  alt: string
  fileId: string
  status: 'created' | 'updated' | 'skipped' | 'error'
  id?: string | number
  error?: string
}

/** Sub-folder relative to IMAGEKIT_ROOT (e.g. `home`, `products/sesame-oil`). */
function relFolder(entry: ImageKitCatalogEntry): string {
  if (entry.folder === IMAGEKIT_ROOT) return ''
  if (entry.folder.startsWith(`${IMAGEKIT_ROOT}/`)) return entry.folder.slice(IMAGEKIT_ROOT.length + 1)
  return entry.folder.replace(/^\/+/, '')
}

/** Derive the `alt` used to key Payload Media docs from the ImageKit file path. */
function altForImageKitFile(file: ImageKitFile): string {
  const stem = file.name.replace(/\.[a-z0-9]+$/i, '')
  const folderRel = relFolderFromPath(file.folder)
  const folderLeaf = folderRel.split('/').filter(Boolean).pop() || 'root'
  return `${folderLeaf}/${stem}`
}

function relFolderFromPath(folder: string): string {
  const root = getImageKitRoot()
  if (folder === root) return ''
  if (folder.startsWith(`${root}/`)) return folder.slice(root.length + 1)
  return folder.replace(/^\/+/, '')
}

/**
 * Pull every ImageKit file under the project root into the Payload `media`
 * collection.
 *
 * We fetch the **live** ImageKit listing (not the static
 * `imagekitCatalog.generated.ts`) so that files uploaded via the ImageKit
 * dashboard between catalog refreshes are not silently dropped. The static
 * catalog is still imported as a fallback so the seed step never crashes if
 * the live ImageKit API is unreachable during a CI run.
 *
 * Idempotent on the `alt` derived from the file path:
 * - **No row for this alt** → fetches the file from ImageKit (so Payload can
 *   generate image sizes) and creates the doc with ImageKit metadata already
 *   set, so the cloud-storage adapter doesn't re-upload it.
 * - **Row exists, missing imagekitFileId** → patches in the ImageKit metadata.
 * - **Row exists with same fileId** → skipped.
 */
export async function runImageKitMediaSeed(
  payload: Payload,
): Promise<{ results: ImageKitMediaSeedResult[] }> {
  const results: ImageKitMediaSeedResult[] = []

  // Build entries from the live ImageKit listing. Fall back to the cached
  // catalog if the API call fails (e.g. offline dev).
  let entries: ImageKitCatalogEntry[] = []
  try {
    const { files } = await listAllImageKitAssets()
    entries = files.map<ImageKitCatalogEntry>((f) => ({
      fileId: f.fileId,
      name: f.name,
      folder: f.folder,
      filePath: f.filePath,
      url: f.url,
      width: f.width,
      height: f.height,
      alt: altForImageKitFile(f),
    }))
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(
      '[runImageKitMediaSeed] live ImageKit fetch failed, falling back to generated catalog:',
      err instanceof Error ? err.message : String(err),
    )
    entries = [...IMAGEKIT_CATALOG]
  }

  for (const entry of entries) {
    try {
      const existing = await payload.find({
        collection: 'media',
        where: { alt: { equals: entry.alt } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      })

      const found = existing.docs[0] as unknown as
        | (Record<string, unknown> & { id: string | number; imagekitFileId?: string })
        | undefined

      if (found?.imagekitFileId === entry.fileId) {
        results.push({
          kind: 'imagekit-media',
          alt: entry.alt,
          fileId: entry.fileId,
          status: 'skipped',
          id: found.id,
        })
        continue
      }

      if (found) {
        const updated = await payload.update({
          collection: 'media',
          id: found.id,
          data: {
            alt: entry.alt,
            imagekitFolder: relFolder(entry),
            imagekitFileId: entry.fileId,
            imagekitFilePath: entry.filePath,
            imagekitUrl: entry.url,
            url: entry.url,
            ...(entry.width ? { width: entry.width } : {}),
            ...(entry.height ? { height: entry.height } : {}),
          } as Record<string, unknown>,
          overrideAccess: true,
        })
        results.push({
          kind: 'imagekit-media',
          alt: entry.alt,
          fileId: entry.fileId,
          status: 'updated',
          id: updated.id,
        })
        continue
      }

      // Create from scratch. Fetch the file so Payload can generate local
      // image sizes; suppress the cloud-storage re-upload by pre-filling
      // imagekitFileId/Path/Url (handleUpload will *still* run, so we need
      // to gate re-upload there — see note below).
      const file = await fetchRemoteFilePayloadShape(entry.url, entry.name.replace(/\.[a-z0-9]+$/i, ''))
      const created = await payload.create({
        collection: 'media',
        data: {
          alt: entry.alt,
          imagekitFolder: relFolder(entry),
          imagekitFileId: entry.fileId,
          imagekitFilePath: entry.filePath,
          imagekitUrl: entry.url,
        } as Record<string, unknown>,
        file,
        overrideAccess: true,
      })
      results.push({
        kind: 'imagekit-media',
        alt: entry.alt,
        fileId: entry.fileId,
        status: 'created',
        id: created.id,
      })
    } catch (err) {
      results.push({
        kind: 'imagekit-media',
        alt: entry.alt,
        fileId: entry.fileId,
        status: 'error',
        error: err instanceof Error ? err.message : String(err),
      })
    }
  }

  return { results }
}
