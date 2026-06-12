'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'

import { TestimonialCard, type TestimonialCardProps } from '@/components/home/TestimonialCard'

const AUTO_SCROLL_SPEED = 0.45
const AUTO_SCROLL_MIN_ITEMS = 4

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function TestimonialsRail({
  items,
}: {
  items: (TestimonialCardProps & { id: string | number })[]
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [autoScroll, setAutoScroll] = useState(false)
  const [paused, setPaused] = useState(false)
  const loopRef = useRef(0)

  const measure = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const overflow = el.scrollWidth > el.clientWidth + 12
    setAutoScroll(!prefersReducedMotion() && (overflow || items.length >= AUTO_SCROLL_MIN_ITEMS))
  }, [items.length])

  useEffect(() => {
    measure()
    const el = trackRef.current
    if (!el) return
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [measure])

  useEffect(() => {
    if (!autoScroll) return
    const el = trackRef.current
    if (!el) return

    let raf = 0
    const tick = () => {
      if (!paused && el) {
        const half = el.scrollWidth / 2
        if (half > 0) {
          el.scrollLeft += AUTO_SCROLL_SPEED
          if (el.scrollLeft >= half - 1) el.scrollLeft = 0
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [autoScroll, paused, items])

  const displayItems = autoScroll ? [...items, ...items] : items

  return (
    <div
      className={`testimonials-rail${autoScroll ? ' testimonials-rail--auto' : ''}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false)
      }}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => {
        window.clearTimeout(loopRef.current)
        loopRef.current = window.setTimeout(() => setPaused(false), 2400)
      }}
    >
      <div
        ref={trackRef}
        className="testimonials-grid hp-testimonials-grid"
        role="list"
        aria-label="Customer testimonials"
      >
        {displayItems.map((t, i) => (
          <div key={`${t.id}-${i}`} className="testimonials-grid__cell" role="listitem">
            <TestimonialCard {...t} />
          </div>
        ))}
      </div>
    </div>
  )
}
