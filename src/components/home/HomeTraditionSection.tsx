import Link from 'next/link'
import React from 'react'

import { WoodPressScene } from '@/components/home/WoodPressScene'
import { CowMark } from '@/components/ui/pt/CowMark'
import { Icons } from '@/components/ui/pt/Icons'
import { PtEyebrow } from '@/components/ui/pt/PtEyebrow'

export function HomeTraditionSection({
  eyebrow = 'Five generations',
  headlineLine1 = 'The Punyakoti',
  headlineItalic = 'tradition.',
  paragraph1 = 'For five generations, our family has practised the art of cold-pressing oils using traditional wooden churns — chekku in Tamil, kachi ghani in Hindi. This gentle method preserves the natural aroma, vital nutrients, and pure essence of the seed — uncorrupted by heat or chemical solvents.',
  paragraph2 = 'We source from trusted organic farmers who share our commitment to sustainable, earth-friendly agriculture. Every drop of Punyakoti Taila is a testament to purity.',
  ctaPrimary = { label: 'Discover our story', href: '/about' },
  ctaSecondary = { label: 'Visit the press', href: '/about#press' },
  mediaCaptionLeft = 'Batch #047 · 9-hour press',
  mediaCaptionRight = 'Erode · Tamil Nadu',
}: {
  eyebrow?: string | null
  headlineLine1?: string | null
  headlineItalic?: string | null
  paragraph1?: string | null
  paragraph2?: string | null
  ctaPrimary?: { label?: string | null; href?: string | null } | null
  ctaSecondary?: { label?: string | null; href?: string | null } | null
  mediaCaptionLeft?: string | null
  mediaCaptionRight?: string | null
}) {
  return (
    <section className="hp-tradition">
      <div className="hp-tradition__watermark" aria-hidden="true">
        <CowMark size={280} color="var(--green-900)" />
      </div>
      <div className="hp-max-1240 tradition-grid">
        <div>
          <PtEyebrow>{eyebrow}</PtEyebrow>
          <h2 className="hp-heading-tradition">
            {headlineLine1}
            <br />
            <em className="pt-display-italic" style={{ color: 'var(--mustard-600)' }}>
              {headlineItalic}
            </em>
          </h2>
          <p className="hp-prose hp-prose--max-520 hp-prose-tradition-first">{paragraph1}</p>
          <p className="hp-prose hp-prose--max-520 hp-prose-tradition-second">{paragraph2}</p>
          <div className="hp-tradition__links">
            <Link href={ctaPrimary?.href || '/about'} className="pt-link-editorial pt-link-editorial--green">
              {ctaPrimary?.label} <Icons.arrowRight size={14} />
            </Link>
            <Link href={ctaSecondary?.href || '/about#press'} className="pt-link-editorial pt-link-editorial--mustard">
              {ctaSecondary?.label}
            </Link>
          </div>
        </div>
        <div className="hp-tradition__media">
          <WoodPressScene />
          <div className="hp-tradition__stamp">
            <CowMark size={36} color="var(--mustard-400)" />
            <span className="hp-tradition__stamp-word">PUNYAKOTI</span>
            <span className="hp-tradition__stamp-sub">WOOD · PRESS</span>
          </div>
          <div className="hp-tradition__caption">
            <span>{mediaCaptionLeft}</span>
            <span className="hp-tradition__caption-accent">{mediaCaptionRight}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
