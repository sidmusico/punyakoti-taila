import type { Block } from 'payload'

export const BenefitCards: Block = {
  slug: 'ptBenefitCards',
  labels: { singular: 'Benefit Cards', plural: 'Benefit Cards' },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow label',
      defaultValue: 'Why it matters',
    },
    {
      name: 'headline',
      type: 'text',
      label: 'Section headline',
    },
    {
      name: 'headlineItalic',
      type: 'text',
      label: 'Italic portion of headline',
      admin: { description: 'Must be an exact substring of Headline above' },
    },
    {
      name: 'cards',
      type: 'array',
      label: 'Benefit cards',
      minRows: 1,
      maxRows: 6,
      fields: [
        {
          name: 'icon',
          type: 'select',
          required: true,
          options: [
            { label: 'Leaf', value: 'leaf' },
            { label: 'Drop', value: 'drop' },
            { label: 'Shield', value: 'shield' },
            { label: 'Star', value: 'star' },
            { label: 'Check', value: 'check' },
          ],
        },
        { name: 'title', type: 'text', required: true, label: 'Card title' },
        { name: 'body', type: 'textarea', required: true, label: 'Card body' },
      ],
    },
  ],
}
