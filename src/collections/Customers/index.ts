import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

/**
 * Storefront shoppers synced from Supabase Auth.
 * Created/updated server-side via `ensureCustomer()` — not via public API.
 */
export const Customers: CollectionConfig = {
  slug: 'customers',
  access: {
    admin: authenticated,
    create: () => false,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'phone', 'supabaseUserId', 'updatedAt'],
    description: 'Storefront accounts (synced from Supabase Auth).',
  },
  fields: [
    {
      name: 'supabaseUserId',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'Supabase user ID',
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'name',
      type: 'text',
      label: 'Full name',
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Phone (E.164)',
      admin: { description: 'e.g. +919876543210' },
    },
    {
      name: 'avatarUrl',
      type: 'text',
      label: 'Avatar URL',
      admin: { readOnly: true },
    },
    {
      name: 'authProvider',
      type: 'select',
      label: 'Last sign-in method',
      options: [
        { label: 'Phone OTP', value: 'phone' },
        { label: 'Google', value: 'google' },
        { label: 'Email', value: 'email' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'lastSignInAt',
      type: 'date',
      admin: { readOnly: true, position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } },
    },

    // ── Address book ────────────────────────────────────────────
    // Managed by the storefront via /api/account/addresses. Exactly one
    // row should carry isDefaultShipping and one isDefaultBilling; the API
    // normalizes this on every write.
    {
      name: 'addresses',
      type: 'array',
      label: 'Saved addresses',
      labels: { singular: 'Address', plural: 'Addresses' },
      admin: {
        description: 'Shipping / billing address book. Edited by the customer from their account.',
        initCollapsed: true,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Nickname',
              admin: { description: 'e.g. Home, Work', width: '50%' },
            },
            { name: 'country', type: 'text', label: 'Country', defaultValue: 'India', admin: { width: '50%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'fullName', type: 'text', required: true, label: 'Full name', admin: { width: '50%' } },
            { name: 'phone', type: 'text', label: 'Phone', admin: { width: '50%' } },
          ],
        },
        { name: 'line1', type: 'text', required: true, label: 'Address line 1' },
        { name: 'line2', type: 'text', label: 'Address line 2' },
        { name: 'landmark', type: 'text', label: 'Landmark' },
        {
          type: 'row',
          fields: [
            { name: 'city', type: 'text', required: true, admin: { width: '40%' } },
            { name: 'state', type: 'text', required: true, admin: { width: '35%' } },
            { name: 'pincode', type: 'text', required: true, admin: { width: '25%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'isDefaultShipping',
              type: 'checkbox',
              label: 'Default shipping address',
              defaultValue: false,
              admin: { width: '50%' },
            },
            {
              name: 'isDefaultBilling',
              type: 'checkbox',
              label: 'Default billing address',
              defaultValue: false,
              admin: { width: '50%' },
            },
          ],
        },
      ],
    },
  ],
  timestamps: true,
}
