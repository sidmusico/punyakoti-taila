import React from 'react'

import type { FallbackProduct } from '@/components/home/home-constants'
import { ShopProductCard } from '@/components/shop/ShopProductCard'
import { PtPill } from '@/components/ui/pt/PtPill'
import { PtSectionHeader } from '@/components/ui/pt/PtSectionHeader'
import type { Product } from '@/payload-types'

export function HomeBestSellersSection({
  bestSellers,
  eyebrow = 'Best sellers',
  headline = 'What kitchens keep reordering.',
  ctaLabel = 'Subscribe & save 15%',
  ctaHref = '/shop',
}: {
  bestSellers: (Product | FallbackProduct)[]
  eyebrow?: string | null
  headline?: string | null
  ctaLabel?: string | null
  ctaHref?: string | null
}) {
  return (
    <section className="hp-container">
      <PtSectionHeader
        eyebrow={eyebrow ?? 'Best sellers'}
        title={headline ?? 'What kitchens keep reordering.'}
        action={{ href: ctaHref || '/shop', label: ctaLabel ?? 'Shop', variant: 'mustard' }}
      />
      <div className="hp-section-body">
        <div className="bestsellers-grid">
          {bestSellers.map((p, i) => (
            <div key={p.slug} className="hp-bestseller-cell">
              {i === 0 ? (
                <div className="hp-bestseller-cell__ribbon">
                  <PtPill tone="mustard">#1 Best seller</PtPill>
                </div>
              ) : null}
              <ShopProductCard product={p} mode="compact" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
