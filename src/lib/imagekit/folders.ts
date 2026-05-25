import { getImageKit, getImageKitRoot } from './client'

/**
 * List sub-folders of the project root in ImageKit. Returns paths *relative*
 * to the root (e.g. `home`, `products/sesame-oil`), which is what we store on
 * the Media doc.
 */
export async function listImageKitSubfolders(): Promise<string[]> {
  const ik = getImageKit()
  const root = getImageKitRoot()
  const out = new Set<string>()
  const queue: string[] = [root]

  while (queue.length) {
    const path = queue.shift()!
    let skip = 0
    while (true) {
      const page = await ik.assets.list({
        path,
        type: 'folder',
        limit: 1000,
        skip,
        sort: 'ASC_NAME',
      })
      if (!page.length) break
      for (const item of page) {
        const folderPath = (item as { folderPath?: string }).folderPath
        if (!folderPath) continue
        if (folderPath === root) continue
        const rel = folderPath.startsWith(`${root}/`) ? folderPath.slice(root.length + 1) : folderPath
        out.add(rel)
        queue.push(folderPath)
      }
      if (page.length < 1000) break
      skip += 1000
    }
  }

  return Array.from(out).sort()
}

/** Create a new sub-folder under the project root. */
export async function createImageKitSubfolder(relPath: string): Promise<void> {
  const ik = getImageKit()
  const root = getImageKitRoot()
  const clean = relPath.replace(/^\/+|\/+$/g, '')
  if (!clean) throw new Error('Folder name required')
  await ik.folders.create({
    folderName: clean.split('/').pop()!,
    parentFolderPath: clean.includes('/')
      ? `${root}/${clean.split('/').slice(0, -1).join('/')}`
      : root,
  })
}
