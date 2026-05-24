import type { Block } from 'payload'

export const ProcessBanner: Block = {
  slug: 'ptProcessBanner',
  labels: { singular: 'Process Banner', plural: 'Process Banners' },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow label',
      defaultValue: 'How we press',
    },
    {
      name: 'headlineLine1',
      type: 'text',
      label: 'Headline — line 1',
      defaultValue: 'The ghani has turned',
    },
    {
      name: 'headlineLine2',
      type: 'text',
      label: 'Headline — line 2 (italic mustard)',
      defaultValue: 'for a thousand years.',
    },
    {
      name: 'body',
      type: 'textarea',
      label: 'Body paragraph',
    },
    {
      name: 'stats',
      type: 'array',
      label: 'Stats grid (2×2)',
      minRows: 0,
      maxRows: 4,
      fields: [
        { name: 'value', type: 'text', required: true, label: 'Stat value (e.g. "< 40°C")' },
        { name: 'label', type: 'text', required: true, label: 'Stat description' },
      ],
    },
    {
      name: 'ctaLabel',
      type: 'text',
      label: 'CTA label',
      defaultValue: 'Read our story',
    },
    {
      name: 'ctaHref',
      type: 'text',
      label: 'CTA URL',
      defaultValue: '/about',
    },
  ],
}
