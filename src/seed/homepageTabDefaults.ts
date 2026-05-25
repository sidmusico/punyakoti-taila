/**
 * Full default document for Globals → Homepage (tab-based fields).
 * Used by `GET /api/seed-homepage` and storefront seed when the global is still empty.
 */
export const homepageTabDefaults = {
  cinematicEnabled: true,
  cinematic: {
    badge: 'Traditional extraction',
    headlineLine1: 'The essence of',
    headlineItalic: 'purity.',
    lead: 'Handcrafted cold-pressed oils, honouring ancient Ayurvedic wisdom for modern wellness. Single-origin. Wooden-press. Bottled within 72 hours.',
    cta: { label: 'Shop the collection', href: '/shop' },
  },
  heroEnabled: true,
  hero: {
    eyebrow: 'Est. from a village press',
    headlineLine1: 'Pressed slowly,',
    headlineLine2: 'on wood.',
    headlineItalicWord: 'wood.',
    body: "The way your grandmother's kitchen smelled. Unrefined oils from wooden ghanis in Erode and Coimbatore — bottled within 72 hours, shipped to your kitchen in eight days.",
    primaryCTA: { label: 'Shop the collection', href: '/shop' },
    secondaryCTA: { label: 'Read our story', href: '/about' },
    reviewRating: '4.9 / 5',
    reviewCount: '2,847 verified kitchens',
    bottleVariant: 'sesame',
    batchCaptionLeft: 'Batch #047',
    batchCaptionRight: 'Erode · Nov 2025',
    pressWeekKicker: 'Press of the week',
    pressWeekTitle: 'Sesame · Erode',
    backgroundStyle: 'cream',
  },
  pressMarqueeEnabled: true,
  pressMarquee: {
    items: [
      { live: true, italic: false, text: 'Pressing now · Sesame', stamp: 'Erode · NOV 14' },
      { live: false, italic: true, text: 'Bottled this week · Coconut', stamp: 'Kollam · NOV 12' },
      { live: false, italic: false, text: 'Settling · Mustard', stamp: 'Alwar · NOV 11' },
      { live: false, italic: true, text: 'Harvest in · Black sesame', stamp: 'Salem · NOV 09' },
      { live: false, italic: false, text: 'Lab cleared · Groundnut', stamp: 'Kadapa · NOV 08' },
      { live: true, italic: false, text: 'Press of the week · Sesame', stamp: 'Batch #047' },
    ],
  },
  trustStripEnabled: true,
  trustStrip: [
    { icon: 'leaf', label: 'Wood-pressed', sub: 'Zero heat, zero solvents' },
    { icon: 'shield', label: 'Lab tested', sub: 'Every batch, published' },
    { icon: 'truck', label: 'Free over ₹999', sub: 'Ships in 2–5 days' },
    { icon: 'refresh', label: '30-day return', sub: 'No questions asked' },
  ],
  featuredSectionEnabled: true,
  featuredSection: {
    eyebrow: 'The collection',
    headline: 'Six oils, one philosophy',
    body: 'Pressed slowly on wooden ghanis. Bottled within 72 hours. Always single-batch.',
    ctaLabel: 'Shop all',
    ctaHref: '/shop',
    columns: '3',
  },
  traditionEnabled: true,
  tradition: {
    eyebrow: 'Five generations',
    headlineLine1: 'The Punyakoti',
    headlineItalic: 'tradition.',
    paragraph1:
      'For five generations, our family has practised the art of cold-pressing oils using traditional wooden churns — chekku in Tamil, kachi ghani in Hindi. This gentle method preserves the natural aroma, vital nutrients, and pure essence of the seed — uncorrupted by heat or chemical solvents.',
    paragraph2:
      'We source from trusted organic farmers who share our commitment to sustainable, earth-friendly agriculture. Every drop of Punyakoti Taila is a testament to purity.',
    ctaPrimary: { label: 'Discover our story', href: '/about' },
    ctaSecondary: { label: 'Visit the press', href: '/about#press' },
    mediaCaptionLeft: 'Batch #047 · 9-hour press',
    mediaCaptionRight: 'Erode · Tamil Nadu',
  },
  processStepsEnabled: true,
  processSteps: {
    eyebrow: 'The process · est. five generations',
    headlineLine1: 'Wood, weight,',
    headlineItalic: 'time.',
    body: 'A wooden ghani turns at four revolutions per minute. No heat. No solvents. Just seed, stone, and the patience to wait nine hours for two litres. The yield is half. The flavour is whole.',
    steps: [
      { n: '01', title: 'Sourced', description: 'Single-farm seed. Sun-dried on jute mats. Cleaned by hand.' },
      { n: '02', title: 'Pressed', description: 'Wood ghani at 4rpm. Two-litre yield per nine-hour press.' },
      { n: '03', title: 'Settled', description: '72 hours of gravity. No filtration. No clarifiers.' },
      { n: '04', title: 'Bottled', description: 'Dark amber glass. Numbered. Stamped. Shipped warm.' },
    ],
    cta: { label: 'Read our story', href: '/about' },
  },
  processSectionEnabled: true,
  processSection: {
    eyebrow: 'How we press',
    headlineLine1: 'The ghani has turned',
    headlineLine2: 'for a thousand years.',
    body: "A wooden press, a stone wheel, a slow rotation — this is how oil has been made in India for millennia. At Punyakoti, we've changed nothing. Seeds go in, oil comes out, below 40°C. Always.",
    stats: [
      { value: '< 40°C', label: 'Press temperature' },
      { value: '72 hrs', label: 'Farm to bottle' },
      { value: '100%', label: 'Single-origin seeds' },
      { value: '0', label: 'Chemical additives' },
    ],
    ctaLabel: 'Read our story',
    ctaHref: '/about',
  },
  poeticEnabled: true,
  poetic: {
    eyebrow: 'An aside · from the Wood-Press Diary',
    headline1: 'Refined oil is a shortcut.',
    headline2: 'We press the long way around.',
    body: 'The industrial press runs at 240°C with hexane solvent — fast, high-yield, and chemically obedient. The wooden ghani turns at four revolutions per minute, peaks at 38°C, and gives you back exactly half. The other half is what tradition called flavour. We chose half.',
  },
  whyColdPressedEnabled: true,
  whyColdPressed: {
    eyebrow: 'Why cold-pressed',
    headline: 'Refined oil is a twentieth-century compromise.',
    headlineItalic: 'compromise.',
    scienceHref: '/journal/why-cold-pressed',
    scienceLabel: 'The science, plainly written',
    cards: [
      {
        icon: 'leaf',
        title: 'Lignans intact',
        body: 'Wood-pressing preserves sesamin and sesamol — the antioxidants that distinguish a real til oil.',
      },
      {
        icon: 'drop',
        title: 'Below 40°C',
        body: 'Heat fragments fatty acids. We stay cool enough to protect every chain.',
      },
      {
        icon: 'shield',
        title: 'No solvents',
        body: 'Industrial oil is hexane-extracted. Ours touches only seed, wood, and gravity.',
      },
      {
        icon: 'star',
        title: 'Unfiltered',
        body: 'We let oil settle for 72 hours. What rises is what nourishes.',
      },
    ],
  },
  statsBandEnabled: true,
  statsBand: {
    eyebrow: 'By the numbers',
    headlinePrefix: 'What slow looks like,',
    headlineItalic: 'plainly.',
    stats: [
      { value: '47', label: 'Batches', sub: 'this season alone' },
      { value: '2,847', label: 'Kitchens', sub: 'across India' },
      { value: '9 hr', label: 'Per press', sub: 'wooden ghani at 38°C' },
      { value: '4.9', label: 'Reviews', sub: 'from 612 verified buyers' },
    ],
  },
  bestSellersEnabled: true,
  bestSellers: {
    eyebrow: 'Best sellers',
    headline: 'What kitchens keep reordering.',
    cta: { label: 'Subscribe & save 15%', href: '/shop' },
    source: 'auto',
  },
  bottleRowEnabled: true,
  bottleRow: {
    eyebrow: 'Six presses · one shelf',
    headlineBefore: 'The whole',
    headlineItalic: 'kitchen.',
    cta: { label: 'Shop all six oils', href: '/shop' },
  },
  testimonialsBandEnabled: true,
  testimonialsBand: {
    eyebrow: 'Letters from kitchens',
    headline: 'Trusted by 2,800+ kitchens',
    source: 'featured',
    maxItems: 3,
  },
  journalEnabled: true,
  journal: {
    eyebrow: 'Journal',
    headlineLine1: 'Recipes, rituals, and',
    headlineLine2: "what we're reading.",
    cta: { label: 'Read the journal', href: '/posts' },
    posts: [
      {
        tag: 'Recipe',
        title: 'Til kuzhambu — the way they cook it in Tirunelveli',
        read: '6 min read',
        slug: 'til-kuzhambu',
        toneA: '#5A7B3E',
        toneB: '#2E4222',
      },
      {
        tag: 'Provenance',
        title: 'The day we drove to Erode and sat next to the press for 9 hours',
        read: '11 min read',
        slug: 'erode-press-diary',
        toneA: '#2F4A2A',
        toneB: '#0F1A0E',
      },
      {
        tag: 'Wellness',
        title: 'Why your great-grandmother oiled her hair on Saturdays',
        read: '4 min read',
        slug: 'hair-oil-ritual',
        toneA: '#E0AF52',
        toneB: '#4B2A0D',
      },
    ],
  },
  newsletterEnabled: true,
  newsletter: {
    eyebrow: 'The Wood-Press Diary',
    headlineLine1: 'A short letter,',
    headlineLine2Italic: 'once a fortnight.',
    body: "Press updates from Erode, the occasional recipe from our test kitchen, and ten percent off your next bottle.",
    legalText: 'We will not sell your address. Unsubscribe in one click.',
    buttonLabel: 'Subscribe',
  },
  faqEnabled: true,
  faq: {
    eyebrow: 'Frequently asked',
    headlinePrefix: 'Short, honest',
    headlineItalic: 'answers.',
    style: 'light',
    items: [
      {
        question: 'How long does the oil keep?',
        answer:
          'Six months from the press date stamped on the bottle. After opening, refrigerate and finish within ten weeks for full aroma.',
      },
      {
        question: 'Is this organic-certified?',
        answer:
          'Our farms are USDA-NOP and India-Organic certified. We publish lab tests for each batch on the product page.',
      },
      {
        question: "What does 'kachi ghani' mean?",
        answer:
          'Literally: a cold press. Practically: pressed without heat in a wooden mortar — the original method, slow and low-yield.',
      },
      {
        question: 'Can I subscribe?',
        answer:
          "Yes — pick any oil and select 'subscribe & save 15%'. Pause, skip, or cancel anytime from your account.",
      },
    ],
  },
} as const

export function isHomepageGlobalUnset(hp: unknown): boolean {
  if (!hp || typeof hp !== 'object') return true
  const o = hp as Record<string, unknown>
  /** Tab-based schema: old rows lack `cinematicEnabled` */
  if (!('cinematicEnabled' in o)) return true
  const hero = o.hero as { headlineLine1?: string } | undefined
  const cinematic = o.cinematic as { badge?: string } | undefined
  if (hero?.headlineLine1?.trim() || cinematic?.badge?.trim()) return false
  return true
}
