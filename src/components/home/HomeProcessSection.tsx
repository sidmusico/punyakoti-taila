import Link from 'next/link'
import React from 'react'

import { CowMark } from '@/components/ui/pt/CowMark'
import { Icons } from '@/components/ui/pt/Icons'
import { PtEyebrow } from '@/components/ui/pt/PtEyebrow'

const DEFAULT_STEPS = [
  { n: '01', title: 'Sourced', description: 'Single-farm seed. Sun-dried on jute mats. Cleaned by hand.' },
  { n: '02', title: 'Pressed', description: 'Wood ghani at 4rpm. Two-litre yield per nine-hour press.' },
  { n: '03', title: 'Settled', description: '72 hours of gravity. No filtration. No clarifiers.' },
  { n: '04', title: 'Bottled', description: 'Dark amber glass. Numbered. Stamped. Shipped warm.' },
] as const

export function HomeProcessSection({
  eyebrow = 'The process · est. five generations',
  headlineLine1 = 'Wood, weight,',
  headlineItalic = 'time.',
  body = 'A wooden ghani turns at four revolutions per minute. No heat. No solvents. Just seed, stone, and the patience to wait nine hours for two litres. The yield is half. The flavour is whole.',
  steps,
  cta = { label: 'Read our story', href: '/about' },
}: {
  eyebrow?: string | null
  headlineLine1?: string | null
  headlineItalic?: string | null
  body?: string | null
  steps?: { n: string; title: string; description: string }[] | null
  cta?: { label?: string | null; href?: string | null } | null
}) {
  const list = steps?.length ? steps : [...DEFAULT_STEPS]

  return (
    <section className="hp-process">
      <div className="hp-process__wm-left" aria-hidden="true">
        <CowMark size={420} color="var(--mustard-500)" />
      </div>
      <div className="hp-process__wm-right" aria-hidden="true">
        <CowMark size={460} color="var(--cream-100)" />
      </div>
      <div className="hp-process__inner">
        <PtEyebrow variant="light">{eyebrow}</PtEyebrow>
        <h2 className="hp-heading-process">
          {headlineLine1}
          <br />
          and <em className="pt-display-italic" style={{ color: 'var(--mustard-400)' }}>{headlineItalic}</em>
        </h2>
        <p className="hp-prose--on-dark">{body}</p>
        <div className="process-steps hp-process-steps">
          {list.map((s) => (
            <div key={s.n} className="hp-process-step">
              <div className="hp-process-step__n">{s.n}</div>
              <div className="hp-process-step__title">{s.title}</div>
              <div className="hp-process-step__desc">{s.description}</div>
            </div>
          ))}
        </div>
        <Link href={cta?.href || '/about'} className="pt-text-link pt-text-link--mustard-muted pt-btn-inline-icon hp-process-story-link">
          {cta?.label} <Icons.arrowRight size={14} />
        </Link>
      </div>
    </section>
  )
}
