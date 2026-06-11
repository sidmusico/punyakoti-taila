import config from '@payload-config'
import { getPayload } from 'payload'

import type { HomepageSetting, Product, Testimonial } from '@/payload-types'

function relationshipProducts(val: unknown): Product[] {
  if (!Array.isArray(val)) return []
  return val.filter((x): x is Product => typeof x === 'object' && x !== null && 'slug' in x)
}

export type ServiceLocationCity = {
  id: string | number
  cityName: string
  state?: string | null
}

export type HomepageStorefrontData = {
  homepage: Partial<HomepageSetting> | null
  featuredProducts: Product[]
  bestSellers: Product[]
  testimonials: Testimonial[]
  serviceLocations: ServiceLocationCity[]
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

  const [catalogOutcome, testimonialsOutcome, serviceLocationsOutcome] =
    await Promise.allSettled([
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
        depth: 0,
      }),
      // Marquee source — only enabled rows, sorted by displayOrder then name.
      // The `service-locations` collection may not exist yet on a brand-new DB
      // (before `pnpm cms:sync`), in which case this Promise rejects and we
      // gracefully fall back to the band's built-in city list.
      payload.find({
        collection: 'service-locations',
        where: { enabled: { not_equals: false } },
        limit: 50,
        sort: 'displayOrder',
        depth: 0,
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

  const maxT = Math.min(Math.max(hp?.testimonialsBand?.maxItems ?? 3, 1), 12)
  const testimonials = testimonialDocs.slice(0, maxT)

  let serviceLocations: ServiceLocationCity[] = []
  if (serviceLocationsOutcome.status === 'fulfilled') {
    serviceLocations = (serviceLocationsOutcome.value.docs as Array<{
      id: string | number
      cityName?: string | null
      state?: string | null
    }>)
      .filter((d) => typeof d.cityName === 'string' && d.cityName.trim().length > 0)
      .map((d) => ({ id: d.id, cityName: d.cityName as string, state: d.state ?? null }))
  } else {
    // First boot before `cms:sync` (table doesn't exist) — log once and
    // continue. The PressBand will use its built-in fallback cities.
    console.warn(
      '[getHomepageData] service-locations find failed (run `pnpm cms:sync` after adding the collection):',
      serviceLocationsOutcome.reason,
    )
  }

  return { homepage: hp, featuredProducts, bestSellers, testimonials, serviceLocations }
}
