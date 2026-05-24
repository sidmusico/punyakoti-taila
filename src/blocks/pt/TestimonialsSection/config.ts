import type { Block } from 'payload'

export const TestimonialsSection: Block = {
  slug: 'ptTestimonialsSection',
  labels: { singular: 'Testimonials Section', plural: 'Testimonials Sections' },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow label',
      defaultValue: 'What customers say',
    },
    {
      name: 'headline',
      type: 'text',
      label: 'Section headline',
      defaultValue: 'Trusted by 2,800+ kitchens',
    },
    {
      name: 'source',
      type: 'select',
      label: 'Data source',
      defaultValue: 'featured',
      options: [
        { label: 'Featured (from Testimonials collection)', value: 'featured' },
        { label: 'Manual (enter below)',                    value: 'manual' },
      ],
    },
    {
      name: 'manualItems',
      type: 'array',
      label: 'Manual testimonials',
      admin: {
        condition: (data, siblingData) => siblingData?.source === 'manual',
        description: 'Only used when source is set to "Manual"',
      },
      fields: [
        { name: 'customerName',     type: 'text', required: true },
        { name: 'customerLocation', type: 'text' },
        { name: 'rating',           type: 'number', min: 1, max: 5, defaultValue: 5 },
        { name: 'title',            type: 'text' },
        { name: 'body',             type: 'textarea', required: true },
      ],
    },
    {
      name: 'maxItems',
      type: 'number',
      label: 'Max items to show',
      defaultValue: 3,
      min: 1,
      max: 12,
    },
  ],
}
