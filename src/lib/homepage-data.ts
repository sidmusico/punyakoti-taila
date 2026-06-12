import config from '@payload-config'
import { getPayload } from 'payload'

import { BOTTLE_ROW_PRODUCT_SLUGS } from '@/seed/bottleRowProductSlugs'

import type { HomepageSetting, Product, Testimonial } from '@/payload-types'

function relationshipProducts(val: unknown): Product[] {
  if (!Array.isArray(val)) return []
  return val.filter((x): x is Product => typeof x === 'object' && x !== null && 'slug' in x)
}

export type HomepageStorefrontData = {
  homepage: Partial<HomepageSetting> | null
  featuredProducts: Product[]
  bestSellers: Product[]
  bottleRowProducts: Product[]
  testimonials: Testimonial[]
}

async function productsBySlugs(
  payload: Awaited<ReturnType<typeof getPayload>>,
  slugs: readonly string[],
): Promise<Product[]> {
  const out: Product[] = []
  for (const slug of slugs) {
    const hit = await payload.find({
      collection: 'products',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 1,
      overrideAccess: true,
    })
    if (hit.docs[0]) out.push(hit.docs[0] as Product)
  }
  return out
}

/**
 * Loads homepage global + catalog slices for the storefront.
 * Intentionally **not** wrapped in `unstable_cache`: Next.js 16 Data Cache + tag revalidation
 * was still serving stale snapshots; this route is `force-dynamic` and homepage traffic is moderate.
 */
export async function getHomepageData(): Promise<HomepageStorefrontData> {
  const payload = await getPayload({ config })

  let homepage: Partial<HomepageSetting> | null = null
  try {
    homepage = (await payload.findGlobal({
      slug: 'homepage-settings',
      depth: 2,
      overrideAccess: true,
    })) as Partial<HomepageSetting>
  } catch (err) {
    console.error('[getHomepageData] findGlobal("homepage-settings") failed:', err)
  }

  const [catalogOutcome, testimonialsOutcome] = await Promise.allSettled([
    payload.find({
      collection: 'products',
      where: { status: { equals: 'published' } },
      limit: 12,
      sort: 'displayOrder',
      depth: 1,
    }),
    payload.find({
      collection: 'testimonials',
      where: {
        and: [{ status: { equals: 'approved' } }, { featuredOnHome: { equals: true } }],
      },
      limit: 12,
      sort: '-createdAt',
      depth: 1,
    }),
  ])

  const docs: Product[] =
    catalogOutcome.status === 'fulfilled' ? (catalogOutcome.value.docs as Product[]) : []
  if (catalogOutcome.status === 'rejected') {
    console.error('[getHomepageData] products find failed:', catalogOutcome.reason)
  }

  const testimonialDocs: Testimonial[] =
    testimonialsOutcome.status === 'fulfilled'
      ? (testimonialsOutcome.value.docs as Testimonial[])
      : []
  if (testimonialsOutcome.status === 'rejected') {
    console.error('[getHomepageData] testimonials find failed:', testimonialsOutcome.reason)
  }

  const hp = homepage

  const featuredRel = relationshipProducts(hp?.featuredSection?.products)
  const featuredProducts =
    featuredRel.length > 0 ? featuredRel.slice(0, 6) : docs.slice(0, 6)

  const bs = hp?.bestSellers
  let bestSellers: Product[] = docs.slice(0, 4)
  if (bs?.source === 'manual') {
    const manual = relationshipProducts(bs.products)
    if (manual.length > 0) bestSellers = manual.slice(0, 4)
  }

  const bottleRel = relationshipProducts(hp?.bottleRow?.products)
  const bottleRowProducts =
    bottleRel.length > 0
      ? bottleRel.slice(0, 6)
      : await productsBySlugs(payload, BOTTLE_ROW_PRODUCT_SLUGS)

  const maxT = Math.min(Math.max(hp?.testimonialsBand?.maxItems ?? 3, 1), 12)
  const testimonials = testimonialDocs.slice(0, maxT)

  return {
    homepage: hp,
    featuredProducts,
    bestSellers,
    bottleRowProducts,
    testimonials,
  }
}
