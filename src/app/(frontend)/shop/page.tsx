import type { Metadata } from 'next'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'

import { Bottle } from '@/components/ui/pt/Bottle'
import type { OilVariant } from '@/components/ui/pt/Bottle'
import { AddToCartButton } from '@/components/shop/AddToCartButton'
import { Icons } from '@/components/ui/pt/Icons'
import type { Where } from 'payload'
import type { Category, Media, Product } from '@/payload-types'
import { getStorefrontBundle } from '@/utilities/getStorefrontBundle'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { labelForVariantSize } from '@/utilities/variantSizeLabel'

export const dynamic = 'force-dynamic'

interface PLPPageProps {
  searchParams: Promise<{ cat?: string; category?: string; sort?: string }>
}

function shopHref(opts: { cat?: string; category?: string; sort?: string }): string {
  const p = new URLSearchParams()
  if (opts.cat) p.set('cat', opts.cat)
  if (opts.category) p.set('category', opts.category)
  if (opts.sort && opts.sort !== 'default') p.set('sort', opts.sort)
  const q = p.toString()
  return q ? `/shop?${q}` : '/shop'
}

function applyPlaceholders(
  template: string,
  vars: { count: number; oilWord: string; category: string },
): string {
  return template
    .replace(/\{count\}/g, String(vars.count))
    .replace(/\{oilWord\}/g, vars.oilWord)
    .replace(/\{category\}/g, vars.category)
}

export async function generateMetadata(): Promise<Metadata> {
  const { storefront } = await getStorefrontBundle()
  const plp = storefront.plp
  return {
    title: plp?.metaTitle ?? 'Shop',
    description: plp?.metaDescription ?? undefined,
  }
}

function cardImage(product: Product): { src: string; alt: string } | null {
  const row = product.images?.[0]
  const img = row?.image
  if (typeof img === 'object' && img && 'url' in img && img.url) {
    const m = img as Media
    return {
      src: getMediaUrl(m.url, m.updatedAt ?? null),
      alt: (row.alt && row.alt.trim()) || m.alt || product.name,
    }
  }
  return null
}

export default async function ShopPage({ searchParams }: PLPPageProps) {
  const { cat = '', category = '', sort = 'default' } = await searchParams
  const { storefront } = await getStorefrontBundle()
  const plp = storefront.plp
  const sizeRows = storefront.pdp?.variantSizeLabels

  const payload = await getPayload({ config })

  const { docs: categoryDocs } = await payload.find({
    collection: 'categories',
    sort: 'title',
    limit: 100,
    depth: 0,
  })

  let activeCategory: Category | null = null
  if (cat) {
    const hit = await payload.find({
      collection: 'categories',
      where: { slug: { equals: cat } },
      limit: 1,
      depth: 0,
    })
    activeCategory = (hit.docs[0] as Category) ?? null
  }

  const conditions: Where[] = [{ status: { equals: 'published' } }]

  if (activeCategory) {
    conditions.push({ category: { equals: activeCategory.id } })
  } else if (category) {
    conditions.push({ categoryType: { equals: category } })
  }

  const whereClause: Where = conditions.length > 1 ? { and: conditions } : conditions[0]!

  const { docs: products } = await payload.find({
    collection: 'products',
    where: whereClause,
    depth: 2,
    limit: 48,
    sort: sort === 'price-asc' ? 'variants.price' : sort === 'price-desc' ? '-variants.price' : '-featured',
  })

  const typeFilters =
    plp?.categoryFilters?.filter((c) => c?.label) ?? [
      { label: 'All', value: '' },
      { label: 'Cooking Oils', value: 'cooking' },
      { label: 'Wellness', value: 'wellness' },
    ]

  const sortOpts =
    plp?.sortOptions?.filter((s) => s?.label && s?.value) ?? [
      { label: 'Featured', value: 'default' },
      { label: 'Price: Low → High', value: 'price-asc' },
      { label: 'Price: High → Low', value: 'price-desc' },
    ]

  const oilWord = products.length === 1 ? 'oil' : 'oils'
  const categoryTitle = activeCategory?.title ?? ''

  const introDefaults = {
    count: products.length,
    oilWord,
    category: categoryTitle,
  }

  const eyebrow =
    activeCategory && plp?.eyebrowWhenCategory
      ? applyPlaceholders(plp.eyebrowWhenCategory, introDefaults)
      : (plp?.eyebrow ?? 'The collection')

  const headline =
    activeCategory && plp?.headlineWhenCategory
      ? applyPlaceholders(plp.headlineWhenCategory, introDefaults)
      : (plp?.headline ?? 'All oils')

  const introLine =
    activeCategory && plp?.introWhenCategory
      ? applyPlaceholders(plp.introWhenCategory, introDefaults)
      : (plp?.introWithCount ?? '{count} single-origin wood-pressed {oilWord}')
          .replace(/\{count\}/g, String(products.length))
          .replace(/\{oilWord\}/g, oilWord)

  return (
    <div className="max-w-[1440px] mx-auto px-8 md:px-16 py-12">
      <div className="mb-10">
        <div
          className="flex items-center gap-2.5 mb-3"
          style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--mustard-600)' }}
        >
          <span style={{ display: 'inline-block', width: 24, height: 1, background: 'var(--mustard-500)' }} />
          {eyebrow}
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.0, letterSpacing: '-0.025em', color: 'var(--green-900)', margin: 0 }}>
          {headline}
        </h1>
        <p className="mt-3 text-lg" style={{ color: 'var(--ink-500)' }}>
          {introLine}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        <aside className="shrink-0 md:w-52">
          <div className="sticky top-28 flex flex-col gap-7">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--ink-400)' }}>
                {plp?.filterCategoryLabel ?? 'Category'}
              </h3>
              <div className="flex flex-col gap-1.5">
                <Link
                  href={shopHref({ sort, category })}
                  className="text-sm py-1.5 px-3 rounded-lg transition-colors"
                  style={{
                    background: !cat ? 'var(--green-900)' : 'transparent',
                    color: !cat ? 'var(--cream-100)' : 'var(--ink-700)',
                    fontWeight: !cat ? 600 : 400,
                  }}
                >
                  All
                </Link>
                {(categoryDocs as Category[]).map((c) => {
                  const slug = c.slug ?? ''
                  const isActive = cat === slug
                  return (
                    <Link
                      key={c.id}
                      href={shopHref({ cat: slug, category, sort })}
                      className="text-sm py-1.5 px-3 rounded-lg transition-colors"
                      style={{
                        background: isActive ? 'var(--green-900)' : 'transparent',
                        color: isActive ? 'var(--cream-100)' : 'var(--ink-700)',
                        fontWeight: isActive ? 600 : 400,
                      }}
                    >
                      {c.title}
                    </Link>
                  )
                })}
              </div>
            </div>

            {typeFilters.some((t) => (t.value ?? '') !== '') && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--ink-400)' }}>
                  Type
                </h3>
                <div className="flex flex-col gap-1.5">
                  {typeFilters.map((row) => {
                    const value = row.value ?? ''
                    const isActive = category === value
                    return (
                      <Link
                        key={`type-${row.label}-${value}`}
                        href={shopHref({ cat, category: value, sort })}
                        className="text-sm py-1.5 px-3 rounded-lg transition-colors"
                        style={{
                          background: isActive ? 'var(--green-900)' : 'transparent',
                          color: isActive ? 'var(--cream-100)' : 'var(--ink-700)',
                          fontWeight: isActive ? 600 : 400,
                        }}
                      >
                        {row.label}
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--ink-400)' }}>
                {plp?.filterSortLabel ?? 'Sort by'}
              </h3>
              <div className="flex flex-col gap-1.5">
                {sortOpts.map((row) => {
                  const v = row.value
                  const isActive = sort === v
                  return (
                    <Link
                      key={v}
                      href={shopHref({ cat, category, sort: v })}
                      className="text-sm py-1.5 px-3 rounded-lg transition-colors"
                      style={{
                        background: isActive ? 'var(--green-900)' : 'transparent',
                        color: isActive ? 'var(--cream-100)' : 'var(--ink-700)',
                        fontWeight: isActive ? 600 : 400,
                      }}
                    >
                      {row.label}
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex gap-2 flex-wrap mb-6 md:hidden">
            <Link
              href={shopHref({ sort, category })}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors"
              style={
                !cat
                  ? { background: 'var(--green-900)', color: 'var(--cream-100)', borderColor: 'var(--green-900)' }
                  : { background: 'var(--cream-100)', color: 'var(--green-900)', borderColor: 'var(--cream-400)' }
              }
            >
              All
            </Link>
            {(categoryDocs as Category[]).map((c) => {
              const slug = c.slug ?? ''
              const isActive = cat === slug
              return (
                <Link
                  key={`m-cat-${c.id}`}
                  href={shopHref({ cat: slug, category, sort })}
                  className="px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors"
                  style={
                    isActive
                      ? { background: 'var(--green-900)', color: 'var(--cream-100)', borderColor: 'var(--green-900)' }
                      : { background: 'var(--cream-100)', color: 'var(--green-900)', borderColor: 'var(--cream-400)' }
                  }
                >
                  {c.title}
                </Link>
              )
            })}
          </div>

          <div className="flex gap-2 flex-wrap mb-4 md:hidden">
            {typeFilters.map((row) => {
              const value = row.value ?? ''
              const isActive = category === value
              return (
                <Link
                  key={`m-type-${row.label}-${value}`}
                  href={shopHref({ cat, category: value, sort })}
                  className="px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors"
                  style={
                    isActive
                      ? { background: 'var(--green-900)', color: 'var(--cream-100)', borderColor: 'var(--green-900)' }
                      : { background: 'var(--cream-100)', color: 'var(--green-900)', borderColor: 'var(--cream-400)' }
                  }
                >
                  {row.label}
                </Link>
              )
            })}
          </div>

          {products.length === 0 && (
            <div className="py-20 text-center" style={{ color: 'var(--ink-400)' }}>
              <p className="text-lg">{plp?.emptyTitle ?? 'No products found in this category.'}</p>
              <Link
                href={plp?.emptyCtaHref ?? '/shop'}
                className="mt-4 inline-block text-sm underline"
                style={{ color: 'var(--green-800)' }}
              >
                {plp?.emptyCtaLabel ?? 'View all oils'}
              </Link>
            </div>
          )}

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {(products as Product[]).map((p) => {
              const variantsSorted = [...(p.variants ?? [])].sort((a, b) => {
                if (a.isDefault === b.isDefault) return 0
                return a.isDefault ? -1 : 1
              })
              const defaultVariant = variantsSorted[0] ?? p.variants?.[0]
              const price = defaultVariant?.price ?? 0
              const size = defaultVariant?.size ?? ''
              const sku = defaultVariant?.sku ?? `${p.slug}-default`
              const variantLabel = labelForVariantSize(size, sizeRows)
              const oilVariant = (p.oilVariant as OilVariant | null) ?? 'sesame'
              const photo = cardImage(p)

              return (
                <div key={p.id} className="group">
                  <Link href={`/shop/${p.slug}`}>
                    <div
                      className="rounded-2xl p-5 flex flex-col transition-all duration-[240ms] hover:-translate-y-1 hover:shadow-md"
                      style={{ background: 'var(--cream-100)', boxShadow: 'var(--sh-sm)', position: 'relative' }}
                    >
                      {p.tag && (
                        <div className="absolute top-3 left-3 z-10">
                          <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full" style={{ background: 'var(--mustard-100)', color: 'var(--mustard-700)' }}>
                            {p.tag}
                          </span>
                        </div>
                      )}

                      <div className="rounded-xl flex items-center justify-center relative overflow-hidden" style={{ background: 'var(--cream-200)', padding: '28px 12px 12px', aspectRatio: '1/1.1' }}>
                        {photo ? (
                          <Image
                            src={photo.src}
                            alt={photo.alt}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, 33vw"
                          />
                        ) : (
                          <Bottle variant={oilVariant} size={140} />
                        )}
                      </div>

                      <div className="mt-3">
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.04em', color: 'var(--wood-600)', textTransform: 'uppercase' }}>
                          {p.region}
                        </div>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 20, color: 'var(--green-900)', marginTop: 3 }}>
                          {p.name}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3 gap-2">
                        <div>
                          <span className="font-semibold text-base" style={{ color: 'var(--green-900)' }}>₹{price}</span>
                          <span className="text-xs ml-1.5" style={{ color: 'var(--ink-400)' }}>· {variantLabel}</span>
                        </div>
                        <Icons.heart size={16} style={{ color: 'var(--ink-300)' }} />
                      </div>
                    </div>
                  </Link>
                  <div className="mt-2">
                    <AddToCartButton
                      productId={String(p.id)}
                      slug={p.slug}
                      name={p.name}
                      variantSize={variantLabel}
                      sku={sku}
                      price={price}
                      className="w-full"
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
