/**
 * Sample catalog for `GET /api/seed-products`.
 * Images: Unsplash (https://unsplash.com/license) — hotlinked only during seeding;
 * Payload stores copies under `public/media`.
 */
export const CATALOG_CATEGORIES = [
  { slug: 'cooking-oils', title: 'Cooking oils' },
  { slug: 'wellness-oils', title: 'Wellness oils' },
  { slug: 'infused-specialty', title: 'Infused & specialty' },
] as const

export const CATALOG_MEDIA = [
  {
    alt: 'Sesame oil pour — seed hero',
    url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1200&q=80',
  },
  {
    alt: 'Coconut oil jar — seed',
    url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    alt: 'Cooking oils flatlay — seed',
    url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    alt: 'Mustard seeds and oil — seed',
    url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    alt: 'Castor plant wellness — seed',
    url: 'https://images.unsplash.com/photo-1506617420156-8e4536971650?auto=format&fit=crop&w=1200&q=80',
  },
] as const

export const CATALOG_PRODUCTS = [
  {
    slug: 'wood-pressed-sesame-erode',
    name: 'Wood-pressed sesame · Til (Erode)',
    oilVariant: 'sesame' as const,
    tag: 'Bestseller',
    categorySlug: 'cooking-oils',
    categoryType: 'cooking' as const,
    tagline: 'Nutty, slow-pressed below 40°C from single-farm sesame.',
    description:
      'Cold-pressed on a wooden ghani in Erode. Unrefined, full-bodied sesame for tadka, chutneys, and everyday cooking.',
    usageNote: 'Use raw for finishing or low–medium heat for sautéing. Smoke point suits Indian dry curries.',
    ratingDisplay: '4.9',
    reviewsDisplay: '312 verified pours',
    ratingStars: 5,
    featured: true,
    bestSeller: true,
    mediaIndex: 0,
    variants: [
      { size: '250ml' as const, sku: 'PT-SES-250', price: 220, mrp: 260, subscribePrice: 187, stock: 80, isDefault: false },
      { size: '500ml' as const, sku: 'PT-SES-500', price: 420, mrp: 480, subscribePrice: 357, stock: 120, isDefault: true },
      { size: '1L' as const, sku: 'PT-SES-1L', price: 780, mrp: 900, subscribePrice: 663, stock: 40, isDefault: false },
      { size: '5L' as const, sku: 'PT-SES-5L', price: 3600, mrp: 4100, subscribePrice: 3060, stock: 12, isDefault: false },
    ],
    batch: {
      batchNumber: 'SES-24-B',
      pressTemperature: '< 40°C',
      yield: '32%',
      farmLocation: 'Erode, Tamil Nadu',
    },
    benefits: [
      { title: 'Natural antioxidants', description: 'Sesamol and sesamin from cold pressing.', icon: 'shield' as const },
      { title: 'Heart-friendly fats', description: 'Balanced PUFA/MUFA when used in rotation.', icon: 'heart' as const },
      { title: 'Deep flavour', description: 'Ideal for South Indian and Bengali dishes.', icon: 'star' as const },
    ],
    meta: { title: 'Wood-pressed sesame oil · Punyakoti', description: 'Single-origin Erode sesame, wood-pressed under 40°C.' },
  },
  {
    slug: 'virgin-coconut-kollam',
    name: 'Virgin coconut oil (Kollam)',
    oilVariant: 'coconut' as const,
    tag: 'Fresh batch',
    categorySlug: 'cooking-oils',
    categoryType: 'cooking' as const,
    tagline: 'First-press coconut — floral, buttery, no deodorising.',
    description:
      'Harvested in Kerala and pressed within hours. Virgin oil with natural lauric acid and a clean coconut aroma.',
    usageNote: 'Medium heat for stir-fries; excellent for tempering and baking.',
    ratingDisplay: '4.8',
    reviewsDisplay: '189 reviews',
    ratingStars: 5,
    featured: true,
    bestSeller: false,
    mediaIndex: 1,
    variants: [
      { size: '250ml' as const, sku: 'PT-COC-250', price: 260, mrp: 300, subscribePrice: 221, stock: 60, isDefault: false },
      { size: '500ml' as const, sku: 'PT-COC-500', price: 480, mrp: 540, subscribePrice: 408, stock: 90, isDefault: true },
      { size: '1L' as const, sku: 'PT-COC-1L', price: 920, mrp: 1040, subscribePrice: 782, stock: 35, isDefault: false },
    ],
    batch: {
      batchNumber: 'COC-24-K',
      pressTemperature: '< 38°C',
      yield: '36%',
      farmLocation: 'Kollam, Kerala',
    },
    benefits: [
      { title: 'Lauric acid', description: 'Naturally present in virgin coconut oil.', icon: 'leaf' as const },
      { title: 'Stable for cooking', description: 'Suits everyday Indian cooking styles.', icon: 'drop' as const },
    ],
    meta: { title: 'Virgin coconut oil · Kollam', description: 'Cold-pressed virgin coconut from Kerala.' },
  },
  {
    slug: 'groundnut-wood-pressed-karnataka',
    name: 'Wood-pressed groundnut',
    oilVariant: 'groundnut' as const,
    tag: null,
    categorySlug: 'cooking-oils',
    categoryType: 'cooking' as const,
    tagline: 'High-heat friendly with a mellow nutty finish.',
    description:
      'Groundnuts from Karnataka farms, mechanically pressed on wood. Unrefined oil for frying, parathas, and everyday tadka.',
    usageNote: 'High smoke point — ideal for deep frying and sauté.',
    ratingDisplay: '4.7',
    reviewsDisplay: '96 reviews',
    ratingStars: 4,
    featured: false,
    bestSeller: true,
    mediaIndex: 2,
    variants: [
      { size: '500ml' as const, sku: 'PT-GN-500', price: 380, mrp: 430, subscribePrice: 323, stock: 100, isDefault: true },
      { size: '1L' as const, sku: 'PT-GN-1L', price: 720, mrp: 820, subscribePrice: 612, stock: 55, isDefault: false },
      { size: '5L' as const, sku: 'PT-GN-5L', price: 3400, mrp: 3900, subscribePrice: 2890, stock: 15, isDefault: false },
    ],
    batch: {
      batchNumber: 'GN-24-R',
      pressTemperature: '< 40°C',
      yield: '38%',
      farmLocation: 'Raichur, Karnataka',
    },
    benefits: [{ title: 'High smoke point', description: 'Great for Indian frying and roasting.', icon: 'shield' as const }],
    meta: { title: 'Wood-pressed groundnut oil', description: 'Karnataka groundnut, wood-pressed, unrefined.' },
  },
  {
    slug: 'kachi-ghani-mustard-alwar',
    name: 'Kachi ghani mustard · Sarson',
    oilVariant: 'mustard' as const,
    tag: 'Regional favourite',
    categorySlug: 'infused-specialty',
    categoryType: 'cooking' as const,
    tagline: 'Pungent, golden mustard from Rajasthan cold plains.',
    description:
      'Traditional kachi ghani extraction keeps natural pungency and colour. Ideal for pickles, masalas, and winter cooking.',
    usageNote: 'Heat gently to temper; classic for sarson da saag.',
    ratingDisplay: '4.8',
    reviewsDisplay: '141 reviews',
    ratingStars: 5,
    featured: false,
    bestSeller: false,
    mediaIndex: 3,
    variants: [
      { size: '250ml' as const, sku: 'PT-MUS-250', price: 210, mrp: 245, subscribePrice: 178, stock: 70, isDefault: false },
      { size: '500ml' as const, sku: 'PT-MUS-500', price: 360, mrp: 410, subscribePrice: 306, stock: 85, isDefault: true },
      { size: '1L' as const, sku: 'PT-MUS-1L', price: 680, mrp: 780, subscribePrice: 578, stock: 30, isDefault: false },
    ],
    batch: {
      batchNumber: 'MUS-24-A',
      pressTemperature: '< 40°C',
      yield: '30%',
      farmLocation: 'Alwar, Rajasthan',
    },
    benefits: [{ title: 'Distinct aroma', description: 'Classic North & East Indian dishes.', icon: 'star' as const }],
    meta: { title: 'Kachi ghani mustard oil', description: 'Rajasthan mustard, wood-pressed.' },
  },
  {
    slug: 'cold-pressed-castor-wellness',
    name: 'Cold-pressed castor · wellness',
    oilVariant: 'castor' as const,
    tag: 'Wellness',
    categorySlug: 'wellness-oils',
    categoryType: 'wellness' as const,
    tagline: 'Thick, slow-pressed castor for hair and body rituals.',
    description:
      'Hexane-free mechanical pressing. Traditionally used for scalp massage and winter skin care — food-grade where applicable.',
    usageNote: 'External use or as directed by your practitioner.',
    ratingDisplay: '4.6',
    reviewsDisplay: '74 reviews',
    ratingStars: 4,
    featured: true,
    bestSeller: false,
    mediaIndex: 4,
    variants: [
      { size: '250ml' as const, sku: 'PT-CAS-250', price: 290, mrp: 340, subscribePrice: 246, stock: 45, isDefault: true },
      { size: '500ml' as const, sku: 'PT-CAS-500', price: 520, mrp: 600, subscribePrice: 442, stock: 30, isDefault: false },
    ],
    batch: {
      batchNumber: 'CAS-24-G',
      pressTemperature: '< 35°C',
      yield: '28%',
      farmLocation: 'Saurashtra, Gujarat',
    },
    benefits: [
      { title: 'Dense & nourishing', description: 'Traditional hair and skin routines.', icon: 'heart' as const },
      { title: 'Slow press', description: 'Mechanical extraction without solvents.', icon: 'leaf' as const },
    ],
    meta: { title: 'Cold-pressed castor oil · wellness', description: 'Wood-pressed castor from Gujarat.' },
  },
] as const
