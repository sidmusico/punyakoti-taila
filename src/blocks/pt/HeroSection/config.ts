import type { Block } from 'payload'

export const HeroSection: Block = {
  slug: 'ptHeroSection',
  labels: { singular: 'Hero Section', plural: 'Hero Sections' },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow label (small caps)',
    },
    {
      name: 'headlineLine1',
      type: 'text',
      label: 'Headline — line 1',
    },
    {
      name: 'headlineLine2',
      type: 'text',
      label: 'Headline — line 2',
    },
    {
      name: 'headlineItalicWord',
      type: 'text',
      label: 'Italic / highlighted word in line 2',
      admin: { description: 'Must match a word in line 2 exactly — shown in italic mustard gold' },
    },
    {
      name: 'body',
      type: 'textarea',
      label: 'Body paragraph',
    },
    {
      name: 'primaryCTA',
      type: 'group',
      label: 'Primary button',
      fields: [
        { name: 'label', type: 'text', defaultValue: 'Shop the collection' },
        { name: 'href',  type: 'text', defaultValue: '/shop' },
      ],
    },
    {
      name: 'secondaryCTA',
      type: 'group',
      label: 'Secondary button',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'href',  type: 'text' },
      ],
    },
    {
      name: 'reviewRating',
      type: 'text',
      label: 'Review rating (e.g. "4.9 / 5")',
    },
    {
      name: 'reviewCount',
      type: 'text',
      label: 'Review count label',
    },
    {
      name: 'backgroundStyle',
      type: 'select',
      label: 'Background style',
      defaultValue: 'cream',
      options: [
        { label: 'Cream (default)',   value: 'cream' },
        { label: 'Dark Green',        value: 'dark-green' },
        { label: 'Warm White',        value: 'warm-white' },
      ],
    },
  ],
}
