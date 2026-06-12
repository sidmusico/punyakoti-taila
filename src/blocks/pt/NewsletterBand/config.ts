import type { Block } from 'payload'

export const NewsletterBand: Block = {
  slug: 'ptNewsletterBand',
  labels: { singular: 'Newsletter Band', plural: 'Newsletter Bands' },
  fields: [
    {
      name: 'headline',
      type: 'text',
      label: 'Headline',
      defaultValue: 'Stay in the loop',
    },
    {
      name: 'body',
      type: 'textarea',
      label: 'Body text',
      defaultValue:
        "New batches every week. Subscribe and we'll let you know the moment fresh oil is ready — before it sells out.",
    },
    {
      name: 'legalText',
      type: 'text',
      label: 'Legal / disclaimer text',
      defaultValue: 'One email per batch. No spam. Unsubscribe anytime.',
    },
    {
      name: 'buttonLabel',
      type: 'text',
      label: 'Subscribe button label',
      defaultValue: 'Subscribe',
    },
    {
      name: 'style',
      type: 'select',
      label: 'Background style',
      defaultValue: 'dark-green',
      options: [
        { label: 'Dark green', value: 'dark-green' },
        { label: 'Cream', value: 'cream' },
        { label: 'Mustard', value: 'mustard' },
      ],
    },
  ],
}
