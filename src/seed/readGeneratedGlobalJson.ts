import { readFile } from 'node:fs/promises'
import path from 'node:path'

/** Keys Payload adds on `findGlobal` exports — omit when re-importing via `updateGlobal`. */
const GLOBAL_EXPORT_OMIT = new Set(['id', 'globalType', 'createdAt', 'updatedAt'])

function stripGlobalExport(doc: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(doc).filter(([k]) => !GLOBAL_EXPORT_OMIT.has(k)))
}

/**
 * Reads `src/seed/generated/<filename>` if present (from GET /api/export-storefront-seed).
 */
export async function readGeneratedGlobalJson(
  filename: string,
): Promise<Record<string, unknown> | null> {
  const fp = path.join(process.cwd(), 'src', 'seed', 'generated', filename)
  try {
    const raw = await readFile(fp, 'utf8')
    return stripGlobalExport(JSON.parse(raw) as Record<string, unknown>)
  } catch {
    return null
  }
}
