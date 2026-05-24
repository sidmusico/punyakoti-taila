import type { Block } from 'payload'

export const FAQSection: Block = {
  slug: 'ptFAQSection',
  labels: { singular: 'FAQ Section', plural: 'FAQ Sections' },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow label',
      defaultValue: 'Frequently asked',
    },
    {
      name: 'headline',
      type: 'text',
      label: 'Section headline',
      defaultValue: 'Questions & answers',
    },
    {
      name: 'items',
      type: 'array',
      label: 'FAQ items',
      minRows: 1,
      fields: [
        { name: 'question', type: 'text',     required: true, label: 'Question' },
        { name: 'answer',   type: 'textarea', required: true, label: 'Answer' },
      ],
    },
    {
      name: 'style',
      type: 'select',
      label: 'Section style',
      defaultValue: 'light',
      options: [
        { label: 'Light (cream bg)',      value: 'light' },
        { label: 'Dark (dark-green bg)',  value: 'dark' },
      ],
    },
  ],
}
