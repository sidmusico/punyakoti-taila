import type { Field } from 'payload'

import type { EmailTemplateBlock } from '@/seed/emailTemplatesSeedDefaults'

function templateFields(defaults: EmailTemplateBlock, showOrderBlocks = true): Field[] {
  const fields: Field[] = [
    {
      name: 'enabled',
      type: 'checkbox',
      label: 'Send this email',
      defaultValue: defaults.enabled ?? true,
    },
    {
      name: 'subject',
      type: 'text',
      required: true,
      defaultValue: defaults.subject,
      admin: { description: 'Supports merge tags (see tab description).' },
    },
    {
      name: 'headline',
      type: 'text',
      defaultValue: defaults.headline,
    },
    {
      name: 'body',
      type: 'textarea',
      defaultValue: defaults.body,
      admin: { rows: 6 },
    },
  ]
  if (showOrderBlocks) {
    fields.push(
      {
        name: 'includeLineItems',
        type: 'checkbox',
        label: 'Include product line items (with thumbnails)',
        defaultValue: defaults.includeLineItems ?? true,
      },
      {
        name: 'includeTotals',
        type: 'checkbox',
        label: 'Include order totals',
        defaultValue: defaults.includeTotals ?? false,
      },
      {
        name: 'includeShippingAddress',
        type: 'checkbox',
        label: 'Include shipping address',
        defaultValue: defaults.includeShippingAddress ?? true,
      },
    )
  }
  return fields
}

export function buildEmailTemplateFields(
  defaults: typeof import('@/seed/emailTemplatesSeedDefaults').emailTemplatesSeedDefaults,
): Field[] {
  return [
    {
      name: 'mergeTagsHelp',
      type: 'textarea',
      label: 'Merge tags reference',
      defaultValue: defaults.mergeTagsHelp,
      admin: { readOnly: true, rows: 3 },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Order — confirmed',
          fields: [{ name: 'orderConfirmed', type: 'group', label: false, fields: templateFields(defaults.orderConfirmed) }],
        },
        {
          label: 'Order — packed',
          fields: [{ name: 'orderPacked', type: 'group', label: false, fields: templateFields(defaults.orderPacked) }],
        },
        {
          label: 'Order — shipped',
          fields: [{ name: 'orderShipped', type: 'group', label: false, fields: templateFields(defaults.orderShipped) }],
        },
        {
          label: 'Out for delivery',
          fields: [
            { name: 'orderOutForDelivery', type: 'group', label: false, fields: templateFields(defaults.orderOutForDelivery) },
          ],
        },
        {
          label: 'Delivered',
          fields: [{ name: 'orderDelivered', type: 'group', label: false, fields: templateFields(defaults.orderDelivered) }],
        },
        {
          label: 'Cancelled',
          fields: [{ name: 'orderCancelled', type: 'group', label: false, fields: templateFields(defaults.orderCancelled) }],
        },
        {
          label: 'Returned',
          fields: [{ name: 'orderReturned', type: 'group', label: false, fields: templateFields(defaults.orderReturned) }],
        },
        {
          label: 'Refunded',
          fields: [{ name: 'orderRefunded', type: 'group', label: false, fields: templateFields(defaults.orderRefunded) }],
        },
        {
          label: 'Welcome',
          fields: [
            {
              name: 'welcome',
              type: 'group',
              label: false,
              fields: templateFields(defaults.welcome, false),
            },
          ],
        },
        {
          label: 'OTP / magic link',
          description: 'Used when Supabase Auth send-email hook is enabled (see doc/AUTH.md).',
          fields: [
            {
              name: 'otpEmail',
              type: 'group',
              label: false,
              fields: templateFields(defaults.otpEmail, false),
            },
          ],
        },
        {
          label: 'Signup confirm',
          fields: [
            {
              name: 'signupConfirmation',
              type: 'group',
              label: false,
              fields: templateFields(defaults.signupConfirmation, false),
            },
          ],
        },
      ],
    },
  ]
}
