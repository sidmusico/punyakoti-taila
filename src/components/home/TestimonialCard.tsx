import Image from 'next/image'
import React from 'react'

import { PtAvatarInitials, type PtAvatarTone } from '@/components/ui/pt/PtAvatarInitials'
import { PtStars } from '@/components/ui/pt/PtStars'

export type TestimonialCardProps = {
  rating: number
  body: string
  customerName: string
  customerLocation: string
  initials: string
  avatarTone: PtAvatarTone
  photoUrl?: string | null
  photoAlt?: string
}

export function TestimonialCard({
  rating,
  body,
  customerName,
  customerLocation,
  initials,
  avatarTone,
  photoUrl,
  photoAlt,
}: TestimonialCardProps) {
  return (
    <figure className="hp-testimonial">
      <div className="hp-testimonial__thumb">
        {photoUrl ? (
          <div className="hp-testimonial__photo">
            <Image
              src={photoUrl}
              alt={photoAlt || customerName}
              width={320}
              height={320}
              className="hp-testimonial__img"
              sizes="(max-width: 900px) 78vw, 320px"
            />
          </div>
        ) : (
          <PtAvatarInitials initials={initials} tone={avatarTone} size={160} />
        )}
      </div>
      <figcaption className="hp-testimonial__cap">
        <div className="hp-testimonial__name">{customerName}</div>
        <div className="pt-mono-stamp hp-testimonial__loc">{customerLocation}</div>
      </figcaption>
      <PtStars value={rating} size={12} />
      <blockquote className="hp-testimonial__quote">&ldquo;{body}&rdquo;</blockquote>
    </figure>
  )
}
