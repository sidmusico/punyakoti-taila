import { toFile } from '@imagekit/nodejs'

import { getImageKit, getImageKitRoot } from './client'

export type ImageKitUploadResult = {
  fileId: string
  name: string
  filePath: string
  url: string
  size: number
  height?: number
  width?: number
}

/**
 * Upload a buffer to ImageKit under `<root>/<subfolder>/<filename>`.
 * `subfolder` is the user-picked or auto-derived folder slug — leading/trailing
 * slashes are normalised. Pass an empty string to upload at the project root.
 */
export async function uploadBufferToImageKit(args: {
  buffer: Buffer
  filename: string
  mimeType: string
  subfolder?: string | null
  useUniqueFileName?: boolean
  /** When true, replaces an existing file at the same path. */
  overwriteFile?: boolean
}): Promise<ImageKitUploadResult> {
  const ik = getImageKit()
  const root = getImageKitRoot()
  const sub = (args.subfolder || '').replace(/^\/+|\/+$/g, '')
  const folder = sub ? `${root}/${sub}` : root

  const upload = await ik.files.upload({
    file: await toFile(args.buffer, args.filename, { type: args.mimeType }),
    fileName: args.filename,
    folder,
    useUniqueFileName: args.useUniqueFileName ?? false,
    overwriteFile: args.overwriteFile ?? false,
  })

  if (!upload.fileId || !upload.filePath || !upload.url) {
    throw new Error(`[imagekit] upload returned incomplete payload: ${JSON.stringify(upload)}`)
  }

  return {
    fileId: upload.fileId,
    name: upload.name ?? args.filename,
    filePath: upload.filePath,
    url: upload.url,
    size: typeof upload.size === 'number' ? upload.size : args.buffer.byteLength,
    height: upload.height,
    width: upload.width,
  }
}

export async function deleteFromImageKit(fileId: string): Promise<void> {
  const ik = getImageKit()
  try {
    await ik.files.delete(fileId)
  } catch (err) {
    const status = (err as { status?: number }).status
    if (status === 404) return
    throw err
  }
}
