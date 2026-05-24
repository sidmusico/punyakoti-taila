import type { GlobalConfig } from 'payload'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Header',
  access: { read: () => true },
  hooks: { afterChange: [revalidateHeader] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // ── Tab 1: Announcement Bar ───────────────────────────────────
        {
          label: 'Announcement Bar',
          description: 'The slim banner shown above the header',
          fields: [
            {
              name: 'announcementBar',
              type: 'group',
              label: ' ',
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
                  label: 'Announcement text',
                  admin: { description: 'Full bar text' },
                },
                {
                  name: 'highlight',
                  type: 'text',
                  defaultValue: '₹999',
                  label: 'Highlighted word',
                  admin: { description: 'This exact substring will be shown in mustard gold — must appear in the text above' },
                },
                {
                  name: 'link',
                  type: 'text',
                  label: 'Optional link URL',
                  admin: { description: 'If set, the bar becomes a clickable link' },
                },
              ],
            },
          ],
        },

        // ── Tab 2: Navigation ─────────────────────────────────────────
        {
          label: 'Navigation',
          description: 'Desktop + mobile menu links',
          fields: [
            {
              name: 'navLinks',
              type: 'array',
              label: 'Navigation links',
              defaultValue: [
                { label: 'Oils',      href: '/shop' },
                { label: 'Wellness',  href: '/shop?category=wellness' },
                { label: 'Gift sets', href: '/shop?category=gift-sets' },
                { label: 'Our story', href: '/about' },
                { label: 'Journal',   href: '/journal' },
              ],
              admin: {
                description: 'Order determines display order. Maximum 7 items recommended.',
              },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  label: 'Link label',
                },
                {
                  name: 'href',
                  type: 'text',
                  required: true,
                  label: 'URL / path',
                  admin: { description: 'e.g. /shop or /shop?category=wellness' },
                },
                {
                  name: 'openInNewTab',
                  type: 'checkbox',
                  defaultValue: false,
                  label: 'Open in new tab',
                },
              ],
            },
          ],
        },

        // ── Tab 3: Logo & Brand ───────────────────────────────────────
        {
          label: 'Logo & Brand',
          description: 'Brand identity shown in header',
          fields: [
            {
              name: 'logoText',
              type: 'text',
              defaultValue: 'Punyakoti·',
              label: 'Brand name (wordmark)',
              admin: { description: 'Display name in the header wordmark' },
            },
            {
              name: 'logoTagline',
              type: 'text',
              defaultValue: 'T A I L A',
              label: 'Wordmark sub-text',
            },
            {
              name: 'logoImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Logo image (optional)',
              admin: { description: 'If set, shows image instead of wordmark text' },
            },
          ],
        },
      ],
    },
  ],
}
