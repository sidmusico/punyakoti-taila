import type { Payload } from 'payload'

import {
  CATALOG_MEDIA,
  CATALOG_PRODUCTS,
} from '@/seed/productCatalogSeed'
import { runCategoriesSeed } from '@/seed/runCategoriesSeed'
import { ensureMediaByAltAndUrl } from '@/seed/seedMediaUpload'

export type ProductCatalogSeedRow = {
  kind: 'category' | 'media' | 'product'
  slug?: string
  alt?: string
  status: 'created' | 'skipped' | 'error'
  id?: string | number
  error?: string
}

async function ensureMediaId(payload: Payload, index: number): Promise<string | number> {
  const item = CATALOG_MEDIA[index]
  if (!item) throw new Error(`No catalog media at index ${index}`)
  return ensureMediaByAltAndUrl(payload, {
    alt: item.alt,
    url: item.url,
    basename: `seed-catalog-${index}`,
  })
}

/** Categories + demo products (same behaviour as GET /api/seed-products). */
export async function runProductCatalogSeed(
  payload: Payload,
): Promise<{ results: ProductCatalogSeedRow[] }> {
  const results: ProductCatalogSeedRow[] = []

  const { results: catRows, categoryIdBySlug } = await runCategoriesSeed(payload)
  for (const r of catRows) {
    results.push({ ...r, kind: 'category' })
  }

  for (const row of CATALOG_PRODUCTS) {
    try {
      const existing = await payload.find({
        collection: 'products',
        where: { slug: { equals: row.slug } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      })
      if (existing.docs[0]) {
        results.push({ kind: 'product', slug: row.slug, status: 'skipped', id: existing.docs[0].id })
        continue
      }

      const categoryId = categoryIdBySlug.get(row.categorySlug)
      if (!categoryId) {
        results.push({
          kind: 'product',
          slug: row.slug,
          status: 'error',
          error: `Missing category id for slug "${row.categorySlug}"`,
        })
        continue
      }

      const mediaId = await ensureMediaId(payload, row.mediaIndex)

      await payload.create({
        collection: 'products',
        overrideAccess: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: {
          name: row.name,
          slug: row.slug,
          oilVariant: row.oilVariant,
          tag: row.tag ?? undefined,
          categoryType: row.categoryType,
          category: categoryId,
          tagline: row.tagline,
          description: row.description,
          usageNote: row.usageNote,
          ratingDisplay: row.ratingDisplay,
          reviewsDisplay: row.reviewsDisplay,
          ratingStars: row.ratingStars,
          featured: row.featured,
          bestSeller: row.bestSeller,
          status: 'published',
          meta: row.meta,
          batch: row.batch,
          benefits: [...row.benefits],
          variants: row.variants.map((v) => ({ ...v })),
          images: [{ image: mediaId, alt: CATALOG_MEDIA[row.mediaIndex]?.alt ?? row.name }],
        } as any,
      })

      results.push({ kind: 'product', slug: row.slug, status: 'created' })
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      results.push({ kind: 'product', slug: row.slug, status: 'error', error: message })
    }
  }

  return { results }
}
