import type { Payload } from 'payload'

import { PLP_CATEGORIES, PLP_PRODUCTS } from '@/seed/plpCatalogSeed'

export type PlpSeedRow = {
  kind: 'category' | 'product'
  slug: string
  status: 'created' | 'updated' | 'skipped' | 'error'
  id?: string | number
  error?: string
}

export interface PlpSeedOptions {
  /**
   * When true, existing products are patched in place with the latest field
   * values from `PLP_PRODUCTS` (description, tag, tagline, useCases, …).
   * Variants and images are left untouched to avoid clobbering admin edits.
   */
  force?: boolean
}

/**
 * Seed PLP categories + products. Idempotent — existing slugs are skipped
 * unless `force: true`, in which case they are patched with the latest values.
 */
export async function runPlpCatalogSeed(
  payload: Payload,
  opts: PlpSeedOptions = {},
): Promise<{ results: PlpSeedRow[] }> {
  const results: PlpSeedRow[] = []
  const categoryIdBySlug = new Map<string, string | number>()
  const force = opts.force === true

  // Categories
  for (const cat of PLP_CATEGORIES) {
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

  // Products
  for (const p of PLP_PRODUCTS) {
    try {
      const existing = await payload.find({
        collection: 'products',
        where: { slug: { equals: p.slug } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      })
      const categoryId = categoryIdBySlug.get(p.categorySlug)
      if (!categoryId) {
        results.push({
          kind: 'product',
          slug: p.slug,
          status: 'error',
          error: `Missing category id for "${p.categorySlug}"`,
        })
        continue
      }

      // Field bag shared by both create and update paths. We omit `variants`
      // / `images` from updates so existing pricing and uploaded media survive
      // re-seeding.
      const editableFields = {
        name: p.name,
        oilVariant: p.oilVariant,
        tag: p.tag ?? undefined,
        categoryType: p.categoryType,
        useCases: p.useCases,
        certifications: p.certifications,
        category: categoryId,
        tagline: p.tagline,
        description: p.description,
        featured: p.featured,
        bestSeller: p.bestSeller,
      }

      if (existing.docs[0]) {
        if (!force) {
          results.push({
            kind: 'product',
            slug: p.slug,
            status: 'skipped',
            id: existing.docs[0].id,
          })
          continue
        }
        await payload.update({
          collection: 'products',
          id: existing.docs[0].id,
          overrideAccess: true,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data: editableFields as any,
        })
        results.push({
          kind: 'product',
          slug: p.slug,
          status: 'updated',
          id: existing.docs[0].id,
        })
        continue
      }

      await payload.create({
        collection: 'products',
        overrideAccess: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: {
          ...editableFields,
          slug: p.slug,
          status: 'published',
          variants: p.variants.map((v) => ({ ...v })),
          images: [],
        } as any,
      })
      results.push({ kind: 'product', slug: p.slug, status: 'created' })
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      results.push({ kind: 'product', slug: p.slug, status: 'error', error: message })
    }
  }

  return { results }
}
