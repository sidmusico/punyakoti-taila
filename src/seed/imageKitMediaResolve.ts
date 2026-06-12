import type { Payload } from 'payload'

import { IMAGEKIT_CATALOG } from '@/seed/imagekitCatalog.generated'
import { fetchRemoteFilePayloadShape } from '@/seed/seedMediaUpload'

export type ProductImageRow = { image: string | number; alt: string }

/** "sesame-oil/hero-dark-moody" → "Product name — Hero dark moody". */
export function humanizeAlt(alt: string, productName: string): string {
  const stem = alt.split('/').pop() ?? alt
  const words = stem.replace(/[-_]+/g, ' ').trim()
  const label = words.charAt(0).toUpperCase() + words.slice(1)
  return `${productName} — ${label}`
}

/**
 * Resolve a Payload Media id for an ImageKit alt (`<folder>/<stem>`).
 * Uses existing media docs (from sync-assets / imagekit seed) or creates from catalog.
 */
export async function resolveImageKitMediaId(
  payload: Payload,
  alt: string,
): Promise<string | number | null> {
  const existing = await payload.find({
    collection: 'media',
    where: { alt: { equals: alt } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  if (existing.docs[0]) return existing.docs[0].id

  const entry = IMAGEKIT_CATALOG.find((e) => e.alt === alt)
  if (!entry) return null

  const file = await fetchRemoteFilePayloadShape(entry.url, entry.name.replace(/\.[a-z0-9]+$/i, ''))
  const created = await payload.create({
    collection: 'media',
    data: {
      alt: entry.alt,
      imagekitFolder: entry.folder.replace(/^\/punyakoti-taila\/?/, ''),
      imagekitFileId: entry.fileId,
      imagekitFilePath: entry.filePath,
      imagekitUrl: entry.url,
    } as Record<string, unknown>,
    file,
    overrideAccess: true,
  })
  return created.id
}

export async function buildProductImagesFromAlts(
  payload: Payload,
  galleryAlts: readonly string[],
  productName: string,
): Promise<ProductImageRow[]> {
  const images: ProductImageRow[] = []
  for (const alt of galleryAlts) {
    const id = await resolveImageKitMediaId(payload, alt)
    if (id != null) images.push({ image: id, alt: humanizeAlt(alt, productName) })
  }
  return images
}
