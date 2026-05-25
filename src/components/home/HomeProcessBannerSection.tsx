import Link from 'next/link'
import React from 'react'

import { SectionBackgroundImage } from '@/components/home/SectionBackgroundImage'
import { Icons } from '@/components/ui/pt/Icons'
import { PtEyebrow } from '@/components/ui/pt/PtEyebrow'
import type { MediaLike } from '@/utilities/mediaUrl'
import { cn } from '@/utilities/ui'

export function HomeProcessBannerSection({
  eyebrow = 'How we press',
  headlineLine1 = 'The ghani has turned',
  headlineLine2 = 'for a thousand years.',
  body,
  stats,
  ctaLabel = 'Read our story',
  ctaHref = '/about',
  backgroundImage,
}: {
  eyebrow?: string | null
  headlineLine1?: string | null
  headlineLine2?: string | null
  body?: string | null
  stats?:
    | {
        value: string
        label: string
        id?: string | null
      }[]
    | null
  ctaLabel?: string | null
  ctaHref?: string | null
  backgroundImage?: MediaLike
}) {
  const grid = stats?.length ? stats.slice(0, 4) : []

  return (
    <section className={cn('hp-process-banner', backgroundImage && 'section-has-bg-image')}>
      <SectionBackgroundImage media={backgroundImage} altFallback="Process banner" />
      <div className="hp-container">
        <div className="hp-process-banner__intro">
          <PtEyebrow>{eyebrow}</PtEyebrow>
          <h2 className="hp-heading-process-banner">
            {headlineLine1}
            <br />
            <em className="pt-display-italic hp-italic-mustard-600">{headlineLine2}</em>
          </h2>
          {body ? <p className="hp-prose hp-process-banner__body">{body}</p> : null}
        </div>
        {grid.length > 0 ? (
          <div className="hp-process-banner__stats">
            {grid.map((s, i) => (
              <div key={s.id ?? `${s.value}-${i}`} className="hp-process-banner__stat">
                <div className="hp-process-banner__stat-value">{s.value}</div>
                <div className="hp-process-banner__stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        ) : null}
        {ctaLabel && ctaHref ? (
          <Link
            href={ctaHref}
            className="pt-text-link pt-text-link--green pt-btn-inline-icon hp-process-banner__cta"
          >
            {ctaLabel} <Icons.arrowRight size={14} />
          </Link>
        ) : null}
      </div>
    </section>
  )
}
