import type { PlpOilVariant } from '@/seed/plpCatalogSeed'

/** Default ImageKit media alts (`folder/stem`) per oil variant for PLP cards. */
export const PLP_DEFAULT_GALLERY_BY_VARIANT: Record<PlpOilVariant, readonly string[]> = {
  sesame: ['all-oils/sesame-oil'],
  coconut: ['all-oils/coconut-oil'],
  groundnut: ['all-oils/groundnut-oil'],
  mustard: ['all-oils/mustard-oil'],
  sunflower: ['all-oils/sunflower-oil'],
  castor: ['castor-oil/hero-ayurvedic-tray'],
  blackSes: ['sesame-oil/hero-dark-moody'],
}

/** Per-slug overrides when the default variant image is not the best fit. */
export const PLP_SLUG_GALLERY_OVERRIDES: Record<string, readonly string[]> = {
  'plp-coconut-hair-250': ['coconut-oil/wellness-spa'],
  'plp-coconut-gift-3pack': ['coconut-oil/hero-jar-coconuts'],
  'plp-trio-pack-edible': ['real-photos/mix-oil'],
  'plp-ayurvedic-sesame-250': ['sesame-oil/heritage-dark-stone'],
  'plp-black-sesame-250': ['sesame-oil/hero-dark-moody'],
  'plp-cold-mustard-250': ['all-oils/mustard-oil'],
}

export function galleryAltsForPlpProduct(slug: string, oilVariant: PlpOilVariant): readonly string[] {
  return PLP_SLUG_GALLERY_OVERRIDES[slug] ?? PLP_DEFAULT_GALLERY_BY_VARIANT[oilVariant] ?? []
}
