'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { buildHref, type PlpFilters } from '@/lib/plp/filters'

interface Props {
  /** Absolute price floor across the full product set. */
  min: number
  /** Absolute price ceiling across the full product set. */
  max: number
  /** Current filter state — used to preserve other params on URL change. */
  filters: PlpFilters
}

/**
 * Dual-thumb price range. Commits the new min/max to the URL on pointer/touch
 * release (so we don't fire a server round-trip on every pixel of drag).
 *
 * Uses two stacked native `<input type="range">` so the controls remain
 * keyboard-accessible without a third-party slider library.
 */
export function PlpPriceSlider({ min, max, filters }: Props) {
  const router = useRouter()
  const [lo, setLo] = useState<number>(filters.priceMin ?? min)
  const [hi, setHi] = useState<number>(filters.priceMax ?? max)

  // Stay in sync if filters change from elsewhere (e.g. a chip removal)
  useEffect(() => {
    setLo(filters.priceMin ?? min)
    setHi(filters.priceMax ?? max)
  }, [filters.priceMin, filters.priceMax, min, max])

  const span = Math.max(1, max - min)
  const leftPct = ((lo - min) / span) * 100
  const rightPct = ((max - hi) / span) * 100

  const commit = (nextLo = lo, nextHi = hi) => {
    const min1 = nextLo > min ? nextLo : null
    const max1 = nextHi < max ? nextHi : null
    router.push(buildHref(filters, { priceMin: min1, priceMax: max1, page: 1 }), { scroll: false })
    router.refresh()
  }

  return (
    <div className="plp-price">
      <div className="plp-price__title">Price</div>
      <div className="plp-price__track">
        <div className="plp-price__track-bg" />
        <div
          className="plp-price__track-fill"
          style={{ left: `${leftPct}%`, right: `${rightPct}%` }}
        />

        {/* Lower-bound thumb */}
        <input
          type="range"
          aria-label="Minimum price"
          className="plp-price__input plp-price__input--lo"
          min={min}
          max={max}
          step={10}
          value={lo}
          onChange={(e) => {
            const v = Math.min(Number(e.target.value), hi - 10)
            setLo(v)
          }}
          onMouseUp={() => commit()}
          onTouchEnd={() => commit()}
          onKeyUp={(e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') commit()
          }}
        />
        {/* Upper-bound thumb */}
        <input
          type="range"
          aria-label="Maximum price"
          className="plp-price__input plp-price__input--hi"
          min={min}
          max={max}
          step={10}
          value={hi}
          onChange={(e) => {
            const v = Math.max(Number(e.target.value), lo + 10)
            setHi(v)
          }}
          onMouseUp={() => commit()}
          onTouchEnd={() => commit()}
          onKeyUp={(e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') commit()
          }}
        />
      </div>
      <div className="plp-price__labels">
        <span>₹{lo}</span>
        <span>₹{hi}</span>
      </div>
    </div>
  )
}
