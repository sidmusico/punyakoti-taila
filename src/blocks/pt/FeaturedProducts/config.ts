import type { Block } from 'payload'

export const FeaturedProducts: Block = {
  slug: 'ptFeaturedProducts',
  labels: { singular: 'Featured Products', plural: 'Featured Products' },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow label',
      defaultValue: 'The collection',
    },
    {
      name: 'headline',
      type: 'text',
      label: 'Section headline',
      defaultValue: 'Six oils, one philosophy',
    },
    {
      name: 'body',
      type: 'text',
      label: 'Section body',
    },
    {
      name: 'ctaLabel',
      type: 'text',
      label: 'CTA button label',
      defaultValue: 'Shop all',
    },
    {
      name: 'ctaHref',
      type: 'text',
      label: 'CTA button URL',
      defaultValue: '/shop',
    },
    {
      name: 'products',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      label: 'Featured products',
      admin: {
        description: 'Select up to 6 products to feature. Only published products appear on the site.',
      },
    },
    {
      name: 'columns',
      type: 'select',
      label: 'Grid columns',
      defaultValue: '3',
      options: [
        { label: '2 columns', value: '2' },
        { label: '3 columns', value: '3' },
        { label: '4 columns', value: '4' },
      ],
    },
  ],
}
