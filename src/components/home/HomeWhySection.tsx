import Link from 'next/link'
import React from 'react'

import { Icons } from '@/components/ui/pt/Icons'
import { PtEyebrow } from '@/components/ui/pt/PtEyebrow'

type BenefitIcon = 'leaf' | 'drop' | 'shield' | 'star' | 'check'

const DEFAULT_CARDS: { icon: BenefitIcon; title: string; body: string }[] = [
  {
    icon: 'leaf',
    title: 'Lignans intact',
    body: 'Wood-pressing preserves sesamin and sesamol — the antioxidants that distinguish a real til oil.',
  },
  {
    icon: 'drop',
    title: 'Below 40°C',
    body: 'Heat fragments fatty acids. We stay cool enough to protect every chain.',
  },
  {
    icon: 'shield',
    title: 'No solvents',
    body: 'Industrial oil is hexane-extracted. Ours touches only seed, wood, and gravity.',
  },
  {
    icon: 'star',
    title: 'Unfiltered',
    body: 'We let oil settle for 72 hours. What rises is what nourishes.',
  },
]

function benefitIcon(icon: BenefitIcon) {
  switch (icon) {
    case 'leaf':
      return <Icons.leaf size={18} />
    case 'drop':
      return <Icons.drop size={18} />
    case 'shield':
      return <Icons.shield size={18} />
    case 'star':
      return <Icons.star size={18} />
    case 'check':
      return <Icons.check size={18} />
    default:
      return <Icons.leaf size={18} />
  }
}

function renderHeadline(headline: string, italic?: string | null) {
  if (!italic) return headline
  const i = headline.indexOf(italic)
  if (i < 0) {
    return (
      <>
        {headline}
        <br />
        <em className="pt-display-italic" style={{ color: 'var(--mustard-600)' }}>
          {italic}
        </em>
      </>
    )
  }
  return (
    <>
      {headline.slice(0, i)}
      <em className="pt-display-italic" style={{ color: 'var(--mustard-600)' }}>
        {italic}
      </em>
      {headline.slice(i + italic.length)}
    </>
  )
}

export function HomeWhySection({
  eyebrow = 'Why cold-pressed',
  headline = 'Refined oil is a twentieth-century compromise.',
  headlineItalic = 'compromise.',
  scienceHref = '/journal/why-cold-pressed',
  scienceLabel = 'The science, plainly written',
  supportingLead = "Solvent extraction came from the chemistry of soap, not food. At 240°C, an oil loses what makes it nourishing: lignans, tocopherols, the volatile aromatics. We don't go past 38°C.",
  cards,
}: {
  eyebrow?: string | null
  headline?: string | null
  headlineItalic?: string | null
  scienceHref?: string | null
  scienceLabel?: string | null
  supportingLead?: string | null
  cards?: { icon: BenefitIcon; title: string; body: string }[] | null
}) {
  const list = cards?.length ? cards : DEFAULT_CARDS

  return (
    <section className="why-grid hp-why-section">
      <div>
        <PtEyebrow>{eyebrow}</PtEyebrow>
        <h2 className="hp-heading-why">{renderHeadline(headline ?? '', headlineItalic)}</h2>
        {supportingLead ? <p className="hp-prose-muted hp-why-lead">{supportingLead}</p> : null}
        {scienceHref && scienceLabel ? (
          <Link href={scienceHref} className="pt-btn pt-btn--ghost pt-btn-inline-icon hp-why-link">
            {scienceLabel} <Icons.arrowRight size={14} />
          </Link>
        ) : null}
      </div>
      <div className="hp-benefit-grid">
        {list.map((b, i) => (
          <div
            key={`${b.title}-${i}`}
            className={`pt-card pt-card--flat hp-benefit-card ${i % 2 === 0 ? 'hp-benefit-card--a' : 'hp-benefit-card--b'}`}
          >
            <div className="hp-benefit-card__icon" style={{ marginBottom: 8, color: 'var(--green-800)' }}>
              {benefitIcon(b.icon)}
            </div>
            <div className="hp-benefit-card__title">{b.title}</div>
            <p className="hp-benefit-card__desc">{b.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
