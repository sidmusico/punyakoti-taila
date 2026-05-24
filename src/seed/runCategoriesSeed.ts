import type { Payload } from 'payload'

import { CATALOG_CATEGORIES } from '@/seed/productCatalogSeed'

export type SeedRowResult = {
  kind: 'category'
  slug?: string
  status: 'created' | 'skipped' | 'error'
  id?: string | number
  error?: string
}

/** Idempotent category documents (slug match). */
export async function runCategoriesSeed(payload: Payload): Promise<{
  results: SeedRowResult[]
  categoryIdBySlug: Map<string, string | number>
}> {
  const results: SeedRowResult[] = []
  const categoryIdBySlug = new Map<string, string | number>()

  for (const cat of CATALOG_CATEGORIES) {
    try {
      const hit = await payload.find({
        collection: 'categories',
        where: { slug: { equals: cat.slug } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      })
      if (hit.docs[0]) {
        categoryIdBySlug.set(cat.slug, hit.docs[0].id)
        results.push({ kind: 'category', slug: cat.slug, status: 'skipped', id: hit.docs[0].id })
        continue
      }
      const created = await payload.create({
        collection: 'categories',
        data: { title: cat.title, slug: cat.slug },
        overrideAccess: true,
      })
      categoryIdBySlug.set(cat.slug, created.id)
      results.push({ kind: 'category', slug: cat.slug, status: 'created', id: created.id })
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      results.push({ kind: 'category', slug: cat.slug, status: 'error', error: message })
    }
  }

  return { results, categoryIdBySlug }
}
