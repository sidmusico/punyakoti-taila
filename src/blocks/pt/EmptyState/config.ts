import type { Block } from 'payload'

export const EmptyState: Block = {
  slug: 'ptEmptyState',
  labels: { singular: 'Empty State / Placeholder', plural: 'Empty States' },
  fields: [
    {
      name: 'icon',
      type: 'select',
      label: 'Icon',
      defaultValue: 'drop',
      options: [
        { label: 'Drop',      value: 'drop' },
        { label: 'Leaf',      value: 'leaf' },
        { label: 'Cart',      value: 'cart' },
        { label: 'User',      value: 'user' },
        { label: 'Package',   value: 'package' },
        { label: 'Search',    value: 'search' },
        { label: 'Shield',    value: 'shield' },
      ],
    },
    {
      name: 'headline',
      type: 'text',
      required: true,
      label: 'Headline',
    },
    {
      name: 'body',
      type: 'textarea',
      label: 'Body text',
    },
    {
      name: 'ctaLabel',
      type: 'text',
      label: 'CTA button label',
    },
    {
      name: 'ctaHref',
      type: 'text',
      label: 'CTA button URL',
    },
    {
      name: 'note',
      type: 'text',
      label: 'Admin note',
      admin: { description: 'Describe what this page section is for (admin only reference)' },
    },
  ],
}
