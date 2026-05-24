import type { Payload } from 'payload'

import { CATALOG_MEDIA } from '@/seed/productCatalogSeed'
import { ensureMediaByAltAndUrl } from '@/seed/seedMediaUpload'

export type MediaSeedResult = {
  kind: 'media'
  alt?: string
  status: 'created' | 'skipped' | 'error'
  id?: string | number
  error?: string
}

/** Upload every catalog image (Unsplash → `public/media`) if no row with same `alt` exists. */
export async function runMediaCatalogSeed(payload: Payload): Promise<{ results: MediaSeedResult[] }> {
  const results: MediaSeedResult[] = []

  for (let index = 0; index < CATALOG_MEDIA.length; index++) {
    const item = CATALOG_MEDIA[index]!
    try {
      const existing = await payload.find({
        collection: 'media',
        where: { alt: { equals: item.alt } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      })
      if (existing.docs[0]) {
        results.push({ kind: 'media', alt: item.alt, status: 'skipped', id: existing.docs[0].id })
        continue
      }
      const id = await ensureMediaByAltAndUrl(payload, {
        alt: item.alt,
        url: item.url,
        basename: `seed-catalog-${index}`,
      })
      results.push({ kind: 'media', alt: item.alt, status: 'created', id })
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      results.push({ kind: 'media', alt: item.alt, status: 'error', error: message })
    }
  }

  return { results }
}
