import fs from 'node:fs/promises'
import path from 'node:path'

export type LocalAsset = {
  /** Path relative to the assets root, using forward slashes (e.g. `home/foo.png`). */
  relPath: string
  /** Absolute path on disk. */
  absPath: string
  /** Just the basename. */
  filename: string
  /** Sub-folder relative to assets root (`""` for top-level). */
  subfolder: string
  size: number
  mtimeMs: number
  mimeType: string
}

const MIME_BY_EXT: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.bmp': 'image/bmp',
  '.ico': 'image/x-icon',
  '.tiff': 'image/tiff',
  '.heic': 'image/heic',
  '.mp4': 'video/mp4',
  '.m4v': 'video/mp4',
  '.mov': 'video/quicktime',
  '.webm': 'video/webm',
  '.mkv': 'video/x-matroska',
  '.avi': 'video/x-msvideo',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.pdf': 'application/pdf',
  '.json': 'application/json',
  '.txt': 'text/plain',
  '.md': 'text/markdown',
  '.zip': 'application/zip',
}

function mimeForExt(ext: string): string {
  return MIME_BY_EXT[ext.toLowerCase()] || 'application/octet-stream'
}

/** Files/folders the walker silently skips — system noise, not user assets. */
function isIgnored(name: string): boolean {
  if (name.startsWith('.')) return true // .DS_Store, .claude, etc.
  if (name === 'node_modules' || name === '__MACOSX') return true
  if (name === 'Thumbs.db') return true
  return false
}

/**
 * Recursively list files under `assetsRoot`. The shape mirrors what the
 * ImageKit sync needs: relative path (for placement), absolute path (for
 * reading), size + mtime (for change detection), and a best-effort MIME type.
 */
export async function walkLocalAssets(assetsRoot: string): Promise<LocalAsset[]> {
  const out: LocalAsset[] = []
  async function walk(dir: string) {
    let entries
    try {
      entries = await fs.readdir(dir, { withFileTypes: true })
    } catch (err) {
      if ((err as { code?: string }).code === 'ENOENT') return
      throw err
    }
    for (const ent of entries) {
      if (isIgnored(ent.name)) continue
      const abs = path.join(dir, ent.name)
      if (ent.isDirectory()) {
        await walk(abs)
      } else if (ent.isFile()) {
        const rel = path.relative(assetsRoot, abs).split(path.sep).join('/')
        const stat = await fs.stat(abs)
        const ext = path.extname(ent.name)
        const subfolder = path.dirname(rel)
        out.push({
          relPath: rel,
          absPath: abs,
          filename: ent.name,
          subfolder: subfolder === '.' ? '' : subfolder,
          size: stat.size,
          mtimeMs: stat.mtimeMs,
          mimeType: mimeForExt(ext),
        })
      }
    }
  }
  await walk(assetsRoot)
  return out.sort((a, b) => a.relPath.localeCompare(b.relPath))
}
