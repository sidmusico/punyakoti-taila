import Link from 'next/link'
import React from 'react'

import { WoodPressScene } from '@/components/home/WoodPressScene'
import { resolveMediaAlt, resolveMediaUrl, type MediaLike } from '@/utilities/mediaUrl'

export function HomeHeroCinematic({
  badge = 'Traditional extraction',
  headlineLine1 = 'The essence of',
  headlineItalic = 'purity.',
  lead = 'Handcrafted cold-pressed oils, honouring ancient Ayurvedic wisdom for modern wellness. Single-origin. Wooden-press. Bottled within 72 hours.',
  ctaLabel = 'Shop the collection',
  ctaHref = '/shop',
  image,
}: {
  badge?: string | null
  headlineLine1?: string | null
  headlineItalic?: string | null
  lead?: string | null
  ctaLabel?: string | null
  ctaHref?: string | null
  image?: MediaLike
}) {
  const imageUrl = resolveMediaUrl(image)
  const imageAlt = resolveMediaAlt(image, 'Punyakoti cinematic hero')
  return (
    <section className="hp-hero-cinematic">
      <div className="hp-hero-cinematic__bg">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={imageAlt} className="hp-hero-cinematic__bg-image" />
        ) : (
          <WoodPressScene />
        )}
      </div>
      <div className="hp-hero-cinematic__scrim" />
      <div className="hp-hero-cinematic__content">
        <div className="hp-hero-cinematic__badge">
          <span className="hp-hero-cinematic__badge-dot" />
          {badge}
        </div>
        <h1 className="hp-heading-hero">
          {headlineLine1}
          <br />
          <em className="pt-display-italic" style={{ color: 'var(--cream-100)' }}>
            {headlineItalic}
          </em>
        </h1>
        <p className="hp-hero-cinematic__lead">{lead}</p>
        <Link href={ctaHref || '/shop'} className="pt-btn pt-btn--primary pt-btn--lg hp-hero-cinematic__cta">
          {ctaLabel}
        </Link>
      </div>
      <div className="wp-scroll-cue hp-hero-cinematic__scroll" aria-hidden="true">
        <span>Scroll</span>
        <span className="hp-hero-cinematic__scroll-line" />
      </div>
    </section>
  )
}
