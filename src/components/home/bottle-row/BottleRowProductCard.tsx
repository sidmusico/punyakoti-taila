'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useCallback, useRef, useState } from 'react'

import { Bottle } from '@/components/ui/pt/Bottle'
import type { OilVariant } from '@/components/ui/pt/Bottle'
import { firstProductPhoto } from '@/lib/product-media'
import type { Product } from '@/payload-types'

const MAX_TILT = 10

export function BottleRowProductCard({
  product,
  index,
}: {
  product: Product
  index: number
}) {
  const photo = firstProductPhoto(product)
  const oilVariant = product.oilVariant ?? 'sesame'
  const motionRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, lift: 0 })
  const [hovering, setHovering] = useState(false)
  const useTilt = hovering || tilt.rx !== 0 || tilt.ry !== 0 || tilt.lift !== 0

  const onMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = motionRef.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({
      ry: x * MAX_TILT,
      rx: -y * MAX_TILT,
      lift: 6,
    })
  }, [])

  const onLeave = useCallback(() => {
    setHovering(false)
    setTilt({ rx: 0, ry: 0, lift: 0 })
  }, [])

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="bottle-row__item bottle-row__item--enter"
      style={{ animationDelay: `${index * 0.1}s` }}
      onMouseEnter={() => setHovering(true)}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onBlur={onLeave}
    >
      <div
        ref={motionRef}
        className={`bottle-row__motion${hovering ? ' bottle-row__motion--hover' : ''}`}
        style={
          useTilt
            ? {
                transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateY(${-tilt.lift}px)`,
              }
            : undefined
        }
      >
        <div className={`bottle-row__frame${photo ? '' : ' bottle-row__frame--svg'}`}>
          <div className="bottle-row__shine" aria-hidden />
          {photo ? (
            <Image
              src={photo.src}
              alt={photo.alt}
              width={512}
              height={512}
              className="bottle-row__img"
              sizes="(max-width: 768px) 140px, 180px"
            />
          ) : (
            <Bottle variant={oilVariant as OilVariant} size={160} />
          )}
        </div>
      </div>
      <div className="bottle-row__label">{product.name}</div>
    </Link>
  )
}
