import type { Field } from 'payload'

const TRUST_ICONS: Field = {
  name: 'icon',
  type: 'select',
  required: true,
  options: [
    { label: 'Leaf', value: 'leaf' },
    { label: 'Drop', value: 'drop' },
    { label: 'Truck', value: 'truck' },
    { label: 'Shield', value: 'shield' },
    { label: 'Star', value: 'star' },
    { label: 'Check', value: 'check' },
    { label: 'Refresh', value: 'refresh' },
  ],
}

const BENEFIT_ICONS: Field = {
  name: 'icon',
  type: 'select',
  required: true,
  defaultValue: 'leaf',
  options: [
    { label: 'Leaf', value: 'leaf' },
    { label: 'Drop', value: 'drop' },
    { label: 'Shield', value: 'shield' },
    { label: 'Star', value: 'star' },
    { label: 'Check', value: 'check' },
  ],
}

const OIL_VARIANTS = [
  { label: 'Sesame', value: 'sesame' },
  { label: 'Coconut', value: 'coconut' },
  { label: 'Groundnut', value: 'groundnut' },
  { label: 'Mustard', value: 'mustard' },
  { label: 'Sunflower', value: 'sunflower' },
  { label: 'Black sesame', value: 'blackSes' },
] as const

/**
 * One admin tab per homepage section. Each tab starts with **Show this section** (except arrays
 * that include their own enable row). Order matches the live homepage stack.
 */
export const homepageTabsField: Field = {
  type: 'tabs',
  tabs: [
    {
      label: 'Hero — Cinematic',
      description: 'Full-viewport cinematic hero (wood press scene)',
      fields: [
        { name: 'cinematicEnabled', type: 'checkbox', defaultValue: true, label: 'Show this section' },
        {
          name: 'cinematic',
          type: 'group',
          label: 'Content',
          fields: [
            { name: 'badge', type: 'text', defaultValue: 'Traditional extraction', label: 'Top pill' },
            { name: 'headlineLine1', type: 'text', defaultValue: 'The essence of', label: 'Headline line 1' },
            { name: 'headlineItalic', type: 'text', defaultValue: 'purity.', label: 'Italic line' },
            {
              name: 'lead',
              type: 'textarea',
              defaultValue:
                'Handcrafted cold-pressed oils, honouring ancient Ayurvedic wisdom for modern wellness. Single-origin. Wooden-press. Bottled within 72 hours.',
            },
            {
              name: 'cta',
              type: 'group',
              fields: [
                { name: 'label', type: 'text', defaultValue: 'Shop the collection' },
                { name: 'href', type: 'text', defaultValue: '/shop' },
              ],
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Cinematic hero background image (optional). Falls back to gradient.' },
            },
          ],
        },
      ],
    },
    {
      label: 'Hero — Editorial',
      description: 'Split hero with bottle and copy',
      fields: [
        { name: 'heroEnabled', type: 'checkbox', defaultValue: true, label: 'Show this section' },
        {
          name: 'hero',
          type: 'group',
          label: 'Content',
          fields: [
            { name: 'eyebrow', type: 'text', defaultValue: 'Est. from a village press' },
            { name: 'headlineLine1', type: 'text', defaultValue: 'Pressed slowly,' },
            { name: 'headlineLine2', type: 'text', defaultValue: 'on wood.' },
            {
              name: 'headlineItalicWord',
              type: 'text',
              defaultValue: 'wood.',
              admin: { description: 'Must match a substring of line 2 exactly' },
            },
            {
              name: 'body',
              type: 'textarea',
              defaultValue:
                "The way your grandmother's kitchen smelled. Unrefined oils from wooden ghanis in Erode and Coimbatore — bottled within 72 hours, shipped to your kitchen in eight days.",
            },
            {
              name: 'primaryCTA',
              type: 'group',
              fields: [
                { name: 'label', type: 'text', defaultValue: 'Shop the collection' },
                { name: 'href', type: 'text', defaultValue: '/shop' },
              ],
            },
            {
              name: 'secondaryCTA',
              type: 'group',
              fields: [
                { name: 'label', type: 'text', defaultValue: 'Read our story' },
                { name: 'href', type: 'text', defaultValue: '/about' },
              ],
            },
            { name: 'reviewRating', type: 'text', defaultValue: '4.9 / 5' },
            { name: 'reviewCount', type: 'text', defaultValue: '2,847 verified kitchens' },
            {
              name: 'bottleVariant',
              type: 'select',
              defaultValue: 'sesame',
              options: [...OIL_VARIANTS],
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Hero side image (optional). Renders alongside the SVG bottle if set.' },
            },
            { name: 'pressWeekKicker', type: 'text', defaultValue: 'Press of the week' },
            { name: 'pressWeekTitle', type: 'text', defaultValue: 'Sesame · Erode' },
            {
              name: 'backgroundStyle',
              type: 'select',
              defaultValue: 'cream',
              options: [
                { label: 'Cream', value: 'cream' },
                { label: 'Dark green', value: 'dark-green' },
                { label: 'Warm white', value: 'warm-white' },
              ],
            },
          ],
        },
      ],
    },
    {
      label: 'Press marquee',
      description:
        'Dark scrolling band listing the cities where products are available. ' +
        'City list comes from the "Service locations" collection — manage it there. ' +
        'Toggle this section off to hide the band entirely.',
      fields: [
        { name: 'pressMarqueeEnabled', type: 'checkbox', defaultValue: true, label: 'Show this section' },
        {
          name: 'pressMarquee',
          type: 'group',
          fields: [
            {
              name: 'introLabel',
              type: 'text',
              defaultValue: 'Now available in these cities',
              label: 'Intro label',
              admin: {
                description:
                  'Small uppercase label shown above the scrolling band. Leave blank to hide.',
              },
            },
            {
              name: 'items',
              type: 'array',
              minRows: 0,
              admin: {
                description:
                  'Legacy custom items. Leave empty to use the Service locations collection instead.',
              },
              fields: [
                { name: 'live', type: 'checkbox', defaultValue: false },
                { name: 'italic', type: 'checkbox', defaultValue: false },
                { name: 'text', type: 'text', required: true },
                { name: 'stamp', type: 'text', required: true },
              ],
            },
          ],
        },
      ],
    },
    {
      label: 'Trust strip',
      fields: [
        { name: 'trustStripEnabled', type: 'checkbox', defaultValue: true, label: 'Show this section' },
        {
          name: 'trustStrip',
          type: 'array',
          minRows: 1,
          maxRows: 6,
          fields: [TRUST_ICONS, { name: 'label', type: 'text', required: true }, { name: 'sub', type: 'text' }],
        },
      ],
    },
    {
      label: 'Featured oils',
      fields: [
        { name: 'featuredSectionEnabled', type: 'checkbox', defaultValue: true, label: 'Show this section' },
        {
          name: 'featuredSection',
          type: 'group',
          fields: [
            { name: 'eyebrow', type: 'text', defaultValue: 'The collection' },
            { name: 'headline', type: 'text', defaultValue: 'Six oils, one philosophy' },
            {
              name: 'body',
              type: 'text',
              defaultValue: 'Pressed slowly on wooden ghanis. Bottled within 72 hours of pressing.',
            },
            { name: 'ctaLabel', type: 'text', defaultValue: 'Shop all' },
            { name: 'ctaHref', type: 'text', defaultValue: '/shop' },
            {
              name: 'columns',
              type: 'select',
              defaultValue: '3',
              options: [
                { label: '2 columns', value: '2' },
                { label: '3 columns', value: '3' },
                { label: '4 columns', value: '4' },
              ],
            },
            {
              name: 'products',
              type: 'relationship',
              relationTo: 'products',
              hasMany: true,
              admin: { description: 'Optional — leave empty to show the first active catalog products.' },
            },
          ],
        },
      ],
    },
    {
      label: 'Tradition',
      fields: [
        { name: 'traditionEnabled', type: 'checkbox', defaultValue: true, label: 'Show this section' },
        {
          name: 'tradition',
          type: 'group',
          fields: [
            { name: 'eyebrow', type: 'text', defaultValue: 'Five generations' },
            { name: 'headlineLine1', type: 'text', defaultValue: 'The Punyakoti' },
            { name: 'headlineItalic', type: 'text', defaultValue: 'tradition.' },
            {
              name: 'paragraph1',
              type: 'textarea',
              required: true,
              defaultValue:
                'For five generations, our family has practised the art of cold-pressing oils using traditional wooden churns — chekku in Tamil, kachi ghani in Hindi.',
            },
            {
              name: 'paragraph2',
              type: 'textarea',
              required: true,
              defaultValue:
                'We source from trusted organic farmers who share our commitment to sustainable, earth-friendly agriculture.',
            },
            {
              name: 'ctaPrimary',
              type: 'group',
              fields: [
                { name: 'label', type: 'text', defaultValue: 'Discover our story' },
                { name: 'href', type: 'text', defaultValue: '/about' },
              ],
            },
            {
              name: 'ctaSecondary',
              type: 'group',
              fields: [
                { name: 'label', type: 'text', defaultValue: 'Visit the press' },
                { name: 'href', type: 'text', defaultValue: '/about#press' },
              ],
            },
            { name: 'mediaCaptionLeft', type: 'text', defaultValue: 'Wood-pressed · 9-hour press' },
            { name: 'mediaCaptionRight', type: 'text', defaultValue: 'Erode · Tamil Nadu' },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Tradition section photo (e.g. wood-press in village).' },
            },
          ],
        },
      ],
    },
    {
      label: 'Process — steps',
      description: 'Dark numbered process band',
      fields: [
        { name: 'processStepsEnabled', type: 'checkbox', defaultValue: true, label: 'Show this section' },
        {
          name: 'processSteps',
          type: 'group',
          fields: [
            { name: 'eyebrow', type: 'text', defaultValue: 'The process · est. five generations' },
            { name: 'headlineLine1', type: 'text', defaultValue: 'Wood, weight,' },
            { name: 'headlineItalic', type: 'text', defaultValue: 'time.' },
            {
              name: 'body',
              type: 'textarea',
              required: true,
              defaultValue:
                'A wooden ghani turns at four revolutions per minute. No heat. No solvents. Just seed, stone, and the patience to wait nine hours for two litres. The yield is half. The flavour is whole.',
            },
            {
              name: 'steps',
              type: 'array',
              minRows: 1,
              fields: [
                { name: 'n', type: 'text', required: true },
                { name: 'title', type: 'text', required: true },
                { name: 'description', type: 'textarea', required: true },
                { name: 'image', type: 'upload', relationTo: 'media', admin: { description: 'Optional photo for this step.' } },
              ],
            },
            {
              name: 'cta',
              type: 'group',
              fields: [
                { name: 'label', type: 'text', defaultValue: 'Read our story' },
                { name: 'href', type: 'text', defaultValue: '/about' },
              ],
            },
            {
              name: 'bannerImage',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Optional banner photo above the steps.' },
            },
          ],
        },
      ],
    },
    {
      label: 'Process — stats banner',
      description: 'Light section with optional 2×2 stats',
      fields: [
        { name: 'processSectionEnabled', type: 'checkbox', defaultValue: true, label: 'Show this section' },
        {
          name: 'processSection',
          type: 'group',
          fields: [
            { name: 'eyebrow', type: 'text', defaultValue: 'How we press' },
            { name: 'headlineLine1', type: 'text', defaultValue: 'The ghani has turned' },
            { name: 'headlineLine2', type: 'text', defaultValue: 'for a thousand years.' },
            {
              name: 'body',
              type: 'textarea',
              defaultValue:
                "A wooden press, a stone wheel, a slow rotation — this is how oil has been made in India for millennia. At Punyakoti, we've changed nothing.",
            },
            {
              name: 'stats',
              type: 'array',
              maxRows: 4,
              fields: [
                { name: 'value', type: 'text', required: true },
                { name: 'label', type: 'text', required: true },
              ],
            },
            { name: 'ctaLabel', type: 'text', defaultValue: 'Read our story' },
            { name: 'ctaHref', type: 'text', defaultValue: '/about' },
            {
              name: 'backgroundImage',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Optional background photo behind the stats band.' },
            },
          ],
        },
      ],
    },
    {
      label: 'Poetic interlude',
      fields: [
        { name: 'poeticEnabled', type: 'checkbox', defaultValue: true, label: 'Show this section' },
        {
          name: 'poetic',
          type: 'group',
          fields: [
            { name: 'eyebrow', type: 'text', defaultValue: 'An aside · from the Wood-Press Diary' },
            { name: 'headline1', type: 'text', defaultValue: 'Refined oil is a shortcut.' },
            { name: 'headline2', type: 'text', defaultValue: 'We press the long way around.' },
            {
              name: 'body',
              type: 'textarea',
              required: true,
              defaultValue:
                'The industrial press runs at 240°C with hexane solvent — fast, high-yield, and chemically obedient. The wooden ghani turns at four revolutions per minute, peaks at 38°C, and gives you back exactly half.',
            },
            {
              name: 'backgroundImage',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Optional muted background photo behind the poetic interlude.' },
            },
          ],
        },
      ],
    },
    {
      label: 'Why cold-pressed',
      fields: [
        { name: 'whyColdPressedEnabled', type: 'checkbox', defaultValue: true, label: 'Show this section' },
        {
          name: 'whyColdPressed',
          type: 'group',
          fields: [
            { name: 'eyebrow', type: 'text', defaultValue: 'Why cold-pressed' },
            {
              name: 'headline',
              type: 'text',
              defaultValue: 'Refined oil is a twentieth-century compromise.',
            },
            { name: 'headlineItalic', type: 'text', defaultValue: 'compromise.' },
            {
              name: 'scienceHref',
              type: 'text',
              defaultValue: '/journal/why-cold-pressed',
              label: 'Science link URL',
            },
            {
              name: 'scienceLabel',
              type: 'text',
              defaultValue: 'The science, plainly written',
              label: 'Science link label',
            },
            {
              name: 'cards',
              type: 'array',
              minRows: 1,
              maxRows: 6,
              fields: [
                BENEFIT_ICONS,
                { name: 'title', type: 'text', required: true },
                { name: 'body', type: 'textarea', required: true },
              ],
            },
          ],
        },
      ],
    },
    {
      label: 'Stats band',
      fields: [
        { name: 'statsBandEnabled', type: 'checkbox', defaultValue: true, label: 'Show this section' },
        {
          name: 'statsBand',
          type: 'group',
          fields: [
            { name: 'eyebrow', type: 'text', defaultValue: 'By the numbers' },
            { name: 'headlinePrefix', type: 'text', defaultValue: 'What slow looks like,' },
            { name: 'headlineItalic', type: 'text', defaultValue: 'plainly.' },
            {
              name: 'stats',
              type: 'array',
              minRows: 1,
              maxRows: 6,
              fields: [
                { name: 'value', type: 'text', required: true },
                { name: 'label', type: 'text', required: true },
                { name: 'sub', type: 'text', required: true },
              ],
            },
            {
              name: 'backgroundImage',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Optional muted background photo behind the stats band.' },
            },
          ],
        },
      ],
    },
    {
      label: 'Best sellers',
      fields: [
        { name: 'bestSellersEnabled', type: 'checkbox', defaultValue: true, label: 'Show this section' },
        {
          name: 'bestSellers',
          type: 'group',
          fields: [
            { name: 'eyebrow', type: 'text', defaultValue: 'Best sellers' },
            { name: 'headline', type: 'text', defaultValue: 'What kitchens keep reordering.' },
            {
              name: 'cta',
              type: 'group',
              fields: [
                { name: 'label', type: 'text', defaultValue: 'Subscribe & save 15%' },
                { name: 'href', type: 'text', defaultValue: '/shop' },
              ],
            },
            {
              name: 'source',
              type: 'select',
              defaultValue: 'auto',
              options: [
                { label: 'First 4 active products', value: 'auto' },
                { label: 'Manual selection', value: 'manual' },
              ],
            },
            {
              name: 'products',
              type: 'relationship',
              relationTo: 'products',
              hasMany: true,
              maxRows: 4,
              admin: {
                condition: (_, siblingData) => siblingData?.source === 'manual',
              },
            },
          ],
        },
      ],
    },
    {
      label: 'Bottle row',
      fields: [
        { name: 'bottleRowEnabled', type: 'checkbox', defaultValue: true, label: 'Show this section' },
        {
          name: 'bottleRow',
          type: 'group',
          fields: [
            { name: 'eyebrow', type: 'text', defaultValue: 'Six presses · one shelf' },
            { name: 'headlineBefore', type: 'text', defaultValue: 'The whole' },
            { name: 'headlineItalic', type: 'text', defaultValue: 'kitchen.' },
            {
              name: 'cta',
              type: 'group',
              fields: [
                { name: 'label', type: 'text', defaultValue: 'Shop all six oils' },
                { name: 'href', type: 'text', defaultValue: '/shop' },
              ],
            },
            {
              name: 'products',
              type: 'relationship',
              relationTo: 'products',
              hasMany: true,
              maxRows: 6,
              admin: {
                description:
                  'Six oils in display order (sesame → coconut → groundnut → mustard → sunflower → black sesame). Uses each product’s Payload gallery / ImageKit image.',
              },
            },
          ],
        },
      ],
    },
    {
      label: 'Testimonials',
      fields: [
        { name: 'testimonialsBandEnabled', type: 'checkbox', defaultValue: true, label: 'Show this section' },
        {
          name: 'testimonialsBand',
          type: 'group',
          fields: [
            { name: 'eyebrow', type: 'text', defaultValue: 'Letters from kitchens' },
            { name: 'headline', type: 'text', defaultValue: 'Trusted by 2,800+ kitchens' },
            {
              name: 'source',
              type: 'select',
              defaultValue: 'featured',
              options: [
                { label: 'Featured (Testimonials collection)', value: 'featured' },
                { label: 'Manual entries below', value: 'manual' },
              ],
            },
            { name: 'maxItems', type: 'number', defaultValue: 3, min: 1, max: 12 },
            {
              name: 'manualItems',
              type: 'array',
              admin: {
                condition: (_, siblingData) => siblingData?.source === 'manual',
              },
              fields: [
                { name: 'customerName', type: 'text', required: true },
                { name: 'customerLocation', type: 'text' },
                { name: 'photo', type: 'upload', relationTo: 'media', label: 'Portrait' },
                { name: 'initials', type: 'text' },
                { name: 'rating', type: 'number', defaultValue: 5, min: 1, max: 5 },
                { name: 'title', type: 'text' },
                { name: 'body', type: 'textarea', required: true },
              ],
            },
          ],
        },
      ],
    },
    {
      label: 'Journal cards',
      fields: [
        { name: 'journalEnabled', type: 'checkbox', defaultValue: true, label: 'Show this section' },
        {
          name: 'journal',
          type: 'group',
          fields: [
            { name: 'eyebrow', type: 'text', defaultValue: 'Journal' },
            { name: 'headlineLine1', type: 'text', defaultValue: 'Recipes, rituals, and' },
            { name: 'headlineLine2', type: 'text', defaultValue: "what we're reading." },
            {
              name: 'cta',
              type: 'group',
              fields: [
                { name: 'label', type: 'text', defaultValue: 'Read the journal' },
                { name: 'href', type: 'text', defaultValue: '/posts' },
              ],
            },
            {
              name: 'posts',
              type: 'array',
              minRows: 1,
              maxRows: 6,
              fields: [
                { name: 'tag', type: 'text', required: true },
                { name: 'title', type: 'text', required: true },
                { name: 'read', type: 'text', defaultValue: '6 min read' },
                { name: 'slug', type: 'text', required: true },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Card image',
                  admin: { description: 'Editorial photo for the journal card (falls back to gradient if empty)' },
                },
                { name: 'toneA', type: 'text', defaultValue: '#5A7B3E' },
                { name: 'toneB', type: 'text', defaultValue: '#2E4222' },
              ],
            },
          ],
        },
      ],
    },
    {
      label: 'Newsletter',
      fields: [
        { name: 'newsletterEnabled', type: 'checkbox', defaultValue: true, label: 'Show this section' },
        {
          name: 'newsletter',
          type: 'group',
          fields: [
            { name: 'eyebrow', type: 'text', defaultValue: 'The Wood-Press Diary' },
            { name: 'headlineLine1', type: 'text', defaultValue: 'A short letter,' },
            { name: 'headlineLine2Italic', type: 'text', defaultValue: 'once a fortnight.' },
            {
              name: 'body',
              type: 'textarea',
              defaultValue:
                "Press updates from Erode, the occasional recipe from our test kitchen, and ten percent off your next bottle.",
            },
            { name: 'legalText', type: 'text', defaultValue: 'We will not sell your address. Unsubscribe in one click.' },
            { name: 'buttonLabel', type: 'text', defaultValue: 'Subscribe' },
          ],
        },
      ],
    },
    {
      label: 'FAQ',
      fields: [
        { name: 'faqEnabled', type: 'checkbox', defaultValue: true, label: 'Show this section' },
        {
          name: 'faq',
          type: 'group',
          fields: [
            { name: 'eyebrow', type: 'text', defaultValue: 'Frequently asked' },
            { name: 'headlinePrefix', type: 'text', defaultValue: 'Short, honest' },
            { name: 'headlineItalic', type: 'text', defaultValue: 'answers.' },
            {
              name: 'style',
              type: 'select',
              defaultValue: 'light',
              options: [
                { label: 'Light', value: 'light' },
                { label: 'Dark', value: 'dark' },
              ],
            },
            {
              name: 'items',
              type: 'array',
              minRows: 1,
              fields: [
                { name: 'question', type: 'text', required: true },
                { name: 'answer', type: 'textarea', required: true },
              ],
            },
            {
              name: 'backgroundImage',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Optional muted background photo behind the FAQ.' },
            },
          ],
        },
      ],
    },
  ],
}
