/**
 * PLP catalog: categories + products tuned for the listing-page filters.
 * No region/regionDistrict — region info is admin-only and lives outside Products
 * (future shipping-availability feature).
 * Run via GET /api/seed-plp (also wired into GET /api/seed-all).
 *
 * Idempotent: existing slugs are skipped, never overwritten.
 */

export const PLP_CATEGORIES = [
  { slug: 'edible-daily', title: 'Edible · daily' },
  { slug: 'edible-ceremonial', title: 'Edible · ceremonial' },
  { slug: 'wellness', title: 'Wellness' },
  { slug: 'gift-sets', title: 'Gift sets' },
  { slug: 'subscriptions', title: 'Subscriptions' },
] as const

export type PlpCategoryType = 'cooking' | 'wellness' | 'gift-sets' | 'subscription'
export type PlpUseCase = 'daily-cooking' | 'tempering' | 'salad' | 'hair-body' | 'ayurvedic'
export type PlpCertification = 'usda-organic' | 'india-organic' | 'single-origin'
export type PlpOilVariant =
  | 'sesame'
  | 'coconut'
  | 'groundnut'
  | 'mustard'
  | 'sunflower'
  | 'blackSes'
  | 'castor'

export type PlpVariantSize = '250ml' | '500ml' | '1L' | '5L'

export interface PlpSeedProduct {
  slug: string
  name: string
  oilVariant: PlpOilVariant
  tag: string | null
  categorySlug: (typeof PLP_CATEGORIES)[number]['slug']
  categoryType: PlpCategoryType
  useCases: PlpUseCase[]
  certifications: PlpCertification[]
  featured: boolean
  bestSeller: boolean
  variants: { size: PlpVariantSize; sku: string; price: number; mrp?: number; isDefault?: boolean }[]
  tagline: string
  /** Short marketing description shown on the product card (2-line clamp). */
  description: string
}

export const PLP_PRODUCTS: PlpSeedProduct[] = [
  // ── Edible · daily (6) ──────────────────────────────────────────────
  {
    slug: 'plp-sesame-500',
    name: 'Sesame · Til',
    oilVariant: 'sesame',
    tag: 'Best seller',
    categorySlug: 'edible-daily',
    categoryType: 'cooking',
    useCases: ['daily-cooking', 'tempering'],
    certifications: ['india-organic', 'single-origin'],
    featured: true,
    bestSeller: true,
    tagline: 'Slow-pressed til for everyday cooking.',
    description:
      'Wood-pressed below 40°C from single-farm sesame seeds. Deep amber colour, nutty aroma, and the full lignan profile lost in machine-extracted oils.',
    variants: [
      { size: '250ml', sku: 'PT-SES-250', price: 240 },
      { size: '500ml', sku: 'PT-SES-500', price: 420, isDefault: true },
      { size: '1L', sku: 'PT-SES-1L', price: 760, mrp: 820 },
    ],
  },
  {
    slug: 'plp-coconut-500',
    name: 'Virgin Coconut',
    oilVariant: 'coconut',
    tag: 'Cold-pressed',
    categorySlug: 'edible-daily',
    categoryType: 'cooking',
    useCases: ['daily-cooking', 'tempering'],
    certifications: ['usda-organic', 'single-origin'],
    featured: true,
    bestSeller: false,
    tagline: 'First-press virgin coconut.',
    description:
      'Cold-pressed from fresh kernels within hours of harvest — never deodorised, never bleached. Buttery aroma, natural lauric acid, perfect for tempering and baking.',
    variants: [
      { size: '250ml', sku: 'PT-COC-250', price: 280 },
      { size: '500ml', sku: 'PT-COC-500', price: 480, isDefault: true },
      { size: '1L', sku: 'PT-COC-1L', price: 920 },
    ],
  },
  {
    slug: 'plp-groundnut-500',
    name: 'Groundnut',
    oilVariant: 'groundnut',
    tag: null,
    categorySlug: 'edible-daily',
    categoryType: 'cooking',
    useCases: ['daily-cooking'],
    certifications: ['india-organic'],
    featured: false,
    bestSeller: true,
    tagline: 'High smoke-point groundnut for frying & sauté.',
    description:
      'Mechanically wood-pressed, unrefined groundnut oil with a mellow nutty finish. Stable at high heat — ideal for tadka, parathas, deep-frying, and everyday Indian cooking.',
    variants: [
      { size: '500ml', sku: 'PT-GN-500', price: 380, isDefault: true },
      { size: '1L', sku: 'PT-GN-1L', price: 720 },
      { size: '5L', sku: 'PT-GN-5L', price: 3400 },
    ],
  },
  {
    slug: 'plp-mustard-500',
    name: 'Mustard · Sarson',
    oilVariant: 'mustard',
    tag: 'Pungent',
    categorySlug: 'edible-daily',
    categoryType: 'cooking',
    useCases: ['tempering', 'daily-cooking'],
    certifications: ['single-origin'],
    featured: false,
    bestSeller: false,
    tagline: 'Pungent kachi-ghani mustard.',
    description:
      'Traditional kachi-ghani extraction preserves the natural pungency and golden colour. Made for pickles, sarson da saag, and winter cooking where mustard is the hero.',
    variants: [
      { size: '250ml', sku: 'PT-MUS-250', price: 210 },
      { size: '500ml', sku: 'PT-MUS-500', price: 360, isDefault: true },
    ],
  },
  {
    slug: 'plp-sunflower-1l',
    name: 'Sunflower',
    oilVariant: 'sunflower',
    tag: 'Daily cook',
    categorySlug: 'edible-daily',
    categoryType: 'cooking',
    useCases: ['daily-cooking', 'salad'],
    certifications: ['india-organic'],
    featured: false,
    bestSeller: false,
    tagline: 'Cold-pressed sunflower.',
    description:
      'Light, clean-tasting cold-pressed sunflower oil with a neutral profile. Excellent for everyday sauté, dressings, and salads where you want the food — not the oil — to shine.',
    variants: [
      { size: '500ml', sku: 'PT-SF-500', price: 280 },
      { size: '1L', sku: 'PT-SF-1L', price: 320, isDefault: true },
    ],
  },
  {
    slug: 'plp-sesame-1l',
    name: 'Sesame · 1 Litre',
    oilVariant: 'sesame',
    tag: 'Save 8%',
    categorySlug: 'edible-daily',
    categoryType: 'cooking',
    useCases: ['daily-cooking', 'tempering'],
    certifications: ['india-organic', 'single-origin'],
    featured: false,
    bestSeller: false,
    tagline: 'Family-size sesame — bulk value.',
    description:
      'The same wood-pressed til you love, in a family-size bottle. Stocks up your kitchen for a season of dosas, tadkas, and chutneys at a friendlier per-litre price.',
    variants: [
      { size: '1L', sku: 'PT-SES-1L-VAL', price: 760, mrp: 820, isDefault: true },
      { size: '5L', sku: 'PT-SES-5L-VAL', price: 3500, mrp: 3800 },
    ],
  },

  // ── Edible · ceremonial (2) ─────────────────────────────────────────
  {
    slug: 'plp-black-sesame-250',
    name: 'Black Sesame',
    oilVariant: 'blackSes',
    tag: 'Limited',
    categorySlug: 'edible-ceremonial',
    categoryType: 'cooking',
    useCases: ['ayurvedic', 'salad'],
    certifications: ['single-origin'],
    featured: true,
    bestSeller: false,
    tagline: 'Ceremonial black sesame — rare reserved press.',
    description:
      'A rare reserved press from a small batch of black sesame. Earthy, intensely aromatic — used sparingly for ceremonial dishes, abhyanga oils, and slow-cooked sweets.',
    variants: [
      { size: '250ml', sku: 'PT-BSES-250', price: 680, isDefault: true },
    ],
  },
  {
    slug: 'plp-cold-mustard-250',
    name: 'Cold-press Mustard',
    oilVariant: 'mustard',
    tag: 'Ceremonial',
    categorySlug: 'edible-ceremonial',
    categoryType: 'cooking',
    useCases: ['ayurvedic'],
    certifications: ['usda-organic', 'single-origin'],
    featured: false,
    bestSeller: false,
    tagline: 'Reserved-press mustard for ritual cooking.',
    description:
      'A small reserved press of mustard meant for festive cooking and pickling. Deeper colour, stronger pungency, and richer mouthfeel than our everyday kachi-ghani.',
    variants: [
      { size: '250ml', sku: 'PT-CMUS-250', price: 540, isDefault: true },
    ],
  },

  // ── Wellness (3) ────────────────────────────────────────────────────
  {
    slug: 'plp-castor-200',
    name: 'Castor · Eranda',
    oilVariant: 'castor',
    tag: 'Wellness',
    categorySlug: 'wellness',
    categoryType: 'wellness',
    useCases: ['hair-body', 'ayurvedic'],
    certifications: ['india-organic'],
    featured: true,
    bestSeller: false,
    tagline: 'Slow-pressed castor for hair & body rituals.',
    description:
      'Hexane-free, thick, slow-pressed castor oil for hair, scalp, and skin rituals. Traditionally used in oil pulling, abhyanga, and warm-oil scalp massage.',
    variants: [
      { size: '250ml', sku: 'PT-CAS-250', price: 540, isDefault: true },
    ],
  },
  {
    slug: 'plp-coconut-hair-250',
    name: 'Coconut · Hair',
    oilVariant: 'coconut',
    tag: 'Hair care',
    categorySlug: 'wellness',
    categoryType: 'wellness',
    useCases: ['hair-body'],
    certifications: ['usda-organic'],
    featured: false,
    bestSeller: false,
    tagline: 'Coconut oil blended for hair care.',
    description:
      'Cold-pressed coconut oil with a light infusion of curry leaf and hibiscus — a daily hair-care blend made the way grandmothers warmed and applied it.',
    variants: [
      { size: '250ml', sku: 'PT-COCH-250', price: 320, isDefault: true },
      { size: '500ml', sku: 'PT-COCH-500', price: 580 },
    ],
  },
  {
    slug: 'plp-ayurvedic-sesame-250',
    name: 'Ayurvedic Sesame',
    oilVariant: 'blackSes',
    tag: 'Ayurvedic',
    categorySlug: 'wellness',
    categoryType: 'wellness',
    useCases: ['ayurvedic', 'hair-body'],
    certifications: ['single-origin'],
    featured: false,
    bestSeller: false,
    tagline: 'Cold-pressed sesame infused for ayurvedic use.',
    description:
      'Black sesame base oil traditionally used as a vehicle for ayurvedic herbs. Warming, grounding, and ideal for abhyanga, joint massage, and shirodhara.',
    variants: [
      { size: '250ml', sku: 'PT-AYS-250', price: 460, isDefault: true },
    ],
  },

  // ── Gift sets (2) ───────────────────────────────────────────────────
  {
    slug: 'plp-coconut-gift-3pack',
    name: 'Coconut · Gift 3-pack',
    oilVariant: 'coconut',
    tag: 'Gift',
    categorySlug: 'gift-sets',
    categoryType: 'gift-sets',
    useCases: ['daily-cooking'],
    certifications: ['usda-organic'],
    featured: true,
    bestSeller: false,
    tagline: 'Three 250ml virgin coconut bottles, gift-boxed.',
    description:
      'A three-bottle set of fresh virgin coconut oil in our signature kraft gift box. Comes with a hand-written batch card — ready to give without re-wrapping.',
    variants: [
      { size: '250ml', sku: 'PT-GIFT-COC-3', price: 1380, mrp: 1500, isDefault: true },
    ],
  },
  {
    slug: 'plp-trio-pack-edible',
    name: 'Daily Trio',
    oilVariant: 'sesame',
    tag: 'Gift',
    categorySlug: 'gift-sets',
    categoryType: 'gift-sets',
    useCases: ['daily-cooking'],
    certifications: ['india-organic'],
    featured: false,
    bestSeller: false,
    tagline: 'Sesame, coconut & groundnut — a daily-cook trio.',
    description:
      'The three oils that cover most everyday Indian kitchens — sesame for tadka, coconut for tempering, groundnut for frying. Curated and gift-boxed together.',
    variants: [
      { size: '250ml', sku: 'PT-GIFT-TRIO', price: 980, mrp: 1080, isDefault: true },
    ],
  },

  // ── Subscriptions (1) ───────────────────────────────────────────────
  {
    slug: 'plp-monthly-sesame-sub',
    name: 'Sesame · Monthly',
    oilVariant: 'sesame',
    tag: 'Subscribe',
    categorySlug: 'subscriptions',
    categoryType: 'subscription',
    useCases: ['daily-cooking'],
    certifications: ['india-organic', 'single-origin'],
    featured: false,
    bestSeller: false,
    tagline: 'One 500ml bottle of fresh sesame, monthly.',
    description:
      'A 500 ml bottle of our wood-pressed sesame, freshly pressed and shipped each month. Cancel anytime — subscribers save 15% off the one-time price.',
    variants: [
      { size: '500ml', sku: 'PT-SUB-SES', price: 357, mrp: 420, isDefault: true },
    ],
  },
]
