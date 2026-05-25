import React from 'react'

import { CowMark } from '@/components/ui/pt/CowMark'
import { PtEyebrow } from '@/components/ui/pt/PtEyebrow'

const DEFAULT_STATS = [
  { value: '47', label: 'Batches', sub: 'this season alone' },
  { value: '2,847', label: 'Kitchens', sub: 'across India' },
  { value: '9 hr', label: 'Per press', sub: 'wooden ghani at 38°C' },
  { value: '4.9', label: 'Reviews', sub: 'from 612 verified buyers' },
] as const

export function HomeStatsSection({
  eyebrow = 'By the numbers',
  headlinePrefix = 'What slow looks like,',
  headlineItalic = 'plainly.',
  stats,
}: {
  eyebrow?: string | null
  headlinePrefix?: string | null
  headlineItalic?: string | null
  stats?: { value: string; label: string; sub: string }[] | null
}) {
  const list = stats?.length ? stats : [...DEFAULT_STATS]

  return (
    <section className="hp-stats">
      <div className="hp-stats__wm" aria-hidden="true">
        <CowMark size={420} color="var(--green-900)" />
      </div>
      <div className="hp-container">
        <div className="hp-stats__intro">
          <PtEyebrow>{eyebrow}</PtEyebrow>
          <h2 className="hp-heading-stats">
            {headlinePrefix}{' '}
            <em className="pt-display-italic" style={{ color: 'var(--mustard-600)' }}>
              {headlineItalic}
            </em>
          </h2>
        </div>
        <div className="stats-grid-inner">
          {list.map((s) => (
            <div key={`${s.label}-${s.value}`} className="hp-stat-cell">
              <div className="hp-stat-value">{s.value}</div>
              <div className="hp-stat-label">{s.label}</div>
              <div className="pt-mono-stamp hp-stat-sub">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
