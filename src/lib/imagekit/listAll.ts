import { getImageKit, getImageKitRoot, buildImageKitUrl } from './client'

export type ImageKitFile = {
  fileId: string
  name: string
  filePath: string
  folder: string
  url: string
  height?: number
  width?: number
  size?: number
  fileType?: string
}

export type ImageKitFolder = {
  folderPath: string
  name: string
}

const PAGE_LIMIT = 1000

/** Recursively walk ImageKit folders under `rootPath` and collect every file. */
export async function listAllImageKitAssets(rootPath: string = getImageKitRoot()): Promise<{
  folders: ImageKitFolder[]
  files: ImageKitFile[]
}> {
  const ik = getImageKit()
  const folders: ImageKitFolder[] = []
  const files: ImageKitFile[] = []
  const queue: string[] = [rootPath]

  while (queue.length) {
    const path = queue.shift()!
    let skip = 0
    while (true) {
      const page = await ik.assets.list({
        path,
        type: 'all',
        limit: PAGE_LIMIT,
        skip,
        sort: 'ASC_NAME',
      })
      if (!page.length) break

      for (const item of page) {
        // Folders have `type === 'folder'`; files have an explicit fileId.
        if ((item as { type?: string }).type === 'folder') {
          const folderPath = (item as { folderPath?: string }).folderPath
          const name = (item as { name?: string }).name
          if (folderPath && name) {
            folders.push({ folderPath, name })
            queue.push(folderPath)
          }
        } else {
          const f = item as {
            fileId?: string
            name?: string
            filePath?: string
            height?: number
            width?: number
            size?: number
            fileType?: string
          }
          if (!f.fileId || !f.name || !f.filePath) continue
          const folder = f.filePath.substring(0, f.filePath.lastIndexOf('/')) || '/'
          files.push({
            fileId: f.fileId,
            name: f.name,
            filePath: f.filePath,
            folder,
            url: buildImageKitUrl(f.filePath),
            height: f.height,
            width: f.width,
            size: f.size,
            fileType: f.fileType,
          })
        }
      }

      if (page.length < PAGE_LIMIT) break
      skip += PAGE_LIMIT
    }
  }

  return { folders, files }
}
