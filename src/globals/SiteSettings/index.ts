import type { GlobalConfig } from 'payload'
import { revalidateSiteSettings } from './hooks/revalidateSiteSettings'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: { read: () => true },
  hooks: { afterChange: [revalidateSiteSettings] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Announcement',
          description: 'Top bar promo line',
          fields: [
            {
              name: 'announcementBar',
              type: 'group',
              label: 'Announcement Bar',
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  defaultValue: true,
                  label: 'Show announcement bar',
                },
                {
                  name: 'text',
                  type: 'text',
                  defaultValue: 'Free shipping on orders over ₹999 · Single-origin · Pressed weekly',
                  admin: { description: 'Main announcement text' },
                },
                {
                  name: 'highlight',
                  type: 'text',
                  defaultValue: '₹999',
                  admin: { description: 'Text to highlight in mustard colour (must match text above)' },
                },
              ],
            },
          ],
        },
        {
          label: 'Shipping',
          fields: [
            {
              name: 'freeShippingThreshold',
              type: 'number',
              defaultValue: 999,
              label: 'Free shipping threshold (₹)',
              admin: { description: 'Used by cart drawer progress and checkout copy.' },
            },
          ],
        },
        {
          label: 'Contact & social',
          fields: [
            {
              name: 'contact',
              type: 'group',
              label: 'Contact Details',
              fields: [
                {
                  name: 'address',
                  type: 'textarea',
                  defaultValue: 'Near Mahaveer Bhavan, Ankali Road, Raibag – 591317, Karnataka',
                },
                {
                  name: 'phone',
                  type: 'text',
                  defaultValue: '+91 89047 38151',
                },
                {
                  name: 'email',
                  type: 'email',
                  defaultValue: 'hello@punyakoitaila.com',
                },
              ],
            },
            {
              name: 'social',
              type: 'group',
              label: 'Social Media',
              fields: [
                { name: 'instagram', type: 'text', label: 'Instagram URL' },
                { name: 'facebook', type: 'text', label: 'Facebook URL' },
                { name: 'youtube', type: 'text', label: 'YouTube URL' },
                { name: 'twitter', type: 'text', label: 'X / Twitter URL' },
              ],
            },
          ],
        },
        {
          label: 'Footer',
          description: 'Tagline and link columns',
          fields: [
            {
              name: 'footerTagline',
              type: 'text',
              defaultValue:
                'Wood-pressed oils from Raibag, Karnataka. Pressed slowly, bottled with care.',
              label: 'Footer tagline',
            },
            {
              name: 'shopLinks',
              type: 'array',
              label: 'Footer — Shop column',
              defaultValue: [
                { label: 'All Oils', href: '/shop' },
                { label: 'Cooking Oils', href: '/shop?category=cooking-oils' },
                { label: 'Wellness', href: '/shop?category=wellness' },
                { label: 'Gift Sets', href: '/shop?category=gift-sets' },
              ],
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'href', type: 'text', required: true },
              ],
            },
            {
              name: 'companyLinks',
              type: 'array',
              label: 'Footer — Company column',
              defaultValue: [
                { label: 'Our Story', href: '/about' },
                { label: 'Journal', href: '/journal' },
                { label: 'Sustainability', href: '/sustainability' },
                { label: 'Wholesale', href: '/wholesale' },
              ],
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'href', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          label: 'Header',
          description: 'Primary navigation',
          fields: [
            {
              name: 'navLinks',
              type: 'array',
              label: 'Header Navigation',
              defaultValue: [
                { label: 'Oils', href: '/shop' },
                { label: 'Wellness', href: '/shop?category=wellness' },
                { label: 'Gift sets', href: '/shop?category=gift-sets' },
                { label: 'Our story', href: '/about' },
                { label: 'Journal', href: '/journal' },
              ],
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'href', type: 'text', required: true },
              ],
            },
          ],
        },
      ],
    },
  ],
}
