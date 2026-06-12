import type { GlobalConfig } from 'payload'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  access: { read: () => true },
  hooks: { afterChange: [revalidateFooter] },
  fields: [
    {
      type: 'tabs',
      tabs: [

        // ── Tab 1: Brand ──────────────────────────────────────────────
        {
          label: 'Brand',
          description: 'Left brand column — wordmark, tagline, locations, contact',
          fields: [
            {
              name: 'tagline',
              type: 'text',
              defaultValue: 'Wood-pressed oils, one batch at a time.',
              label: 'Brand tagline',
            },
            {
              name: 'locations',
              type: 'text',
              defaultValue: 'Bangalore · Erode · Kollam.',
              label: 'Locations line (shown below tagline)',
            },
            {
              name: 'contact',
              type: 'group',
              label: 'Contact details',
              fields: [
                { name: 'email',   type: 'email',    defaultValue: 'hello@punyakoitaila.com',   label: 'Email' },
                { name: 'phone',   type: 'text',     defaultValue: '+91 89047 38151',           label: 'Phone' },
                { name: 'address', type: 'textarea', defaultValue: 'Near Mahaveer Bhavan, Ankali Road, Raibag – 591317, Karnataka', label: 'Address' },
              ],
            },
          ],
        },

        // ── Tab 2: Shop column ────────────────────────────────────────
        {
          label: 'Shop',
          description: 'Second footer column',
          fields: [
            {
              name: 'shopColumnHeading',
              type: 'text',
              defaultValue: 'Shop',
              label: 'Column heading',
            },
            {
              name: 'shopLinks',
              type: 'array',
              label: 'Shop links',
              defaultValue: [
                { label: 'All oils',  href: '/shop' },
                { label: 'Sesame',    href: '/shop/wood-pressed-sesame-erode' },
                { label: 'Coconut',   href: '/shop/virgin-coconut-kollam' },
                { label: 'Groundnut', href: '/shop/groundnut-wood-pressed-karnataka' },
                { label: 'Mustard',   href: '/shop/kachi-ghani-mustard-alwar' },
                { label: 'Wellness',  href: '/shop?category=wellness' },
                { label: 'Gift sets', href: '/shop?category=gift-sets' },
              ],
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'href',  type: 'text', required: true },
              ],
            },
          ],
        },

        // ── Tab 3: Learn column ───────────────────────────────────────
        {
          label: 'Learn',
          description: 'Third footer column',
          fields: [
            {
              name: 'learnColumnHeading',
              type: 'text',
              defaultValue: 'Learn',
              label: 'Column heading',
            },
            {
              name: 'learnLinks',
              type: 'array',
              label: 'Learn links',
              defaultValue: [
                { label: 'Our story',      href: '/about' },
                { label: 'Journal',        href: '/journal' },
                { label: 'Recipes',        href: '/journal?tag=recipes' },
                { label: 'Sustainability', href: '/sustainability' },
              ],
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'href',  type: 'text', required: true },
              ],
            },
          ],
        },

        // ── Tab 4: Help column ────────────────────────────────────────
        {
          label: 'Help',
          description: 'Fourth footer column',
          fields: [
            {
              name: 'helpColumnHeading',
              type: 'text',
              defaultValue: 'Help',
              label: 'Column heading',
            },
            {
              name: 'helpLinks',
              type: 'array',
              label: 'Help links',
              defaultValue: [
                { label: 'Contact',        href: '/contact' },
                { label: 'Shipping & returns', href: '/returns' },
                { label: 'FAQ',            href: '/support' },
                { label: 'Order tracking', href: '/account?tab=orders' },
              ],
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'href',  type: 'text', required: true },
              ],
            },
          ],
        },

        // ── Tab 5: Legal column ───────────────────────────────────────
        {
          label: 'Legal',
          description: 'Fifth footer column',
          fields: [
            {
              name: 'legalColumnHeading',
              type: 'text',
              defaultValue: 'Legal',
              label: 'Column heading',
            },
            {
              name: 'legalLinks',
              type: 'array',
              label: 'Legal links',
              defaultValue: [
                { label: 'Privacy',       href: '/privacy' },
                { label: 'Terms',         href: '/terms' },
                { label: 'Refund policy', href: '/returns' },
                { label: 'B2B / bulk',    href: '/wholesale' },
              ],
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'href',  type: 'text', required: true },
              ],
            },
          ],
        },

        // ── Tab 6: Bottom Bar ─────────────────────────────────────────
        {
          label: 'Bottom Bar',
          description: 'Bottom bar — entity name, GSTIN, craft note, version badge',
          fields: [
            {
              name: 'legalEntityName',
              type: 'text',
              defaultValue: 'Punyakoti Foods Pvt. Ltd.',
              label: 'Legal entity name',
            },
            {
              name: 'gstin',
              type: 'text',
              defaultValue: '29ABCDE1234F1Z5',
              label: 'GSTIN',
            },
            {
              name: 'footerNote',
              type: 'text',
              defaultValue: 'Made slowly in Bangalore',
              label: 'Craft note (right side)',
            },
            {
              name: 'versionBadge',
              type: 'text',
              defaultValue: 'v2.4 · batch 047',
              label: 'Version badge (mono font, right side)',
              admin: { description: 'e.g. "v2.4 · batch 047"' },
            },
            {
              name: 'freeShippingThreshold',
              type: 'number',
              defaultValue: 999,
              label: 'Free shipping threshold (₹)',
              admin: { description: 'Used in cart drawer progress bar' },
            },
          ],
        },

        // ── Tab 7: Social ─────────────────────────────────────────────
        {
          label: 'Social',
          description: 'Social links shown as icons in the brand column',
          fields: [
            {
              name: 'social',
              type: 'group',
              label: ' ',
              fields: [
                { name: 'instagram', type: 'text', label: 'Instagram URL' },
                { name: 'youtube',   type: 'text', label: 'YouTube URL' },
                { name: 'facebook',  type: 'text', label: 'Facebook URL' },
                { name: 'twitter',   type: 'text', label: 'X / Twitter URL' },
                { name: 'whatsapp',  type: 'text', label: 'WhatsApp link', admin: { description: 'e.g. https://wa.me/918904738151' } },
              ],
            },
          ],
        },

      ],
    },
  ],
}
