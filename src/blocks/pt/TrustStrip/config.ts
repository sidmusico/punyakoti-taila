import type { Block } from 'payload'

export const TrustStrip: Block = {
  slug: 'ptTrustStrip',
  labels: { singular: 'Trust Strip', plural: 'Trust Strips' },
  fields: [
    {
      name: 'items',
      type: 'array',
      label: 'Trust items (4 recommended)',
      minRows: 1,
      maxRows: 6,
      fields: [
        {
          name: 'icon',
          type: 'select',
          required: true,
          options: [
            { label: 'Leaf',   value: 'leaf' },
            { label: 'Drop',   value: 'drop' },
            { label: 'Truck',  value: 'truck' },
            { label: 'Shield', value: 'shield' },
            { label: 'Star',   value: 'star' },
            { label: 'Check',  value: 'check' },
          ],
        },
        { name: 'label', type: 'text', required: true, label: 'Trust item label' },
        { name: 'sub',   type: 'text', label: 'Sub-text description' },
      ],
    },
  ],
}
