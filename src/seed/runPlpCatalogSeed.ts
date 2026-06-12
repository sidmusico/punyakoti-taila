import type { Payload } from 'payload'

import {
  buildProductImagesFromAlts,
  type ProductImageRow,
} from '@/seed/imageKitMediaResolve'
import { PLP_CATEGORIES, PLP_PRODUCTS } from '@/seed/plpCatalogSeed'
import { galleryAltsForPlpProduct } from '@/seed/plpProductImages'

export type PlpSeedRow = {
  kind: 'category' | 'product'
  slug: string
  status: 'created' | 'updated' | 'images_updated' | 'skipped' | 'error'
  id?: string | number
  error?: string
}

export interface PlpSeedOptions {
  /**
   * When true, existing products are patched in place with the latest field
   * values from `PLP_PRODUCTS` (description, tag, tagline, useCases, …).
   * Variants are left untouched. Images are backfilled when missing regardless.
   */
  force?: boolean
}

async function buildPlpProductImages(
  payload: Payload,
  slug: string,
  name: string,
  oilVariant: (typeof PLP_PRODUCTS)[number]['oilVariant'],
): Promise<ProductImageRow[]> {
  const alts = galleryAltsForPlpProduct(slug, oilVariant)
  return buildProductImagesFromAlts(payload, alts, name)
}

function productHasImages(
  doc: { images?: Array<{ image?: unknown }> | null } | undefined,
): boolean {
  return (doc?.images?.length ?? 0) > 0
}

/**
 * Seed PLP categories + products. Idempotent — existing slugs are skipped
 * unless `force: true`, in which case they are patched with the latest values.
 * Products with no images always get ImageKit gallery backfill on re-run.
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
        const doc = existing.docs[0] as { id: string | number; images?: ProductImageRow[] }
        const needsImages = !productHasImages(doc)
        const images = needsImages ? await buildPlpProductImages(payload, p.slug, p.name, p.oilVariant) : []

        if (!force && !needsImages) {
          results.push({
            kind: 'product',
            slug: p.slug,
            status: 'skipped',
            id: doc.id,
          })
          continue
        }

        const patch: Record<string, unknown> = {}
        if (force) Object.assign(patch, editableFields)
        if (needsImages && images.length > 0) patch.images = images

        if (Object.keys(patch).length === 0) {
          results.push({
            kind: 'product',
            slug: p.slug,
            status: 'skipped',
            id: doc.id,
            ...(needsImages && images.length === 0
              ? { error: 'No ImageKit media found for gallery alts' }
              : {}),
          })
          continue
        }

        await payload.update({
          collection: 'products',
          id: doc.id,
          overrideAccess: true,
          data: patch,
        })
        results.push({
          kind: 'product',
          slug: p.slug,
          status: needsImages && !force ? 'images_updated' : 'updated',
          id: doc.id,
        })
        continue
      }

      const images = await buildPlpProductImages(payload, p.slug, p.name, p.oilVariant)

      await payload.create({
        collection: 'products',
        overrideAccess: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: {
          ...editableFields,
          slug: p.slug,
          status: 'published',
          variants: p.variants.map((v) => ({ ...v })),
          images,
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
