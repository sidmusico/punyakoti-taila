import type { Adapter, GeneratedAdapter } from '@payloadcms/plugin-cloud-storage/types'

import { deleteFromImageKit, uploadBufferToImageKit } from '@/lib/imagekit/upload'
import { getImageKitRoot, getImageKitUrlEndpoint } from '@/lib/imagekit/client'

/**
 * Cloud-storage adapter that backs Payload Media uploads with ImageKit.
 *
 * - On upload: pushes the file to `<IMAGEKIT_FOLDER>/<doc.imagekitFolder>/<filename>`,
 *   stores `imagekitFileId`, `imagekitFilePath`, `imagekitUrl` on the doc, and
 *   returns the relative URL Payload should use for the file.
 * - On delete: removes the file from ImageKit (if `imagekitFileId` is present).
 * - URL generation: returns the absolute ImageKit URL so storefront `<img>` tags
 *   load directly from the CDN, skipping Payload's own /api/media/file route.
 * - Static handler: a thin proxy that redirects to ImageKit when Payload's own
 *   admin tries to serve the file (used by the admin's preview thumbnails).
 */
export const imagekitAdapter = (): Adapter => {
  return ({ collection }): GeneratedAdapter => {
    return {
      name: 'imagekit',
      fields: [
        {
          name: 'imagekitFileId',
          type: 'text',
          admin: { readOnly: true, position: 'sidebar', description: 'ImageKit fileId.' },
        },
        {
          name: 'imagekitFilePath',
          type: 'text',
          admin: { readOnly: true, position: 'sidebar' },
        },
        {
          name: 'imagekitUrl',
          type: 'text',
          admin: { readOnly: true, position: 'sidebar' },
        },
      ],
      async handleUpload({ file, data }) {
        // Seed pipeline pre-fills imagekitFileId so we don't re-upload an
        // asset that already lives in ImageKit. Skip the upload but keep the
        // local file write so admin thumbnails/image sizes still generate.
        if ((data as { imagekitFileId?: string }).imagekitFileId) {
          return
        }

        // `data.imagekitFolder` is the sub-folder the admin picked on the
        // Media doc form (see Media collection field). May be empty → uploads
        // land at the project root.
        const subfolder =
          typeof (data as { imagekitFolder?: string | null }).imagekitFolder === 'string'
            ? (data as { imagekitFolder: string }).imagekitFolder
            : ''

        const result = await uploadBufferToImageKit({
          buffer: file.buffer,
          filename: file.filename,
          mimeType: file.mimeType,
          subfolder,
          useUniqueFileName: false,
        })

        // Mutate the data Payload is about to persist so the IK metadata is
        // saved on the same write.
        ;(data as Record<string, unknown>).imagekitFileId = result.fileId
        ;(data as Record<string, unknown>).imagekitFilePath = result.filePath
        ;(data as Record<string, unknown>).imagekitUrl = result.url
        // Overwrite Payload's `url` so cms.media.url is the ImageKit URL.
        ;(data as Record<string, unknown>).url = result.url
      },
      async handleDelete({ doc }) {
        const fileId = (doc as { imagekitFileId?: string }).imagekitFileId
        if (!fileId) return
        await deleteFromImageKit(fileId)
      },
      generateURL({ data, filename }) {
        // IMPORTANT: this runs for the main file *and* once per image size
        // (thumbnail, square, etc.) with a size-specific filename like
        // `Lap-Twilights-300x300.png`. We must rebuild the URL deterministically
        // from folder + filename — `data.imagekitUrl` only ever holds the main
        // file's URL, so falling back to it would return the wrong URL for
        // every size.
        const endpoint = getImageKitUrlEndpoint()
        const root = getImageKitRoot()
        const subfolder =
          typeof (data as { imagekitFolder?: string | null }).imagekitFolder === 'string'
            ? (data as { imagekitFolder: string }).imagekitFolder
            : ''
        const cleanSub = subfolder.replace(/^\/+|\/+$/g, '')
        const folderPath = cleanSub ? `${root}/${cleanSub}` : root
        return `${endpoint}${folderPath}/${filename}`
      },
      async staticHandler(_req, args) {
        const doc = args.doc as { imagekitUrl?: string; url?: string; filename?: string } | undefined
        const url = doc?.imagekitUrl || doc?.url
        if (url) {
          return Response.redirect(url, 302)
        }
        return new Response(`Not found: ${args.params.filename} in ${collection.slug}`, {
          status: 404,
        })
      },
    }
  }
}
