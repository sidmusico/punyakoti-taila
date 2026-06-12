import Link from 'next/link'
import React from 'react'

import { Bottle, type OilVariant } from '@/components/ui/pt/Bottle'
import { CowMark } from '@/components/ui/pt/CowMark'
import { Icons } from '@/components/ui/pt/Icons'
import { PtEyebrow } from '@/components/ui/pt/PtEyebrow'
import { PtStars } from '@/components/ui/pt/PtStars'
import { resolveMediaAlt, resolveMediaUrl, type MediaLike } from '@/utilities/mediaUrl'
import { cn } from '@/utilities/ui'

function renderLine2WithItalic(line2: string, italicWord: string | null | undefined) {
  if (!italicWord) return line2
  const idx = line2.indexOf(italicWord)
  if (idx < 0) {
    return (
      <>
        {line2}{' '}
        <em className="pt-display-italic" style={{ color: 'var(--mustard-600)' }}>
          {italicWord}
        </em>
      </>
    )
  }
  return (
    <>
      {line2.slice(0, idx)}
      <em className="pt-display-italic" style={{ color: 'var(--mustard-600)' }}>
        {italicWord}
      </em>
      {line2.slice(idx + italicWord.length)}
    </>
  )
}

export function HomeHeroEditorial({
  eyebrow = 'Est. from a village press',
  headlineLine1 = 'Pressed slowly,',
  headlineLine2 = 'on wood.',
  headlineItalicWord = 'wood.',
  body = "The way your grandmother's kitchen smelled. Unrefined oils from wooden ghanis in Erode and Coimbatore — bottled within 72 hours, shipped to your kitchen in eight days.",
  primaryCTA = { label: 'Shop the collection', href: '/shop' },
  secondaryCTA = { label: 'Read our story', href: '/about' },
  reviewRating = '4.9 / 5',
  reviewCount = '2,847 verified kitchens',
  bottleVariant = 'sesame',
  originCaptionLeft = 'Single origin',
  originCaptionRight = 'Erode · Tamil Nadu',
  backgroundStyle = 'cream',
  image,
}: {
  eyebrow?: string | null
  headlineLine1?: string | null
  headlineLine2?: string | null
  headlineItalicWord?: string | null
  body?: string | null
  primaryCTA?: { label?: string | null; href?: string | null } | null
  secondaryCTA?: { label?: string | null; href?: string | null } | null
  reviewRating?: string | null
  reviewCount?: string | null
  bottleVariant?: OilVariant | null
  originCaptionLeft?: string | null
  originCaptionRight?: string | null
  backgroundStyle?: 'cream' | 'dark-green' | 'warm-white' | null
  image?: MediaLike
}) {
  const imageUrl = resolveMediaUrl(image)
  const imageAlt = resolveMediaAlt(image, 'Punyakoti hero')
  const bgClass =
    backgroundStyle === 'warm-white'
      ? 'hp-hero-editorial--warm-white'
      : backgroundStyle === 'dark-green'
        ? 'hp-hero-editorial--dark-green'
        : ''
  const eyebrowVariant = backgroundStyle === 'dark-green' ? 'onDark' : 'default'

  return (
    <section className={cn('hp-hero-editorial', bgClass)}>
      <div className="hp-hero-editorial__decor hp-hero-editorial__decor--tl" aria-hidden="true">
        <CowMark size={140} color="var(--green-800)" />
      </div>
      <div className="hp-hero-editorial__decor hp-hero-editorial__decor--tr" aria-hidden="true">
        <CowMark size={220} color="var(--green-900)" />
      </div>

      <div className="hp-container hero-grid">
        <div className="hp-hero-editorial__copy">
          <PtEyebrow variant={eyebrowVariant}>{eyebrow}</PtEyebrow>
          <h2 className="hp-heading-editorial">
            {headlineLine1}
            <br />
            {renderLine2WithItalic(headlineLine2 ?? '', headlineItalicWord)}
          </h2>
          <p className="hp-hero-editorial__prose">{body}</p>
          <div className="hp-hero-editorial__actions">
            <Link href={primaryCTA?.href || '/shop'} className="pt-btn pt-btn--primary pt-btn--lg">
              {primaryCTA?.label}
            </Link>
            <Link href={secondaryCTA?.href || '/about'} className="pt-btn pt-btn--ghost pt-btn--lg pt-btn-inline-icon">
              {secondaryCTA?.label} <Icons.arrowRight size={16} />
            </Link>
          </div>
          <div className="hp-hero-editorial__rating">
            <PtStars value={5} size={15} />
            <div className="hp-hero-editorial__rating-text">
              <span className="hp-hero-editorial__rating-strong">{reviewRating}</span> · {reviewCount}
            </div>
          </div>
        </div>

        <div className="hp-hero-editorial__bottle hero-bottle">
          <div className="hp-hero-editorial__bottle-frame">
            <div className="hp-hero-editorial__grain" />
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt={imageAlt} className="hp-hero-editorial__bottle-image" />
            ) : (
              <div className="hp-hero-editorial__bottle-shadow">
                <Bottle variant={bottleVariant ?? 'sesame'} size={280} />
              </div>
            )}
            <div className="hp-hero-editorial__bottle-caption">
              <span>{originCaptionLeft}</span>
              <span className="hp-hero-editorial__bottle-caption-accent">{originCaptionRight}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
