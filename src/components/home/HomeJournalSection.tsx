import Link from 'next/link'
import React from 'react'

import { PtSectionHeader } from '@/components/ui/pt/PtSectionHeader'

const DEFAULT_POSTS = [
  {
    toneA: '#5A7B3E',
    toneB: '#2E4222',
    tag: 'Recipe',
    title: 'Til kuzhambu — the way they cook it in Tirunelveli',
    read: '6 min read',
    slug: 'til-kuzhambu',
  },
  {
    toneA: '#2F4A2A',
    toneB: '#0F1A0E',
    tag: 'Provenance',
    title: 'The day we drove to Erode and sat next to the press for 9 hours',
    read: '11 min read',
    slug: 'erode-press-diary',
  },
  {
    toneA: '#E0AF52',
    toneB: '#4B2A0D',
    tag: 'Wellness',
    title: 'Why your great-grandmother oiled her hair on Saturdays',
    read: '4 min read',
    slug: 'hair-oil-ritual',
  },
] as const

export function HomeJournalSection({
  eyebrow = 'Journal',
  headlineLine1 = 'Recipes, rituals, and',
  headlineLine2 = "what we're reading.",
  ctaLabel = 'Read the journal',
  ctaHref = '/posts',
  posts,
}: {
  eyebrow?: string | null
  headlineLine1?: string | null
  headlineLine2?: string | null
  ctaLabel?: string | null
  ctaHref?: string | null
  posts?: { tag: string; title: string; read?: string | null; slug: string; toneA?: string | null; toneB?: string | null }[] | null
}) {
  const list = posts?.length ? posts : [...DEFAULT_POSTS]

  return (
    <section className="hp-container">
      <PtSectionHeader
        eyebrow={eyebrow ?? 'Journal'}
        title={
          <>
            {headlineLine1 ?? 'Recipes, rituals, and'}
            <br />
            {headlineLine2 ?? "what we're reading."}
          </>
        }
        action={{ href: ctaHref || '/posts', label: ctaLabel ?? 'Read the journal', variant: 'green' }}
      />
      <div className="hp-section-body hp-section-body--tight-bottom">
        <div className="journal-grid">
          {list.map((p) => (
            <article key={p.slug} className="hp-journal-card">
              <Link href={`/posts/${p.slug}`}>
                <div
                  className="hp-journal-card__thumb"
                  style={
                    {
                      '--hp-tone-a': p.toneA ?? '#5A7B3E',
                      '--hp-tone-b': p.toneB ?? '#2E4222',
                    } as React.CSSProperties
                  }
                >
                  <span className="pt-pill pt-pill--dark">{p.tag}</span>
                </div>
              </Link>
              <div className="hp-journal-card__body">
                <h3 className="hp-journal-card__title">{p.title}</h3>
                <div className="hp-journal-card__meta">
                  {p.read ?? '6 min read'} · journal
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
