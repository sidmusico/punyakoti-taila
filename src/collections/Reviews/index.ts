import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  access: {
    create: anyone,       // public submit
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'product', 'rating', 'status', 'createdAt'],
  },
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
      admin: { position: 'sidebar' },
    },
    {
      name: 'customerName',
      type: 'text',
      required: true,
    },
    {
      name: 'customerLocation',
      type: 'text',
      admin: { description: 'e.g. Mumbai, Maharashtra' },
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
      admin: { step: 1 },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Review headline',
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
      label: 'Review body',
    },
    {
      name: 'verifiedPurchase',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Pending',   value: 'pending'   },
        { label: 'Approved',  value: 'approved'  },
        { label: 'Rejected',  value: 'rejected'  },
      ],
    },
    {
      name: 'images',
      type: 'array',
      label: 'Customer photos',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
  ],
  timestamps: true,
}
