'use client'

import React, { useMemo } from 'react'

// Live press marquee — dark green-950 band with pulsing dots + mono stamps

export type PressMarqueeItem = {
  live?: boolean | null
  italic?: boolean | null
  text: string
  stamp: string
}

const DEFAULT_ITEMS: PressMarqueeItem[] = [
  { live: true, text: 'Pressing now · Sesame', stamp: 'Erode · NOV 14', italic: false },
  { live: false, text: 'Bottled this week · Coconut', stamp: 'Kollam · NOV 12', italic: true },
  { live: false, text: 'Settling · Mustard', stamp: 'Alwar · NOV 11', italic: false },
  { live: false, text: 'Harvest in · Black sesame', stamp: 'Salem · NOV 09', italic: true },
  { live: false, text: 'Lab cleared · Groundnut', stamp: 'Kadapa · NOV 08', italic: false },
  { live: true, text: 'Press of the week · Sesame', stamp: 'Batch #047', italic: false },
]

export function PressBand({ items }: { items?: PressMarqueeItem[] | null }) {
  const src = items?.length ? items : DEFAULT_ITEMS
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
      aria-label="Live press updates"
    >
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
