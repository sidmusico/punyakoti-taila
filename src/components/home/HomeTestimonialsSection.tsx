import React from 'react'

import { FALLBACK_TESTIMONIALS } from '@/components/home/home-constants'
import { PtAvatarInitials, type PtAvatarTone } from '@/components/ui/pt/PtAvatarInitials'
import { PtEyebrow } from '@/components/ui/pt/PtEyebrow'
import { PtStars } from '@/components/ui/pt/PtStars'
import type { HomepageSetting, Testimonial } from '@/payload-types'

export type TestimonialBandRow = {
  id: string | number
  rating: number
  body: string
  customerName: string
  customerLocation: string
  initials: string
  avatarTone: PtAvatarTone
}

function initialsFromName(name: string) {
  const parts = name.split(/\s+/)
  return `${parts[0]?.[0] ?? '?'}${parts[1]?.[0] ?? ''}`
}

export function mapManualHomeTestimonials(
  items: NonNullable<NonNullable<HomepageSetting['testimonialsBand']>['manualItems']>,
): TestimonialBandRow[] {
  const tones: PtAvatarTone[] = ['warm', 'deep', 'sun']
  return (items ?? []).map((m, i) => ({
    id: m.id ?? `manual-${i}`,
    rating: m.rating ?? 5,
    body: m.body,
    customerName: m.customerName,
    customerLocation: m.customerLocation ?? '',
    initials: m.initials?.trim() ? m.initials : initialsFromName(m.customerName),
    avatarTone: tones[i % 3],
  }))
}

function testimonialRows(
  showFallback: boolean,
  testimonials: Testimonial[],
): TestimonialBandRow[] {
  if (showFallback) {
    return FALLBACK_TESTIMONIALS.map((t) => ({
      id: t.id,
      rating: t.rating,
      body: t.body,
      customerName: t.customerName,
      customerLocation: t.customerLocation,
      initials: t.initials,
      avatarTone: t.avatarTone,
    }))
  }
  const tones: PtAvatarTone[] = ['warm', 'deep', 'sun']
  return testimonials.map((t, i) => {
    const parts = (t.customerName ?? '').split(/\s+/)
    const initials = `${parts[0]?.[0] ?? '?'}${parts[1]?.[0] ?? ''}`
    return {
      id: t.id,
      rating: t.rating ?? 5,
      body: t.body || t.title || '',
      customerName: t.customerName ?? '',
      customerLocation: t.customerLocation ?? '',
      initials,
      avatarTone: tones[i % 3],
    }
  })
}

export function HomeTestimonialsSection({
  testimonials,
  showFallback,
  eyebrow = 'Letters from kitchens',
  headline = 'Trusted by 2,800+ kitchens',
  overrideRows,
}: {
  testimonials: Testimonial[]
  showFallback: boolean
  eyebrow?: string | null
  headline?: string | null
  overrideRows?: TestimonialBandRow[] | null
}) {
  const rows =
    overrideRows && overrideRows.length > 0
      ? overrideRows
      : testimonialRows(showFallback, testimonials)

  return (
    <section className="hp-testimonials">
      <div className="hp-container">
        <div className="hp-testimonials-eyebrow">
          <PtEyebrow center>{eyebrow}</PtEyebrow>
        </div>
        {headline ? (
          <p
            style={{
              textAlign: 'center',
              marginTop: 10,
              marginBottom: 0,
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
              color: 'var(--green-900)',
              letterSpacing: '-0.02em',
            }}
          >
            {headline}
          </p>
        ) : null}
        <div className="testimonials-grid hp-testimonials-grid">
          {rows.map((t) => (
            <figure key={t.id} className="hp-testimonial">
              <div className="hp-testimonial__thumb">
                <PtAvatarInitials initials={t.initials} tone={t.avatarTone} size={160} />
              </div>
              <figcaption className="hp-testimonial__cap">
                <div className="hp-testimonial__name">{t.customerName}</div>
                <div className="pt-mono-stamp hp-testimonial__loc">{t.customerLocation}</div>
              </figcaption>
              <PtStars value={t.rating} size={12} />
              <blockquote className="hp-testimonial__quote">&ldquo;{t.body}&rdquo;</blockquote>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
