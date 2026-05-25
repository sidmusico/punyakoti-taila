import React from 'react'

import { resolveMediaAlt, resolveMediaUrl, type MediaLike } from '@/utilities/mediaUrl'

export type SectionBackgroundImageVariant = 'bg' | 'fill'

/**
 * Reusable optional background image for a home-page section.
 *
 * Renders **nothing** when no media is set, so the parent section keeps its
 * existing text-only treatment. When media is set:
 *
 * - `variant="bg"` — absolute-positioned, behind the section content, dimmed
 *   so foreground text remains legible. Used by ProcessBanner, Poetic,
 *   Stats, FAQ — i.e. text-heavy sections where the image is decorative.
 * - `variant="fill"` — absolute-positioned, full-bleed at 100% opacity.
 *   Used by Hero — Cinematic where the image *is* the hero.
 *
 * Parent section must be `position: relative` and content must be on
 * `z-index >= 1` (`.section-bg-image__above` helper class available).
 *
 * The CSS lives in src/styles/homepage.css (search "Section background image").
 */
export function SectionBackgroundImage({
  media,
  variant = 'bg',
  altFallback = '',
}: {
  media: MediaLike
  variant?: SectionBackgroundImageVariant
  altFallback?: string
}) {
  const url = resolveMediaUrl(media)
  if (!url) return null
  const alt = resolveMediaAlt(media, altFallback)
  const className =
    variant === 'fill' ? 'section-bg-image section-bg-image--fill' : 'section-bg-image section-bg-image--bg'
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt={alt} aria-hidden={alt ? undefined : true} className={className} />
  )
}
