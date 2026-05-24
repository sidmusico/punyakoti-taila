import type { GlobalConfig } from 'payload'
import { revalidateHomepage } from './hooks/revalidateHomepage'

export const HomepageSettings: GlobalConfig = {
  slug: 'homepage-settings',
  label: 'Homepage',
  access: { read: () => true },
  hooks: { afterChange: [revalidateHomepage] },
  fields: [
    {
      type: 'tabs',
      tabs: [

        // ── Tab 1: Hero ───────────────────────────────────────────────
        {
          label: 'Hero',
          description: 'Full-screen hero section at the top of the homepage',
          fields: [
            {
              name: 'hero',
              type: 'group',
              label: ' ',
              fields: [
                {
                  name: 'eyebrow',
                  type: 'text',
                  defaultValue: 'Est. from a village press',
                  label: 'Eyebrow label (small caps above headline)',
                },
                {
                  name: 'headlineLine1',
                  type: 'text',
                  defaultValue: 'Pressed slowly,',
                  label: 'Headline — line 1',
                },
                {
                  name: 'headlineLine2',
                  type: 'text',
                  defaultValue: 'on wood.',
                  label: 'Headline — line 2',
                },
                {
                  name: 'headlineItalicWord',
                  type: 'text',
                  defaultValue: 'wood.',
                  label: 'Italic word in line 2 (highlighted in mustard)',
                  admin: { description: 'Must match text in line 2 exactly — this word is shown in italic mustard gold' },
                },
                {
                  name: 'body',
                  type: 'textarea',
                  defaultValue: "The way your grandmother's kitchen smelled. Unrefined oils from wooden ghanis in Erode and Raibag — bottled within 72 hours, shipped to your kitchen in eight days.",
                  label: 'Hero body paragraph',
                },
                {
                  name: 'primaryCTA',
                  type: 'group',
                  label: 'Primary button',
                  fields: [
                    { name: 'label', type: 'text', defaultValue: 'Shop the collection' },
                    { name: 'href',  type: 'text', defaultValue: '/shop' },
                  ],
                },
                {
                  name: 'secondaryCTA',
                  type: 'group',
                  label: 'Secondary button',
                  fields: [
                    { name: 'label', type: 'text', defaultValue: 'Read our story' },
                    { name: 'href',  type: 'text', defaultValue: '/about' },
                  ],
                },
                {
                  name: 'reviewRating',
                  type: 'text',
                  defaultValue: '4.9 / 5',
                  label: 'Review rating display',
                },
                {
                  name: 'reviewCount',
                  type: 'text',
                  defaultValue: '2,847 verified kitchens',
                  label: 'Review count label',
                },
                {
                  name: 'featuredBatch',
                  type: 'text',
                  defaultValue: 'Batch #047',
                  label: 'Bottle card — batch number',
                },
                {
                  name: 'featuredYear',
                  type: 'text',
                  defaultValue: 'Raibag · 2025',
                  label: 'Bottle card — location/year',
                },
                {
                  name: 'pressOfWeekName',
                  type: 'text',
                  defaultValue: 'Sesame · Erode',
                  label: 'Floating card — "Press of the week" text',
                },
              ],
            },
          ],
        },

        // ── Tab 2: Trust Strip ────────────────────────────────────────
        {
          label: 'Trust Strip',
          description: 'Four trust badges shown below the hero',
          fields: [
            {
              name: 'trustStrip',
              type: 'array',
              label: 'Trust items (4 recommended)',
              defaultValue: [
                { icon: 'leaf',   label: 'Cold-pressed',   sub: 'Below 40°C always' },
                { icon: 'drop',   label: 'Unrefined',      sub: 'No chemicals, no bleach' },
                { icon: 'truck',  label: 'Ships in 8 days', sub: 'Fresh from press to door' },
                { icon: 'shield', label: 'Lab tested',      sub: 'Every batch certified' },
              ],
              fields: [
                {
                  name: 'icon',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Leaf',   value: 'leaf' },
                    { label: 'Drop',   value: 'drop' },
                    { label: 'Truck',  value: 'truck' },
                    { label: 'Shield', value: 'shield' },
                    { label: 'Star',   value: 'star' },
                    { label: 'Check',  value: 'check' },
                  ],
                },
                { name: 'label', type: 'text', required: true, label: 'Trust item label' },
                { name: 'sub',   type: 'text', label: 'Sub-text description' },
              ],
            },
          ],
        },

        // ── Tab 3: Featured Oils ──────────────────────────────────────
        {
          label: 'Featured Oils',
          description: 'Product grid section below trust strip',
          fields: [
            {
              name: 'featuredSection',
              type: 'group',
              label: ' ',
              fields: [
                { name: 'eyebrow',  type: 'text', defaultValue: 'The collection' },
                { name: 'headline', type: 'text', defaultValue: 'Six oils, one philosophy' },
                {
                  name: 'body',
                  type: 'text',
                  defaultValue: 'Pressed slowly on wooden ghanis. Bottled within 72 hours. Always single-batch.',
                },
                { name: 'ctaLabel', type: 'text', defaultValue: 'Shop all' },
                { name: 'ctaHref',  type: 'text', defaultValue: '/shop' },
                {
                  name: 'products',
                  type: 'relationship',
                  relationTo: 'products',
                  hasMany: true,
                  label: 'Featured products',
                  admin: { description: 'Select up to 6 products to feature. Only published products appear on the site.' },
                },
              ],
            },
          ],
        },

        // ── Tab 4: Process / Story ────────────────────────────────────
        {
          label: 'Process',
          description: 'Dark green "How we press" section with stats',
          fields: [
            {
              name: 'processSection',
              type: 'group',
              label: ' ',
              fields: [
                { name: 'eyebrow',      type: 'text', defaultValue: 'How we press' },
                { name: 'headlineLine1', type: 'text', defaultValue: 'The ghani has turned' },
                {
                  name: 'headlineLine2',
                  type: 'text',
                  defaultValue: 'for a thousand years.',
                  label: 'Headline line 2 (shown in italic mustard)',
                },
                {
                  name: 'body',
                  type: 'textarea',
                  defaultValue: "A wooden press, a stone wheel, a slow rotation — this is how oil has been made in India for millennia. At Punyakoti, we've changed nothing. Seeds go in, oil comes out, below 40°C. Always.",
                },
                {
                  name: 'stats',
                  type: 'array',
                  label: 'Stats grid (2×2)',
                  defaultValue: [
                    { value: '< 40°C', label: 'Press temperature' },
                    { value: '72 hrs', label: 'Farm to bottle' },
                    { value: '100%',   label: 'Single-origin seeds' },
                    { value: '0',      label: 'Chemical additives' },
                  ],
                  fields: [
                    { name: 'value', type: 'text', required: true, label: 'Stat value (e.g. "< 40°C")' },
                    { name: 'label', type: 'text', required: true, label: 'Stat description' },
                  ],
                },
                { name: 'ctaLabel', type: 'text', defaultValue: 'Read our story' },
                { name: 'ctaHref',  type: 'text', defaultValue: '/about' },
              ],
            },
          ],
        },

        // ── Tab 5: Why Cold-Pressed ───────────────────────────────────
        {
          label: 'Why Cold-Pressed',
          description: 'Three-card benefit section',
          fields: [
            {
              name: 'whyColdPressed',
              type: 'group',
              label: ' ',
              fields: [
                { name: 'eyebrow',  type: 'text', defaultValue: 'Why it matters' },
                {
                  name: 'headline',
                  type: 'text',
                  defaultValue: 'Cold-pressed vs. refined — the difference you taste',
                },
                {
                  name: 'headlineItalic',
                  type: 'text',
                  defaultValue: 'the difference you taste',
                  label: 'Italic portion of headline',
                  admin: { description: 'Must be an exact substring of Headline above' },
                },
                {
                  name: 'cards',
                  type: 'array',
                  label: 'Benefit cards (3)',
                  defaultValue: [
                    { icon: 'drop',   title: 'Full nutrition intact', body: 'Heat-extracted oils lose vitamins and antioxidants. Cold-pressing retains all of them — Omega-3s, Vitamin E, polyphenols.' },
                    { icon: 'leaf',   title: 'No chemicals',          body: 'Refined oils use hexane solvent to extract every last drop. We use only mechanical pressure. Nothing else touches the oil.' },
                    { icon: 'shield', title: 'Real flavour',          body: 'Refined oils are deodorised and bleached. Our oils taste exactly like the seed they came from — sesame is nutty, coconut is floral.' },
                  ],
                  fields: [
                    {
                      name: 'icon',
                      type: 'select',
                      required: true,
                      options: [
                        { label: 'Leaf',   value: 'leaf' },
                        { label: 'Drop',   value: 'drop' },
                        { label: 'Shield', value: 'shield' },
                        { label: 'Star',   value: 'star' },
                      ],
                    },
                    { name: 'title', type: 'text',     required: true },
                    { name: 'body',  type: 'textarea', required: true },
                  ],
                },
              ],
            },
          ],
        },

        // ── Tab 6: Newsletter ─────────────────────────────────────────
        {
          label: 'Newsletter',
          description: 'Dark green newsletter signup band',
          fields: [
            {
              name: 'newsletter',
              type: 'group',
              label: ' ',
              fields: [
                { name: 'headline',  type: 'text',     defaultValue: 'The pressing calendar' },
                {
                  name: 'body',
                  type: 'textarea',
                  defaultValue: "New batches every week. Subscribe and we'll let you know the moment fresh oil is ready — before it sells out.",
                },
                {
                  name: 'legalText',
                  type: 'text',
                  defaultValue: 'One email per batch. No spam. Unsubscribe anytime.',
                },
              ],
            },
          ],
        },

        // ── Tab 7: FAQ ────────────────────────────────────────────────
        {
          label: 'FAQ',
          description: 'Accordion FAQ section at the bottom of the homepage',
          fields: [
            {
              name: 'faq',
              type: 'array',
              label: 'FAQ items',
              defaultValue: [
                { question: 'What is wood-pressed (ghani) oil?', answer: 'A wooden or stone expeller rotates slowly, crushing oilseeds without generating significant heat (below 40°C). This preserves natural flavours, vitamins, and fatty acid profiles that are destroyed by conventional heat extraction.' },
                { question: 'How long does the oil keep?', answer: 'Unopened, 12–18 months in a cool, dark place. Once opened, use within 3–4 months. Our sesame and coconut oils are naturally more stable; groundnut and sunflower should be refrigerated after opening in summer.' },
                { question: 'Is it safe to fry with cold-pressed oil?', answer: 'Yes. Groundnut and sesame have a high smoke point (~180–200°C) and are ideal for Indian cooking. We recommend medium heat — exactly as your grandmother would use it.' },
                { question: 'Do you ship pan-India?', answer: 'Yes — we ship to all major pincodes via Delhivery and Shiprocket. Orders placed before 2 PM are dispatched same day. Delivery typically takes 3–5 business days.' },
              ],
              fields: [
                { name: 'question', type: 'text',     required: true },
                { name: 'answer',   type: 'textarea', required: true },
              ],
            },
          ],
        },

      ],
    },
  ],
}
