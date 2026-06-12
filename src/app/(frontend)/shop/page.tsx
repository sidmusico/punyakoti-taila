import type { Metadata } from 'next'
import { connection } from 'next/server'
import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Where } from 'payload'

import { ShopProductCard } from '@/components/shop/ShopProductCard'
import { Breadcrumb } from '@/components/shop/Breadcrumb'
import { PlpCategoryChips } from '@/components/shop/PlpCategoryChips'
import { PlpLoadMore } from '@/components/shop/PlpLoadMore'
import { PlpFilterSidebar, type PlpFacetItem, type PlpFacets } from '@/components/shop/PlpFilterSidebar'
import { PlpSortMenu } from '@/components/shop/PlpSortMenu'
import { PlpFiltersDrawer } from '@/components/shop/PlpFiltersDrawer'
import { PlpAppliedFilters } from '@/components/shop/PlpAppliedFilters'
import {
  PLP_PAGE_SIZE,
  buildHref,
  parseFilters,
  type PlpFilters,
} from '@/lib/plp/filters'
import type { Category, Product } from '@/payload-types'

import '@/styles/plp.css'
import '@/styles/homepage.css'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'All oils — every press',
  description: 'Single-origin wood-pressed oils. Every press, every batch.',
}

// ── Label maps (mirror Products collection options) ─────────────────────
const SIZE_LABELS: Record<string, string> = {
  '250ml': '250 ml',
  '500ml': '500 ml',
  '1L': '1 litre',
  '5L': '5 litre',
}
const USE_LABELS: Record<string, string> = {
  'daily-cooking': 'Daily cooking',
  tempering: 'Tempering',
  salad: 'Salad',
  'hair-body': 'Hair & body',
  ayurvedic: 'Ayurvedic',
}

// ── Where-clause builder ────────────────────────────────────────────────
// We deliberately only filter by `status` + `category` at the Payload layer.
// Size / use / price are applied in-memory against the *default variant* so
// the filter outcome matches the price shown on each card (Payload's
// `variants.*` filters use a JOIN that matches if ANY variant satisfies the
// predicate, which causes products to slip through even though the price the
// shopper sees is outside the range).
function buildWhere(categoryId: number | null): Where {
  const and: Where[] = [{ status: { equals: 'published' } }]
  if (categoryId != null) and.push({ category: { equals: categoryId } })
  return and.length === 1 ? and[0]! : { and }
}

/** First `isDefault` variant, else the first variant. */
function pickDisplayVariant(p: Product): NonNullable<Product['variants']>[number] | undefined {
  const variants = p.variants ?? []
  return variants.find((v) => v.isDefault) ?? variants[0]
}

function displayPrice(p: Product): number {
  return pickDisplayVariant(p)?.price ?? 0
}

function hasAnyVariantSize(p: Product, sizes: string[]): boolean {
  if (sizes.length === 0) return true
  return (p.variants ?? []).some((v) => v.size && sizes.includes(v.size))
}

function hasAnyUseCase(p: Product, uses: string[]): boolean {
  if (uses.length === 0) return true
  const got = (p.useCases ?? []) as string[]
  return uses.some((u) => got.includes(u))
}

function inPriceRange(p: Product, lo: number | null, hi: number | null): boolean {
  const price = displayPrice(p)
  if (lo != null && price < lo) return false
  if (hi != null && price > hi) return false
  return true
}

function sortProducts(arr: Product[], sort: PlpFilters['sort']): Product[] {
  const list = [...arr]
  switch (sort) {
    case 'price-asc':
      list.sort((a, b) => displayPrice(a) - displayPrice(b))
      return list
    case 'price-desc':
      list.sort((a, b) => displayPrice(b) - displayPrice(a))
      return list
    case 'newest':
      list.sort((a, b) => {
        const at = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const bt = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return bt - at
      })
      return list
    default:
      // featured: featured-first, then newest
      list.sort((a, b) => {
        const af = a.featured ? 1 : 0
        const bf = b.featured ? 1 : 0
        if (af !== bf) return bf - af
        const at = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const bt = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return bt - at
      })
      return list
  }
}

// ── Facet count helper ──────────────────────────────────────────────────
function tally<T extends string>(
  products: Product[],
  pick: (p: Product) => T | T[] | undefined | null,
  labels: Record<string, string>,
): PlpFacetItem[] {
  const counts = new Map<string, number>()
  for (const p of products) {
    const v = pick(p)
    const list: string[] = Array.isArray(v) ? v : v ? [v] : []
    for (const val of list) counts.set(val, (counts.get(val) ?? 0) + 1)
  }
  return Object.keys(labels)
    .map((value) => ({ value, label: labels[value]!, count: counts.get(value) ?? 0 }))
    .filter((row) => row.count > 0)
}

// ── Page ────────────────────────────────────────────────────────────────
type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> }

export default async function ShopPage({ searchParams }: PageProps) {
  await connection()
  const sp = await searchParams
  const filters = parseFilters(sp)
  const payload = await getPayload({ config })

  // Categories (top chips)
  const { docs: categoryDocs } = await payload.find({
    collection: 'categories',
    sort: 'title',
    limit: 50,
    depth: 0,
    overrideAccess: true,
  })

  let activeCategory: Category | null = null
  if (filters.cat) {
    const hit = await payload.find({
      collection: 'categories',
      where: { slug: { equals: filters.cat } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    activeCategory = (hit.docs[0] as Category) ?? null
  }

  // Fetch every published product in the active category (or all). All
  // size/use/price filtering and sorting happens below in JS so we can match
  // the *displayed* default-variant price instead of "any variant in range".
  const where = buildWhere(activeCategory?.id ?? null)
  const { docs: allDocs } = await payload.find({
    collection: 'products',
    where,
    depth: 2,
    limit: 500,
    overrideAccess: true,
  })
  const allProducts = allDocs as Product[]

  // Facet counts: based on the category-scoped set, ignoring size/use/price
  // selections so the user sees how many oils each remaining option would
  // surface. Price range labels also use this set.
  const displayPrices = allProducts.map(displayPrice).filter((n) => n > 0)
  const facets: PlpFacets = {
    sizes: tally(
      allProducts,
      (p) => ((p.variants ?? []).map((v) => v.size) as string[]),
      SIZE_LABELS,
    ),
    uses: tally(allProducts, (p) => (p.useCases as string[] | undefined) ?? [], USE_LABELS),
    priceMin: displayPrices.length ? Math.floor(Math.min(...displayPrices)) : 0,
    priceMax: displayPrices.length ? Math.ceil(Math.max(...displayPrices)) : 1000,
  }

  // Apply size, use, and price-range filters in JS — against the default
  // variant's price so the filter outcome lines up with what's shown.
  const filteredProducts = allProducts.filter(
    (p) =>
      hasAnyVariantSize(p, filters.sizes) &&
      hasAnyUseCase(p, filters.uses) &&
      inPriceRange(p, filters.priceMin, filters.priceMax),
  )

  // Sort, then paginate.
  const sortedProducts = sortProducts(filteredProducts, filters.sort)
  const totalCount = sortedProducts.length
  const limit = PLP_PAGE_SIZE * filters.page
  const products = sortedProducts.slice(0, limit)
  const activeFilterCount =
    filters.sizes.length +
    filters.uses.length +
    (filters.priceMin != null || filters.priceMax != null ? 1 : 0)

  const oilWord = totalCount === 1 ? 'oil' : 'oils'

  // Chips ordered: All + Edible · daily, Edible · ceremonial, Wellness, Gift sets, Subscriptions
  const chipOrder = [
    'edible-daily',
    'edible-ceremonial',
    'wellness',
    'gift-sets',
    'subscriptions',
  ]
  const chipCategories = (categoryDocs as Category[])
    .slice()
    .sort((a, b) => {
      const ai = chipOrder.indexOf(a.slug ?? '')
      const bi = chipOrder.indexOf(b.slug ?? '')
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi)
    })

  return (
    <div className="plp-page">
      <div className="plp-head pt-page-container">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            ...(activeCategory ? [{ label: 'Shop', href: '/shop' }] : []),
            { label: activeCategory ? activeCategory.title : 'All oils' },
          ]}
          className="mb-0"
        />

        <div className="plp-hero">
          <div>
            <div className="pt-eyebrow">
              {activeCategory ? 'Browsing' : 'The full collection'}
            </div>
            <h1 className="plp-hero__title">
              {activeCategory ? (
                <>
                  {activeCategory.title},{' '}
                  <em className="pt-display-italic">every press.</em>
                </>
              ) : (
                <>
                  Every oil, <em className="pt-display-italic">every press.</em>
                </>
              )}
            </h1>
          </div>
          <div className="plp-hero__meta">
            <span className="plp-hero__meta-count">{totalCount}</span> {oilWord}
            {' · '}
            <span className="plp-hero__meta-stamp">Updated Mon</span>
          </div>
        </div>
      </div>

      <PlpCategoryChips filters={filters} chipCategories={chipCategories} />

      <div className="plp-body pt-page-container">
        <PlpFilterSidebar filters={filters} facets={facets} />

        <div className="plp-main">
          <div className="plp-toolbar">
            <div className="plp-toolbar__count">
              {totalCount} {oilWord}
              {activeFilterCount > 0 ? ` · ${activeFilterCount} active filter${activeFilterCount === 1 ? '' : 's'}` : ''}
            </div>
            <div className="plp-toolbar__sort">
              <span className="plp-toolbar__sort-label">Sort by</span>
              <PlpSortMenu filters={filters} variant="inline" />
            </div>
          </div>

          <div className="plp-mobile-bar">
            <PlpFiltersDrawer filters={filters}>
              <PlpFilterSidebar filters={filters} facets={facets} />
            </PlpFiltersDrawer>
            <PlpSortMenu filters={filters} variant="button" />
          </div>

          <PlpAppliedFilters
            filters={filters}
            categoryLabel={activeCategory?.title}
            sizeLabels={SIZE_LABELS}
            useLabels={USE_LABELS}
          />

          {products.length === 0 ? (
            <div className="plp-empty">
              <p>No oils match these filters.</p>
              <Link href="/shop" className="pt-btn pt-btn--ghost pt-btn--sm">
                Clear filters
              </Link>
            </div>
          ) : (
            <div
              className="plp-grid"
              // page intentionally excluded: "Load more" must append in place,
              // not remount the whole grid (which also flashes loaded images).
              key={`${filters.sort}-${filters.cat}-${filters.sizes.join(',')}-${filters.uses.join(',')}-${filters.priceMin ?? ''}-${filters.priceMax ?? ''}`}
            >
              {(products as Product[]).map((p) => (
                <ShopProductCard key={p.id} product={p} mode="featured" />
              ))}
            </div>
          )}

          {products.length < totalCount ? (
            <PlpLoadMore
              href={buildHref(filters, { page: filters.page + 1 })}
              shown={products.length}
              total={totalCount}
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}
