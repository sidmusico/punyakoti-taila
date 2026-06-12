import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { imageKitPathForJournalSlug } from '@/seed/journalPostImages'
import { PtSectionHeader } from '@/components/ui/pt/PtSectionHeader'
import { resolveMediaAlt, resolveMediaUrl } from '@/utilities/mediaUrl'
import type { Media } from '@/payload-types'

const IK = 'https://ik.imagekit.io/zx7l7bhei/punyakoti-taila'

const DEFAULT_POSTS = [
  {
    toneA: '#5A7B3E',
    toneB: '#2E4222',
    tag: 'Recipe',
    title: 'Til kuzhambu — the way they cook it in Tirunelveli',
    read: '6 min read',
    slug: 'til-kuzhambu',
    imageUrl: `${IK}/food/rice-plate-curry-punyakoti-bottle.png`,
    imageAlt: 'Rice plate with curry and Punyakoti sesame oil',
  },
  {
    toneA: '#2F4A2A',
    toneB: '#0F1A0E',
    tag: 'Provenance',
    title: 'The day we drove to Erode and sat next to the press for 9 hours',
    read: '11 min read',
    slug: 'erode-press-diary',
    imageUrl: `${IK}/process/ghana-press-oil-flowing.png`,
    imageAlt: 'Traditional ghani press with golden oil flowing',
  },
  {
    toneA: '#E0AF52',
    toneB: '#4B2A0D',
    tag: 'Wellness',
    title: 'Why your great-grandmother oiled her hair on Saturdays',
    read: '4 min read',
    slug: 'hair-oil-ritual',
    imageUrl: `${IK}/products/castor-oil/lifestyle-haircare.png`,
    imageAlt: 'Hair care ritual with cold-pressed oil',
  },
] as const

type JournalPostInput = {
  tag: string
  title: string
  read?: string | null
  slug: string
  toneA?: string | null
  toneB?: string | null
  image?: string | number | Media | null
}

type JournalPostView = {
  tag: string
  title: string
  read: string
  slug: string
  toneA: string
  toneB: string
  imageUrl: string | null
  imageAlt: string
}

function fallbackImageUrl(slug: string): string | null {
  const path = imageKitPathForJournalSlug(slug)
  return path ? `${IK}/${path}` : null
}

function resolveJournalPost(p: JournalPostInput): JournalPostView {
  const cmsUrl = resolveMediaUrl(p.image)
  const fallbackUrl = fallbackImageUrl(p.slug)
  const imageUrl = cmsUrl ?? fallbackUrl
  const imageAlt =
    resolveMediaAlt(p.image, '') ||
    DEFAULT_POSTS.find((d) => d.slug === p.slug)?.imageAlt ||
    p.title

  return {
    tag: p.tag,
    title: p.title,
    read: p.read ?? '6 min read',
    slug: p.slug,
    toneA: p.toneA ?? '#5A7B3E',
    toneB: p.toneB ?? '#2E4222',
    imageUrl,
    imageAlt,
  }
}

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
  posts?: JournalPostInput[] | null
}) {
  const list = (posts?.length ? posts : [...DEFAULT_POSTS]).map(resolveJournalPost)

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
                  className={`hp-journal-card__thumb${p.imageUrl ? ' hp-journal-card__thumb--photo' : ''}`}
                  style={
                    {
                      '--hp-tone-a': p.toneA,
                      '--hp-tone-b': p.toneB,
                    } as React.CSSProperties
                  }
                >
                  {p.imageUrl ? (
                    <Image
                      src={p.imageUrl}
                      alt={p.imageAlt}
                      fill
                      className="hp-journal-card__img"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : null}
                  <span className="pt-pill pt-pill--dark hp-journal-card__tag">{p.tag}</span>
                </div>
              </Link>
              <div className="hp-journal-card__body">
                <h3 className="hp-journal-card__title">{p.title}</h3>
                <div className="hp-journal-card__meta">
                  {p.read} · journal
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
