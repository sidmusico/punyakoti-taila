import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'

export const Products: CollectionConfig = {
  slug: 'products',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'status', 'updatedAt'],
  },
  fields: [
    // ── Basic info ──────────────────────────────────────────────
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'oilVariant',
      type: 'select',
      label: 'Oil variant (bottle illustration)',
      admin: {
        position: 'sidebar',
        description: 'Controls which SVG bottle is shown in the UI',
      },
      options: [
        { label: 'Sesame', value: 'sesame' },
        { label: 'Coconut', value: 'coconut' },
        { label: 'Groundnut', value: 'groundnut' },
        { label: 'Mustard', value: 'mustard' },
        { label: 'Sunflower', value: 'sunflower' },
        { label: 'Black Sesame', value: 'blackSes' },
        { label: 'Castor', value: 'castor' },
      ],
    },
    {
      name: 'tag',
      type: 'text',
      label: 'Product tag / badge',
      admin: {
        position: 'sidebar',
        description: 'Optional badge shown on card (e.g. "Best seller", "Limited")',
      },
    },
    {
      name: 'categoryType',
      type: 'select',
      label: 'Category type (for filtering)',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Cooking', value: 'cooking' },
        { label: 'Wellness', value: 'wellness' },
        { label: 'Gift Sets', value: 'gift-sets' },
        { label: 'Subscription', value: 'subscription' },
      ],
    },
    {
      name: 'useCases',
      type: 'select',
      hasMany: true,
      label: 'Use cases',
      admin: { description: 'Powers the PLP "Use" filter.' },
      options: [
        { label: 'Daily cooking', value: 'daily-cooking' },
        { label: 'Tempering', value: 'tempering' },
        { label: 'Salad', value: 'salad' },
        { label: 'Hair & body', value: 'hair-body' },
        { label: 'Ayurvedic', value: 'ayurvedic' },
      ],
    },
    {
      name: 'certifications',
      type: 'select',
      hasMany: true,
      label: 'Certifications',
      admin: { description: 'Powers the PLP "Certifications" filter.' },
      options: [
        { label: 'USDA Organic', value: 'usda-organic' },
        { label: 'India Organic', value: 'india-organic' },
        { label: 'Single-origin', value: 'single-origin' },
      ],
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'URL-friendly identifier (auto-fill from name)',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) =>
            value ||
            (data?.name as string)
              ?.toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-|-$/g, ''),
        ],
      },
    },
    {
      name: 'tagline',
      type: 'text',
      admin: { description: 'Short sentence shown on cards' },
    },
    {
      name: 'ratingDisplay',
      type: 'text',
      label: 'Rating line (e.g. 4.9)',
      admin: { description: 'Optional — overrides PDP global default for this product.' },
    },
    {
      name: 'reviewsDisplay',
      type: 'text',
      label: 'Reviews line (e.g. 612 reviews)',
      admin: { description: 'Optional — overrides PDP global default for this product.' },
    },
    {
      name: 'ratingStars',
      type: 'number',
      label: 'Filled stars (1–5)',
      min: 1,
      max: 5,
      admin: { description: 'Optional — overrides PDP global star count for this product.' },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'richDescription',
      type: 'richText',
      label: 'Long description (PDP body)',
    },

    // ── Category & tags ─────────────────────────────────────────
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      admin: { position: 'sidebar' },
    },
    {
      name: 'tags',
      type: 'array',
      admin: { position: 'sidebar' },
      fields: [{ name: 'tag', type: 'text' }],
    },

    // ── Images ─────────────────────────────────────────────────
    {
      name: 'images',
      type: 'array',
      label: 'Product images',
      minRows: 1,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'alt',
          type: 'text',
        },
      ],
    },

    // ── Variants (size / price) ─────────────────────────────────
    {
      name: 'variants',
      type: 'array',
      label: 'Size variants',
      minRows: 1,
      fields: [
        {
          name: 'size',
          type: 'select',
          options: [
            { label: '250 ml', value: '250ml' },
            { label: '500 ml', value: '500ml' },
            { label: '1 L',    value: '1L'    },
            { label: '5 L',    value: '5L'    },
          ],
          required: true,
        },
        {
          name: 'sku',
          type: 'text',
          required: true,
        },
        {
          name: 'price',
          type: 'number',
          required: true,
          min: 0,
          admin: { step: 0.01, description: 'Price in INR (₹)' },
        },
        {
          name: 'mrp',
          type: 'number',
          min: 0,
          admin: { step: 0.01, description: 'Maximum retail price (for strike-through)' },
        },
        {
          name: 'subscribePrice',
          type: 'number',
          min: 0,
          admin: { step: 0.01, description: 'Subscribe & save price' },
        },
        {
          name: 'stock',
          type: 'number',
          defaultValue: 0,
          min: 0,
        },
        {
          name: 'isDefault',
          type: 'checkbox',
          defaultValue: false,
          label: 'Default variant',
        },
      ],
    },

    // ── Batch / provenance ──────────────────────────────────────
    {
      name: 'batch',
      type: 'group',
      label: 'Batch & provenance',
      fields: [
        {
          name: 'batchNumber',
          type: 'text',
          label: 'Batch #',
        },
        {
          name: 'pressDate',
          type: 'date',
          label: 'Press date',
        },
        {
          name: 'bestBefore',
          type: 'date',
          label: 'Best before',
        },
        {
          name: 'pressTemperature',
          type: 'text',
          label: 'Press temperature',
          admin: { description: 'e.g. < 40°C' },
        },
        {
          name: 'yield',
          type: 'text',
          label: 'Oil yield',
          admin: { description: 'e.g. 32% (cold-press standard)' },
        },
        {
          name: 'farmLocation',
          type: 'text',
          label: 'Farm / origin location',
          admin: { description: 'e.g. Erode, Tamil Nadu' },
        },
        {
          name: 'labReportUrl',
          type: 'text',
          label: 'Lab report URL',
        },
      ],
    },

    // ── Health & nutrition ──────────────────────────────────────
    {
      name: 'benefits',
      type: 'array',
      label: 'Health benefits',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        {
          name: 'icon',
          type: 'select',
          options: [
            { label: 'Leaf', value: 'leaf' },
            { label: 'Drop', value: 'drop' },
            { label: 'Shield', value: 'shield' },
            { label: 'Star', value: 'star' },
            { label: 'Heart', value: 'heart' },
          ],
        },
      ],
    },
    {
      name: 'usageNote',
      type: 'textarea',
      label: 'Usage / cooking note',
    },

    // ── SEO ─────────────────────────────────────────────────────
    {
      name: 'meta',
      type: 'group',
      label: 'SEO',
      admin: { position: 'sidebar' },
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },

    // ── Status ──────────────────────────────────────────────────
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Draft',     value: 'draft'     },
        { label: 'Published', value: 'published' },
        { label: 'Archived',  value: 'archived'  },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'bestSeller',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
  ],
  timestamps: true,
}
