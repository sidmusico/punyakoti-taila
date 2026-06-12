import type { Media, Product } from '@/payload-types'

import type { FallbackProduct } from '@/components/home/home-constants'
import { getMediaUrl } from '@/utilities/getMediaUrl'

/** First populated product image (ImageKit URL preferred). */
export function firstProductPhoto(
  product: Product | FallbackProduct,
): { src: string; alt: string } | null {
  const images = (product as Product).images
  if (!Array.isArray(images)) return null
  for (const row of images) {
    const img = row.image
    if (typeof img !== 'object' || !img) continue
    const m = img as Media
    const src = m.imagekitUrl || m.url
    if (src) {
      return {
        src: getMediaUrl(src, null),
        alt: (row.alt && row.alt.trim()) || m.alt || product.name,
      }
    }
  }
  return null
}
