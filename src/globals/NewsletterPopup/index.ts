import type { GlobalConfig } from 'payload'

import { revalidateGlobalSlug } from '@/globals/hooks/revalidateGlobalSlug'

const SLUG = 'newsletter-popup'

/**
 * Site-wide newsletter modal. Every visible string, the imagery, and the
 * show/snooze behaviour are editable here; the component falls back to the
 * same defaults when a field is left empty.
 */
export const NewsletterPopup: GlobalConfig = {
  slug: SLUG,
  label: 'Newsletter popup',
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobalSlug(SLUG)] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Behaviour',
          fields: [
            {
              name: 'enabled',
              type: 'checkbox',
              defaultValue: true,
              admin: { description: 'Master switch — untick to hide the popup everywhere.' },
            },
            {
              name: 'delaySeconds',
              type: 'number',
              defaultValue: 6,
              min: 0,
              admin: { description: 'Seconds after page load before the popup appears.' },
            },
            {
              name: 'snoozeDays',
              type: 'number',
              defaultValue: 7,
              min: 0,
              admin: { description: 'Days to wait before showing again after a visitor dismisses it. Subscribers never see it again.' },
            },
          ],
        },
        {
          label: 'Left panel',
          fields: [
            {
              name: 'panel',
              type: 'group',
              fields: [
                { name: 'kickerLine', type: 'text', defaultValue: 'Punyakoti Taila' },
                { name: 'title', type: 'text', defaultValue: 'Goodness, bottled.' },
                {
                  name: 'titleItalic',
                  type: 'text',
                  defaultValue: 'bottled.',
                  admin: { description: 'Part of the title rendered in italic mustard.' },
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  admin: { description: 'Optional photo. When empty, the illustrated bottle is shown.' },
                },
                {
                  name: 'bottleVariant',
                  type: 'select',
                  defaultValue: 'sesame',
                  options: [
                    { label: 'Sesame', value: 'sesame' },
                    { label: 'Coconut', value: 'coconut' },
                    { label: 'Groundnut', value: 'groundnut' },
                    { label: 'Mustard', value: 'mustard' },
                    { label: 'Sunflower', value: 'sunflower' },
                    { label: 'Black Sesame', value: 'blackSes' },
                    { label: 'Castor', value: 'castor' },
                  ],
                  admin: { description: 'Bottle illustration used when no photo is set.' },
                },
                { name: 'footerLeft', type: 'text', defaultValue: 'Pure tradition' },
                { name: 'footerRight', type: 'text', defaultValue: 'Pure goodness' },
              ],
            },
          ],
        },
        {
          label: 'Content',
          fields: [
            {
              name: 'content',
              type: 'group',
              fields: [
                { name: 'eyebrow', type: 'text', defaultValue: 'Join the family' },
                { name: 'headlinePre', type: 'text', defaultValue: 'Fifteen' },
                {
                  name: 'headlineItalic',
                  type: 'text',
                  defaultValue: 'percent off,',
                  admin: { description: 'Rendered in italic mustard.' },
                },
                { name: 'headlinePost', type: 'text', defaultValue: 'your first order.' },
                {
                  name: 'body',
                  type: 'textarea',
                  defaultValue:
                    'A short newsletter with member-only offers, new arrivals, and simple recipes — plus a 15% discount code for your first order.',
                },
                {
                  name: 'bullets',
                  type: 'array',
                  maxRows: 4,
                  defaultValue: [
                    { icon: 'star', text: 'Member-only offers & early access' },
                    { icon: 'mail', text: 'One short email a fortnight — no spam' },
                    { icon: 'shield', text: 'Unsubscribe anytime, in one click' },
                  ],
                  fields: [
                    {
                      name: 'icon',
                      type: 'select',
                      defaultValue: 'leaf',
                      options: ['leaf', 'mail', 'shield', 'check', 'drop', 'star'].map((v) => ({ label: v, value: v })),
                    },
                    { name: 'text', type: 'text', required: true },
                  ],
                },
                { name: 'emailLabel', type: 'text', defaultValue: 'Email' },
                { name: 'emailPlaceholder', type: 'text', defaultValue: 'your@kitchen.in' },
                { name: 'ctaLabel', type: 'text', defaultValue: 'Get my code' },
                { name: 'privacyPrefix', type: 'text', defaultValue: 'By subscribing you agree to our' },
                { name: 'privacyLinkLabel', type: 'text', defaultValue: 'privacy policy' },
                { name: 'privacyHref', type: 'text', defaultValue: '/privacy' },
                { name: 'privacySuffix', type: 'text', defaultValue: "We won't sell your address." },
                { name: 'dismissLabel', type: 'text', defaultValue: 'No thanks, keep shopping' },
                { name: 'successTitle', type: 'text', defaultValue: 'Check your inbox.' },
                {
                  name: 'successBody',
                  type: 'text',
                  defaultValue: 'Your code is on its way to {email}.',
                  admin: { description: 'Use {email} to interpolate the subscribed address.' },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
