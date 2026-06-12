import type { CollectionConfig } from 'payload'
import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'customerName',
    defaultColumns: ['customerName', 'rating', 'status', 'createdAt'],
  },
  fields: [
    {
      name: 'customerName',
      type: 'text',
      required: true,
      label: 'Customer name',
    },
    {
      name: 'customerLocation',
      type: 'text',
      label: 'City / Location',
      admin: { description: 'e.g. "Bangalore · Sesame · 6 orders"' },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Customer photo',
      admin: { description: 'Portrait shown on the homepage testimonial card' },
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
      defaultValue: 5,
      label: 'Rating (1–5)',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Review headline',
      admin: { description: 'Short compelling title for the review card' },
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
      label: 'Review body',
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      label: 'Product reviewed',
    },
    {
      name: 'verifiedPurchase',
      type: 'checkbox',
      defaultValue: true,
      label: 'Verified purchase',
    },
    {
      name: 'featuredOnHome',
      type: 'checkbox',
      defaultValue: false,
      label: 'Show on homepage',
      admin: { position: 'sidebar', description: 'Include in homepage testimonials carousel' },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending review', value: 'pending' },
        { label: 'Approved',       value: 'approved' },
        { label: 'Rejected',       value: 'rejected' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
  timestamps: true,
}
