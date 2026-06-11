'use client'

import React, { useMemo } from 'react'

/**
 * Scrolling band under the hero, showing the cities where the product is
 * currently available — "Now available in <city>".
 *
 * Sources, in priority order:
 *   1. `cities` — list of city names fetched from the `service-locations`
 *      collection (the canonical source).
 *   2. `items` — legacy free-form items kept for back-compat with rows that
 *      were saved into Homepage settings before the locations collection
 *      existed.
 *   3. A small hard-coded fallback so the band still renders on a brand-new
 *      DB with nothing seeded.
 */

export type PressMarqueeItem = {
  live?: boolean | null
  italic?: boolean | null
  text: string
  stamp: string
}

export type ServiceLocationCity = {
  cityName: string
  state?: string | null
}

const FALLBACK_CITIES: ServiceLocationCity[] = [
  { cityName: 'Bengaluru', state: 'Karnataka' },
  { cityName: 'Mysuru', state: 'Karnataka' },
  { cityName: 'Mangaluru', state: 'Karnataka' },
  { cityName: 'Hubballi-Dharwad', state: 'Karnataka' },
  { cityName: 'Belagavi', state: 'Karnataka' },
  { cityName: 'Tumakuru', state: 'Karnataka' },
]

function citiesToItems(cities: ServiceLocationCity[]): PressMarqueeItem[] {
  return cities.map((c, i) => ({
    live: false,
    italic: i % 2 === 1,
    text: `Now available in ${c.cityName}`,
    stamp: (c.state || 'KARNATAKA').toUpperCase(),
  }))
}

export function PressBand({
  cities,
  items,
  introLabel = 'Now serving in these districts',
}: {
  cities?: ServiceLocationCity[] | null
  items?: PressMarqueeItem[] | null
  introLabel?: string | null
}) {
  const src: PressMarqueeItem[] = useMemo(() => {
    // Cities (from service-locations collection) are the source of truth.
    // Falls back to a small built-in Karnataka list so the band still has
    // content on a fresh DB.
    if (cities && cities.length > 0) return citiesToItems(cities)
    // `items` (legacy free-form rows in Homepage settings) are intentionally
    // ignored — kept on the prop only for type compatibility with older
    // callers / migrations. Cleared on the next CMS save.
    void items
    return citiesToItems(FALLBACK_CITIES)
  }, [cities, items])

  const doubled = useMemo(() => [...src, ...src], [src])

  return (
    <div
      className="pt-marquee"
      style={{
        borderTop: '1px solid rgba(245,239,224,0.1)',
        borderBottom: '1px solid rgba(245,239,224,0.1)',
        background: 'var(--green-950)',
        color: 'var(--cream-100)',
        padding: '14px 0',
      }}
      aria-label="Cities where our product is available"
    >
      {introLabel ? (
        <div
          style={{
            textAlign: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--mustard-400)',
            padding: '0 16px 10px',
          }}
        >
          {introLabel}
        </div>
      ) : null}
      <div className="pt-marquee-track" aria-hidden="true">
        {doubled.map((item, i) => (
          <div
            key={`${item.text}-${item.stamp}-${i}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 14,
              padding: '0 32px',
              flexShrink: 0,
            }}
          >
            {item.live ? <span className="pt-pulse-dot" /> : null}

            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontStyle: item.italic ? 'italic' : 'normal',
                fontSize: 22,
                fontWeight: 400,
                letterSpacing: '-0.01em',
                lineHeight: 1,
              }}
            >
              {item.text}
            </span>

            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--mustard-400)',
              }}
            >
              {item.stamp}
            </span>

            <span
              style={{
                color: 'rgba(245,239,224,0.2)',
                margin: '0 4px',
                fontSize: 14,
              }}
            >
              ✦
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
