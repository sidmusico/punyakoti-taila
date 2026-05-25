import type { Media } from '@/payload-types'

export type MediaLike = string | number | Media | null | undefined

/**
 * Extract the best public URL for a Payload media relation. Prefers the
 * ImageKit URL (CDN-served) over Payload's local `/media/...` URL.
 *
 * Returns `null` when the relation is missing or unpopulated (e.g. depth: 0).
 */
export function resolveMediaUrl(media: MediaLike): string | null {
  if (!media || typeof media !== 'object') return null
  const m = media as Media
  if (m.imagekitUrl) return m.imagekitUrl
  if (m.url) return m.url
  return null
}

export function resolveMediaAlt(media: MediaLike, fallback = ''): string {
  if (!media || typeof media !== 'object') return fallback
  return (media as Media).alt ?? fallback
}

export function resolveMediaSize(media: MediaLike): { width?: number; height?: number } {
  if (!media || typeof media !== 'object') return {}
  const m = media as Media
  return {
    width: typeof m.width === 'number' ? m.width : undefined,
    height: typeof m.height === 'number' ? m.height : undefined,
  }
}
