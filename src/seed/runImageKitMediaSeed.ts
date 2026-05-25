import type { Payload } from 'payload'

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

/**
 * Pull each file in the generated ImageKit catalog into the Payload `media`
 * collection. Idempotent on the catalog's `alt` value:
 *
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

  for (const entry of IMAGEKIT_CATALOG) {
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
