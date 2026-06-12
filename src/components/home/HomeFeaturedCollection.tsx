import React from 'react'

import { FALLBACK_PRODUCTS, type FallbackProduct } from '@/components/home/home-constants'
import { ShopProductCard } from '@/components/shop/ShopProductCard'
import { PtSectionHeader } from '@/components/ui/pt/PtSectionHeader'
import type { Product } from '@/payload-types'

export function HomeFeaturedCollection({
  products,
  showFallback,
  eyebrow = 'The collection',
  headline = 'Six oils, one philosophy',
  body = 'Pressed slowly on wooden ghanis. Bottled within 72 hours of pressing.',
  ctaLabel = 'Shop all',
  ctaHref = '/shop',
  columns = '3',
}: {
  products: Product[]
  showFallback: boolean
  eyebrow?: string | null
  headline?: string | null
  body?: string | null
  ctaLabel?: string | null
  ctaHref?: string | null
  columns?: '2' | '3' | '4' | null
}) {
  const list: (Product | FallbackProduct)[] = showFallback ? FALLBACK_PRODUCTS : products.slice(0, 6)
  const cols = columns === '2' || columns === '4' ? Number(columns) : 3

  return (
    <section className="hp-container">
      <PtSectionHeader
        eyebrow={eyebrow ?? 'The collection'}
        title={headline ?? 'Six oils, one philosophy'}
        description={body ?? undefined}
        action={{ href: ctaHref || '/shop', label: ctaLabel ?? 'Shop all', variant: 'green' }}
      />
      <div className="hp-section-body">
        <div className="products-grid" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {list.map((p) => (
            <ShopProductCard key={p.slug} product={p} mode="featured" />
          ))}
        </div>
      </div>
    </section>
  )
}
