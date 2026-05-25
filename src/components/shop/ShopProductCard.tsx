import type { Product } from '@/payload-types'
import Link from 'next/link'
import React from 'react'

import { AddToCartButton } from '@/components/shop/AddToCartButton'
import { Bottle } from '@/components/ui/pt/Bottle'
import type { OilVariant } from '@/components/ui/pt/Bottle'
import { Icons } from '@/components/ui/pt/Icons'
import { PtPill, type PtPillTone } from '@/components/ui/pt/PtPill'
import { cn } from '@/utilities/ui'

import type { FallbackProduct } from '@/components/home/home-constants'

export const SHOP_PRODUCT_BADGE_TONES: Record<string, PtPillTone> = {
  'Best seller': 'mustard',
  Limited: 'dark',
  'New harvest': 'mustard',
  'Cold-pressed': 'green',
  Pungent: 'terra',
  'Daily cook': 'green',
}

export function ShopProductCard({
  product,
  mode,
}: {
  product: Product | FallbackProduct
  mode: 'featured' | 'compact'
}) {
  const isDb = 'variants' in product && Array.isArray((product as Product).variants)
  const variant = isDb ? ((product as Product).variants?.[0] as { price?: number; size?: string; sku?: string } | undefined) : undefined
  const price = variant?.price ?? (product as FallbackProduct).price ?? 0
  const size = variant?.size ?? (product as FallbackProduct).size ?? '500 ml'
  const slug = product.slug
  const name = product.name
  const oilVariant = (product as { oilVariant?: OilVariant }).oilVariant ?? 'sesame'
  const tag = isDb
    ? ((product as Product).tag ?? undefined)
    : ((product as FallbackProduct).badge ?? undefined)
  const stampLine = isDb
    ? ((product as Product).region ?? variant?.sku ?? '')
    : (product as FallbackProduct).origin

  const pileTone = tag ? (SHOP_PRODUCT_BADGE_TONES[tag] ?? 'green') : 'green'

  if (mode === 'featured') {
    return (
      <div className={cn('pt-card', 'hp-product-card', 'hp-product-card--featured')}>
        {tag ? (
          <div className="hp-product-card__badge-slot">
            <PtPill tone={pileTone}>{tag}</PtPill>
          </div>
        ) : null}
        <div className="hp-product-card__wish">
          <Icons.heart size={18} />
        </div>
        <Link href={`/shop/${slug}`}>
          <div className="hp-product-card__image-wrap hp-product-card__image-wrap--featured">
            <Bottle variant={oilVariant} size={180} />
          </div>
        </Link>
        <div className="hp-product-card__meta">
          <div className="pt-mono-stamp">{stampLine || 'Single-origin'}</div>
          <div className="hp-product-card__title hp-product-card__title--featured">{name}</div>
        </div>
        <div className="hp-product-card__row hp-product-card__row--featured">
          <div>
            <span className="hp-product-card__price hp-product-card__price--featured">₹{price}</span>
            <span className="hp-product-card__size hp-product-card__size--featured">· {size}</span>
          </div>
          {isDb ? (
            <AddToCartButton
              productId={String((product as Product).id)}
              slug={slug}
              name={name}
              variantSize={variant?.size ?? '500ml'}
              sku={variant?.sku ?? slug}
              price={price}
              className="pt-btn pt-btn--ghost pt-btn--sm"
            />
          ) : (
            <Link href={`/shop/${slug}`} className="pt-btn pt-btn--ghost pt-btn--sm pt-btn-inline-icon">
              <Icons.plus size={13} /> Add
            </Link>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('pt-card', 'hp-product-card', 'hp-product-card--compact')}>
      <div className="hp-product-card__wish hp-product-card__wish--compact">
        <Icons.heart size={16} />
      </div>
      <Link href={`/shop/${slug}`}>
        <div className="hp-product-card__image-wrap hp-product-card__image-wrap--compact">
          <Bottle variant={oilVariant} size={130} />
        </div>
      </Link>
      <div className="hp-product-card__meta hp-product-card__meta--compact">
        <div className="pt-mono-stamp">{stampLine || ''}</div>
        <div className="hp-product-card__title hp-product-card__title--compact">{name}</div>
      </div>
      <div className="hp-product-card__row hp-product-card__row--compact">
        <div>
          <span className="hp-product-card__price hp-product-card__price--compact">₹{price}</span>
          <span className="hp-product-card__size hp-product-card__size--compact">· {size}</span>
        </div>
        <Link href={`/shop/${slug}`} className="pt-btn pt-btn--ghost pt-btn--sm">
          Add
        </Link>
      </div>
    </div>
  )
}
