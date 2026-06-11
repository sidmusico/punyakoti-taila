/**
 * Incremental seed helpers.
 *
 * `mergeMissing(existing, defaults)` returns a deep clone of `existing` with
 * any keys missing in `existing` filled from `defaults`. Used by seed routes
 * so a re-run only fills in newly-added fields (e.g. when we add a new tab to
 * Homepage settings) without clobbering content the admin has edited.
 *
 *  - Plain objects: recursed key-by-key.
 *  - Arrays: kept as-is when `existing` already has entries; otherwise copied
 *    from defaults. We intentionally do **not** merge arrays element-by-element
 *    because admin-edited array orders / IDs should never be reshuffled.
 *  - Scalars (string / number / boolean / null): existing value wins as long
 *    as it's defined. `null` and empty string are treated as "missing" so a
 *    blank field still gets backfilled.
 *  - `undefined` / missing keys in `existing`: filled from `defaults`.
 *
 * Returns a list of dotted paths that were filled, so callers can report what
 * actually changed.
 */

export type MergeReport = {
  merged: Record<string, unknown>
  filledPaths: string[]
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function isBlank(v: unknown): boolean {
  if (v === undefined || v === null) return true
  if (typeof v === 'string' && v.trim() === '') return true
  return false
}

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v))
}

function mergeInto(
  existing: unknown,
  defaults: unknown,
  pathPrefix: string,
  filled: string[],
): unknown {
  // If defaults isn't defined, keep existing as-is.
  if (defaults === undefined) return existing

  // Existing is blank — adopt the default and record the fill.
  if (isBlank(existing)) {
    filled.push(pathPrefix || '<root>')
    return clone(defaults)
  }

  // Both are plain objects → recurse key-by-key (union of keys, defaults wins
  // for missing entries).
  if (isPlainObject(existing) && isPlainObject(defaults)) {
    const out: Record<string, unknown> = { ...existing }
    for (const key of Object.keys(defaults)) {
      const nextPath = pathPrefix ? `${pathPrefix}.${key}` : key
      out[key] = mergeInto(existing[key], defaults[key], nextPath, filled)
    }
    return out
  }

  // Arrays — if existing has items, keep them; otherwise take defaults.
  if (Array.isArray(existing)) {
    if (existing.length === 0 && Array.isArray(defaults) && defaults.length > 0) {
      filled.push(pathPrefix || '<root>')
      return clone(defaults)
    }
    return existing
  }

  // Scalars: existing wins.
  return existing
}

export function mergeMissing(
  existing: unknown,
  defaults: Record<string, unknown>,
): MergeReport {
  const filled: string[] = []
  const merged = mergeInto(existing ?? {}, defaults, '', filled) as Record<string, unknown>
  return { merged, filledPaths: filled }
}
