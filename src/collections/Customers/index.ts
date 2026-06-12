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
  ],
  timestamps: true,
}
