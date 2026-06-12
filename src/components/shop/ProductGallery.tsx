'use client'

import Image from 'next/image'
import React, { useState } from 'react'

import { Bottle } from '@/components/ui/pt/Bottle'
import type { OilVariant } from '@/components/ui/pt/Bottle'
import { getMediaUrl } from '@/utilities/getMediaUrl'

export type ProductGallerySlide = {
  src: string
  alt: string
  width?: number | null
  height?: number | null
}

interface ProductGalleryProps {
  slides: ProductGallerySlide[]
  oilVariant: OilVariant
}

export function ProductGallery({ slides, oilVariant }: ProductGalleryProps) {
  const [active, setActive] = useState(0)

  if (!slides.length) {
    // No photos yet — single illustrated hero, no fake thumbnails.
    return (
      <div
        className="rounded-2xl md:rounded-3xl overflow-hidden grid place-items-center md:max-h-[calc(100dvh-190px)]"
        style={{
          background: 'linear-gradient(135deg, #244023 0%, #0F1A0E 70%, #2B1C0F 100%)',
          aspectRatio: '4/5',
          boxShadow: 'var(--sh-lg)',
        }}
      >
        <div style={{ filter: 'drop-shadow(0 40px 60px rgba(0,0,0,0.6))' }}>
          <Bottle variant={oilVariant} size={280} />
        </div>
      </div>
    )
  }

  const safeIndex = Math.min(Math.max(active, 0), slides.length - 1)
  const current = slides[safeIndex]!
  const mainSrc = getMediaUrl(current.src, null)

  const thumb = (slide: ProductGallerySlide, i: number, variant: 'rail' | 'strip') => {
    const thumbSrc = getMediaUrl(slide.src, null)
    const isOn = i === safeIndex
    return (
      <button
        key={`${variant}-${slide.src}-${i}`}
        type="button"
        onClick={() => setActive(i)}
        className={
          variant === 'rail'
            ? 'relative w-16 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 hover:opacity-90'
            : 'relative w-14 h-[70px] rounded-lg overflow-hidden border-2 transition-all shrink-0'
        }
        style={{
          borderColor: isOn ? 'var(--green-700)' : 'var(--cream-400)',
          background: 'var(--cream-200)',
          opacity: isOn ? 1 : 0.8,
        }}
        aria-label={`Show image ${i + 1} of ${slides.length}`}
        aria-current={isOn}
      >
        <Image src={thumbSrc} alt="" fill className="object-cover" sizes="64px" aria-hidden />
      </button>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-4">
        {/* desktop: vertical thumb rail */}
        {slides.length > 1 && (
          <div className="hidden md:flex flex-col gap-3">{slides.map((s, i) => thumb(s, i, 'rail'))}</div>
        )}

        <div
          className="flex-1 relative rounded-2xl md:rounded-3xl overflow-hidden md:max-h-[calc(100dvh-190px)]"
          style={{ aspectRatio: '4/5', boxShadow: 'var(--sh-lg)', background: 'var(--cream-200)' }}
        >
          <Image
            key={mainSrc}
            src={mainSrc}
            alt={current.alt}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>

      {/* mobile: horizontal thumb strip (desktop uses the side rail) */}
      {slides.length > 1 && (
        <div className="flex md:hidden gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Product images">
          {slides.map((s, i) => thumb(s, i, 'strip'))}
        </div>
      )}
    </div>
  )
}
