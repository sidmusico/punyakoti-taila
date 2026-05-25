'use client'

import { Bottle } from '@/components/ui/pt/Bottle'
import type { OilVariant } from '@/components/ui/pt/Bottle'
import Link from 'next/link'

const BOTTLES: { variant: OilVariant; name: string }[] = [
  { variant: 'sesame', name: 'Sesame' },
  { variant: 'coconut', name: 'Coconut' },
  { variant: 'groundnut', name: 'Groundnut' },
  { variant: 'mustard', name: 'Mustard' },
  { variant: 'sunflower', name: 'Sunflower' },
  { variant: 'blackSes', name: 'Black Til' },
]

export function BottleRowSection({
  eyebrow = 'Six presses · one shelf',
  headlineBefore = 'The whole',
  headlineItalic = 'kitchen.',
  ctaLabel = 'Shop all six oils',
  ctaHref = '/shop',
}: {
  eyebrow?: string | null
  headlineBefore?: string | null
  headlineItalic?: string | null
  ctaLabel?: string | null
  ctaHref?: string | null
}) {
  return (
    <section
      style={{
        padding: '80px 0 96px',
        background: 'var(--green-950)',
        color: 'var(--cream-100)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ textAlign: 'center', padding: '0 clamp(20px, 6vw, 80px)', marginBottom: 64 }}>
        <div className="pt-eyebrow" style={{ color: 'var(--mustard-400)', justifyContent: 'center' }}>
          {eyebrow}
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 400,
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            color: 'var(--cream-100)',
            margin: '16px 0 0',
          }}
        >
          {headlineBefore}{' '}
          <em className="pt-display-italic" style={{ color: 'var(--mustard-400)' }}>
            {headlineItalic}
          </em>
        </h2>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 'clamp(20px, 3vw, 40px)',
          padding: '0 clamp(20px, 4vw, 60px)',
          overflowX: 'auto',
        }}
        className="bottle-row-scroll"
      >
        {BOTTLES.map(({ variant, name }, i) => (
          <Link
            key={variant}
            href={`/shop/${variant}-oil`}
            style={{ textDecoration: 'none', flexShrink: 0 }}
          >
            <div
              className={i % 2 === 0 ? 'pt-float' : 'pt-float-slow'}
              style={{
                animationDelay: `${i * 0.4}s`,
                textAlign: 'center',
                cursor: 'pointer',
              }}
            >
              <Bottle variant={variant} size={160} />
              <div
                style={{
                  marginTop: 14,
                  fontFamily: 'var(--font-display)',
                  fontSize: 18,
                  color: 'var(--cream-100)',
                  letterSpacing: '-0.01em',
                }}
              >
                {name}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: 56 }}>
        <Link href={ctaHref || '/shop'} className="pt-btn pt-btn--mustard pt-btn--lg">
          {ctaLabel}
        </Link>
      </div>
    </section>
  )
}
