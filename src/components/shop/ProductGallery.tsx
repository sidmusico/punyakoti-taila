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
    return (
      <div className="flex gap-4">
        <div className="hidden md:flex flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-16 h-20 rounded-xl cursor-default border-2 grid place-items-center"
              style={{
                background: 'var(--cream-200)',
                borderColor: i === 0 ? 'var(--green-700)' : 'var(--cream-400)',
              }}
            >
              <Bottle variant={oilVariant} size={44} showLabel={false} />
            </div>
          ))}
        </div>
        <div
          className="flex-1 rounded-2xl md:rounded-3xl overflow-hidden grid place-items-center"
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
      </div>
    )
  }

  const safeIndex = Math.min(Math.max(active, 0), slides.length - 1)
  const current = slides[safeIndex]!
  const mainSrc = getMediaUrl(current.src, null)

  return (
    <div className="flex gap-4">
      <div className="hidden md:flex flex-col gap-3">
        {slides.map((slide, i) => {
          const thumbSrc = getMediaUrl(slide.src, null)
          const isOn = i === safeIndex
          return (
            <button
              key={`${slide.src}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              className="relative w-16 h-20 rounded-xl overflow-hidden border-2 transition-colors shrink-0"
              style={{
                borderColor: isOn ? 'var(--green-700)' : 'var(--cream-400)',
                background: 'var(--cream-200)',
              }}
              aria-label={`Show image ${i + 1}`}
            >
              <Image src={thumbSrc} alt="" fill className="object-cover" sizes="64px" aria-hidden />
            </button>
          )
        })}
      </div>

      <div
        className="flex-1 relative rounded-2xl md:rounded-3xl overflow-hidden"
        style={{ aspectRatio: '4/5', boxShadow: 'var(--sh-lg)', background: 'var(--cream-200)' }}
      >
        <Image
          src={mainSrc}
          alt={current.alt}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    </div>
  )
}
