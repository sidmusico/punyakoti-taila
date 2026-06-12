/** Payload Media `alt` keys per homepage journal card slug. */
export const JOURNAL_POST_IMAGE_ALTS: Record<string, string> = {
  'til-kuzhambu': 'food/rice-plate-curry-punyakoti-bottle',
  'erode-origin-story': 'process/ghana-press-oil-flowing',
  'erode-press-diary': 'process/ghana-press-oil-flowing',
  'hair-oil-ritual': 'castor-oil/lifestyle-haircare',
}

/** ImageKit path under `/punyakoti-taila/` for storefront fallbacks. */
export const JOURNAL_POST_IMAGE_PATHS: Record<string, string> = {
  'til-kuzhambu': 'food/rice-plate-curry-punyakoti-bottle.png',
  'erode-origin-story': 'process/ghana-press-oil-flowing.png',
  'erode-press-diary': 'process/ghana-press-oil-flowing.png',
  'hair-oil-ritual': 'products/castor-oil/lifestyle-haircare.png',
}

export function imageAltForJournalSlug(slug: string): string | undefined {
  return JOURNAL_POST_IMAGE_ALTS[slug]
}

export function imageKitPathForJournalSlug(slug: string): string | undefined {
  return JOURNAL_POST_IMAGE_PATHS[slug]
}
