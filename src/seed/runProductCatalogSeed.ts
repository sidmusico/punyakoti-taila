import type { Payload } from 'payload'

import {
  CATALOG_MEDIA,
  CATALOG_PRODUCTS,
} from '@/seed/productCatalogSeed'
import {
  buildProductImagesFromAlts,
  type ProductImageRow,
} from '@/seed/imageKitMediaResolve'
import { runCategoriesSeed } from '@/seed/runCategoriesSeed'
import { ensureMediaByAltAndUrl } from '@/seed/seedMediaUpload'

export type ProductCatalogSeedRow = {
  kind: 'category' | 'media' | 'product'
  slug?: string
  alt?: string
  status: 'created' | 'updated' | 'skipped' | 'error'
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

/** Build the `images` array for a catalog row: ImageKit gallery first, Unsplash fallback. */
async function buildProductImages(
  payload: Payload,
  row: (typeof CATALOG_PRODUCTS)[number],
): Promise<ProductImageRow[]> {
  const galleryAlts: readonly string[] = (row as { galleryAlts?: readonly string[] }).galleryAlts ?? []
  const images = await buildProductImagesFromAlts(payload, galleryAlts, row.name)

  if (images.length === 0) {
    const mediaId = await ensureMediaId(payload, row.mediaIndex)
    images.push({ image: mediaId, alt: CATALOG_MEDIA[row.mediaIndex]?.alt ?? row.name })
  }

  return images
}

/** True when an existing product already uses the expected ImageKit gallery. */
function hasExpectedGallery(
  existingImages: Array<{ image?: unknown; alt?: string | null }> | null | undefined,
  expected: ProductImageRow[],
): boolean {
  if (!existingImages || existingImages.length !== expected.length) return false
  const existingAlts = existingImages.map((i) => i.alt ?? '')
  return expected.every((e, idx) => existingAlts[idx] === e.alt)
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

      const rowExtras = row as {
        useCases?: readonly string[]
        certifications?: readonly string[]
      }

      if (existing.docs[0]) {
        // Product exists — refresh its gallery if it still uses legacy
        // (Unsplash) images or an out-of-date alt list, and backfill the
        // PLP filter facets (useCases / certifications) when missing.
        const doc = existing.docs[0] as unknown as {
          id: string | number
          images?: Array<{ image?: unknown; alt?: string | null }>
          useCases?: string[] | null
          certifications?: string[] | null
        }
        const expected = await buildProductImages(payload, row)
        const galleryOk = hasExpectedGallery(doc.images, expected)
        const facetsOk =
          (!rowExtras.useCases?.length || (doc.useCases?.length ?? 0) > 0) &&
          (!rowExtras.certifications?.length || (doc.certifications?.length ?? 0) > 0)

        if (galleryOk && facetsOk) {
          results.push({ kind: 'product', slug: row.slug, status: 'skipped', id: doc.id })
        } else {
          await payload.update({
            collection: 'products',
            id: doc.id,
            data: {
              ...(galleryOk ? {} : { images: expected }),
              ...(doc.useCases?.length || !rowExtras.useCases?.length
                ? {}
                : { useCases: [...rowExtras.useCases] }),
              ...(doc.certifications?.length || !rowExtras.certifications?.length
                ? {}
                : { certifications: [...rowExtras.certifications] }),
            } as Record<string, unknown>,
            overrideAccess: true,
          })
          results.push({ kind: 'product', slug: row.slug, status: 'updated', id: doc.id })
        }
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

      const images = await buildProductImages(payload, row)

      await payload.create({
        collection: 'products',
        overrideAccess: true,
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
          benefits: [...row.benefits],
          variants: row.variants.map((v) => ({ ...v })),
          images,
          ...(rowExtras.useCases?.length ? { useCases: [...rowExtras.useCases] } : {}),
          ...(rowExtras.certifications?.length
            ? { certifications: [...rowExtras.certifications] }
            : {}),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
