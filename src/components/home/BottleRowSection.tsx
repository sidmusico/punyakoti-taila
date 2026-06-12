'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import React from 'react'

import { BottleRowProductCard } from '@/components/home/bottle-row/BottleRowProductCard'
import type { Product } from '@/payload-types'

const BottleRowAmbientCanvas = dynamic(
  () =>
    import('@/components/home/bottle-row/BottleRowAmbientCanvas').then((m) => m.BottleRowAmbientCanvas),
  { ssr: false },
)

export function BottleRowSection({
  products,
  eyebrow = 'Six presses · one shelf',
  headlineBefore = 'The whole',
  headlineItalic = 'kitchen.',
  ctaLabel = 'Shop all six oils',
  ctaHref = '/shop',
}: {
  products: Product[]
  eyebrow?: string | null
  headlineBefore?: string | null
  headlineItalic?: string | null
  ctaLabel?: string | null
  ctaHref?: string | null
}) {
  const list = products.slice(0, 6)

  return (
    <section className="bottle-row-section">
      <BottleRowAmbientCanvas />
      <div className="bottle-row-section__vignette" aria-hidden />

      <div className="bottle-row-section__head">
        <div className="pt-eyebrow bottle-row-section__eyebrow">{eyebrow}</div>
        <h2 className="bottle-row-section__title">
          {headlineBefore}{' '}
          <em className="pt-display-italic bottle-row-section__title-accent">{headlineItalic}</em>
        </h2>
      </div>

      <div className="bottle-row-scroll">
        {list.map((product, i) => (
          <BottleRowProductCard key={product.id} product={product} index={i} />
        ))}
      </div>

      <div className="bottle-row-section__cta">
        <Link href={ctaHref || '/shop'} className="pt-btn pt-btn--mustard pt-btn--lg bottle-row-section__cta-btn">
          {ctaLabel}
        </Link>
      </div>
    </section>
  )
}
