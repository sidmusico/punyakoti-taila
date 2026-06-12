import type { Field } from 'payload'

const iconOptions = [
  { label: 'Leaf', value: 'leaf' },
  { label: 'Drop', value: 'drop' },
  { label: 'Truck', value: 'truck' },
  { label: 'Shield', value: 'shield' },
  { label: 'Package', value: 'package' },
  { label: 'Star', value: 'star' },
]

/** Shop listing (PLP) — copy only; grid data comes from Products */
export const plpFields: Field[] = [
  {
    name: 'plp',
    type: 'group',
    label: 'Shop listing',
    admin: { description: 'Use the tabs below to jump between SEO, headlines, filters, and media.' },
    fields: [
      {
        type: 'tabs',
        tabs: [
          {
            label: 'SEO',
            description: 'Meta title and description for /shop',
            fields: [
              { name: 'metaTitle', type: 'text', defaultValue: 'Shop All Oils' },
              {
                name: 'metaDescription',
                type: 'textarea',
                defaultValue: 'Browse our full collection of wood-pressed, cold-pressed oils.',
              },
            ],
          },
          {
            label: 'Headlines',
            description: 'Default and category-filter (?cat=) copy',
            fields: [
              { name: 'eyebrow', type: 'text', defaultValue: 'The collection' },
              { name: 'headline', type: 'text', defaultValue: 'All oils' },
              {
                name: 'introWithCount',
                type: 'text',
                defaultValue: '{count} single-origin wood-pressed {oilWord}',
                admin: {
                  description: 'Use {count} and {oilWord} — oilWord becomes "oil" or "oils" automatically.',
                },
              },
              {
                name: 'eyebrowWhenCategory',
                type: 'text',
                defaultValue: 'Browsing',
                admin: {
                  description: 'Shown when ?cat= (category slug) is set. Use {category} for the category title.',
                },
              },
              {
                name: 'headlineWhenCategory',
                type: 'text',
                defaultValue: '{category}',
                admin: { description: 'Headline when a category filter is active. Placeholders: {category}.' },
              },
              {
                name: 'introWhenCategory',
                type: 'textarea',
                defaultValue: '{count} wood-pressed {oilWord} in {category}.',
                admin: {
                  description:
                    'Intro when ?cat= is set. Placeholders: {count}, {oilWord}, {category} (category title).',
                },
              },
            ],
          },
          {
            label: 'Filters & empty state',
            description: 'Sidebar labels, chips, sort options, no-results message',
            fields: [
              { name: 'filterCategoryLabel', type: 'text', defaultValue: 'Category' },
              { name: 'filterSortLabel', type: 'text', defaultValue: 'Sort by' },
              {
                name: 'categoryFilters',
                type: 'array',
                label: 'Category filter chips',
                defaultValue: [
                  { label: 'All', value: '' },
                  { label: 'Cooking Oils', value: 'cooking' },
                  { label: 'Wellness', value: 'wellness' },
                ],
                fields: [
                  { name: 'label', type: 'text', required: true },
                  { name: 'value', type: 'text', admin: { description: 'Query param value; empty string = All' } },
                ],
              },
              {
                name: 'sortOptions',
                type: 'array',
                label: 'Sort options',
                defaultValue: [
                  { label: 'Featured', value: 'default' },
                  { label: 'Price: Low → High', value: 'price-asc' },
                  { label: 'Price: High → Low', value: 'price-desc' },
                ],
                fields: [
                  { name: 'label', type: 'text', required: true },
                  { name: 'value', type: 'text', required: true },
                ],
              },
              { name: 'emptyTitle', type: 'text', defaultValue: 'No products found in this category.' },
              { name: 'emptyCtaLabel', type: 'text', defaultValue: 'View all oils' },
              { name: 'emptyCtaHref', type: 'text', defaultValue: '/shop' },
            ],
          },
          {
            label: 'Media',
            description: 'Optional PLP imagery',
            fields: [
              {
                name: 'decorativeImage',
                type: 'upload',
                relationTo: 'media',
                admin: { description: 'Optional — reserved for future PLP banner' },
              },
            ],
          },
        ],
      },
    ],
  },
]

export const pdpFields: Field[] = [
  {
    name: 'pdp',
    type: 'group',
    label: 'Product detail chrome',
    admin: { description: 'Defaults for PDP UI; products can override ratings where configured.' },
    fields: [
      {
        type: 'tabs',
        tabs: [
          {
            label: 'Ratings & sizes',
            fields: [
              { name: 'ratingDisplay', type: 'text', defaultValue: '4.9' },
              { name: 'reviewsDisplay', type: 'text', defaultValue: '612 reviews' },
              {
                name: 'starsCount',
                type: 'number',
                defaultValue: 5,
                min: 1,
                max: 5,
                admin: { description: 'Filled stars shown when the product has no per-product override.' },
              },
              {
                name: 'variantSizeLabels',
                type: 'array',
                label: 'Variant size labels (PDP & PLP)',
                admin: { description: 'Maps each variant size value to the label shown in the shop.' },
                defaultValue: [
                  { sizeValue: '250ml', label: '250 ml' },
                  { sizeValue: '500ml', label: '500 ml' },
                  { sizeValue: '1L', label: '1 L' },
                  { sizeValue: '5L', label: '5 L' },
                ],
                fields: [
                  {
                    name: 'sizeValue',
                    type: 'select',
                    required: true,
                    options: [
                      { label: '250 ml', value: '250ml' },
                      { label: '500 ml', value: '500ml' },
                      { label: '1 L', value: '1L' },
                      { label: '5 L', value: '5L' },
                    ],
                  },
                  { name: 'label', type: 'text', required: true },
                ],
              },
            ],
          },
          {
            label: 'Shipping',
            fields: [
              {
                name: 'shippingBullets',
                type: 'array',
                label: 'Trust bullets under buy box',
                defaultValue: [
                  { icon: 'truck', text: 'Free shipping on orders above ₹999' },
                  { icon: 'package', text: 'Dispatched within 24 hours · Delivered in 3–5 days' },
                  { icon: 'shield', text: 'Lab tested batch. Certificate available on request.' },
                ],
                fields: [
                  { name: 'icon', type: 'select', options: iconOptions, defaultValue: 'truck' },
                  { name: 'text', type: 'text', required: true },
                ],
              },
            ],
          },
          {
            label: 'Section headings',
            fields: [
              { name: 'aboutHeading', type: 'text', defaultValue: 'About this oil' },
              { name: 'howToUseHeading', type: 'text', defaultValue: 'How to use' },
              { name: 'benefitsHeading', type: 'text', defaultValue: "Why it's good for you" },
            ],
          },
        ],
      },
    ],
  },
]

export const cartDrawerFields: Field[] = [
  {
    name: 'cartDrawer',
    type: 'group',
    label: 'Cart drawer',
    admin: { description: 'Slide-out basket (Zustand-driven UI).' },
    fields: [
      {
        type: 'tabs',
        tabs: [
          {
            label: 'Titles & empty',
            fields: [
              { name: 'title', type: 'text', defaultValue: 'Your Basket' },
              { name: 'emptyTitle', type: 'text', defaultValue: 'Your basket is empty' },
              { name: 'emptySubtitle', type: 'text', defaultValue: 'Add some oils to get started' },
              { name: 'browseButtonLabel', type: 'text', defaultValue: 'Browse Oils' },
            ],
          },
          {
            label: 'Shipping progress',
            fields: [
              {
                name: 'freeShippingProgress',
                type: 'text',
                defaultValue: 'Add {remaining} more for free shipping',
                admin: { description: '{remaining} is replaced with formatted rupees' },
              },
              { name: 'freeShippingUnlocked', type: 'text', defaultValue: "You've unlocked free shipping!" },
              {
                name: 'flatShippingAmount',
                type: 'number',
                defaultValue: 99,
                label: 'Flat shipping (₹) when below free-shipping threshold',
                admin: { description: 'Uses free-shipping threshold from Site Settings' },
              },
            ],
          },
          {
            label: 'Line totals & actions',
            fields: [
              { name: 'subtotalLabel', type: 'text', defaultValue: 'Subtotal' },
              { name: 'shippingLabel', type: 'text', defaultValue: 'Shipping' },
              { name: 'shippingFreeLabel', type: 'text', defaultValue: 'Free' },
              { name: 'totalLabel', type: 'text', defaultValue: 'Total' },
              { name: 'continueCheckoutLabel', type: 'text', defaultValue: 'Continue to Checkout' },
              { name: 'continueShoppingLabel', type: 'text', defaultValue: 'Continue shopping' },
              { name: 'removeLineLabel', type: 'text', defaultValue: 'Remove' },
            ],
          },
          {
            label: 'Subscribe',
            fields: [
              { name: 'subscribeSuffix', type: 'text', defaultValue: ' · Subscribe' },
              {
                name: 'subscribePillLabel',
                type: 'text',
                defaultValue: 'Subscribe · save 15%',
                admin: { description: 'Badge on cart lines when the item is a subscription.' },
              },
            ],
          },
        ],
      },
    ],
  },
]

export const cartPageFields: Field[] = [
  {
    name: 'cartPage',
    type: 'group',
    label: 'Cart page (/cart)',
    admin: { description: 'Full cart route copy and layout hints.' },
    fields: [
      {
        type: 'tabs',
        tabs: [
          {
            label: 'SEO',
            fields: [
              { name: 'metaTitle', type: 'text', defaultValue: 'Your cart' },
              {
                name: 'metaDescription',
                type: 'textarea',
                defaultValue: 'Review items in your basket before checkout.',
              },
            ],
          },
          {
            label: 'Hero & headline',
            fields: [
              { name: 'listingEyebrow', type: 'text', defaultValue: 'Your basket' },
              { name: 'breadcrumbHomeLabel', type: 'text', defaultValue: 'Home' },
              { name: 'breadcrumbHomeHref', type: 'text', defaultValue: '/' },
              { name: 'breadcrumbCurrentLabel', type: 'text', defaultValue: 'Basket' },
              {
                name: 'headline',
                type: 'text',
                defaultValue: 'Your cart',
                admin: { description: 'Fallback single headline if the split headline fields below are empty.' },
              },
              {
                name: 'headlineLineBeforeItalic',
                type: 'text',
                defaultValue: 'Three bottles, ',
                admin: { description: 'Shown before the mustard italic phrase (e.g. “Three bottles, ”).' },
              },
              {
                name: 'headlineItalic',
                type: 'text',
                defaultValue: 'well chosen.',
                admin: { description: 'Mustard italic display line (e.g. “well chosen.”).' },
              },
              {
                name: 'headlineLineAfterItalic',
                type: 'text',
                admin: { description: 'Optional text after the italic phrase.' },
              },
              {
                name: 'subhead',
                type: 'textarea',
                defaultValue: 'Review your oils and proceed to secure checkout.',
              },
              { name: 'heroImage', type: 'upload', relationTo: 'media' },
            ],
          },
          {
            label: 'Links & summary',
            fields: [
              { name: 'checkoutHref', type: 'text', defaultValue: '/checkout' },
              { name: 'continueShoppingHref', type: 'text', defaultValue: '/shop' },
              { name: 'orderSummaryEyebrow', type: 'text', defaultValue: 'Order summary' },
              {
                name: 'subtotalLineTemplate',
                type: 'text',
                defaultValue: 'Subtotal · {count} {bottleWord}',
                admin: {
                  description:
                    '{count} = item count · {bottleWord} = singular/plural below. If empty, falls back to the drawer “Subtotal” label.',
                },
              },
              { name: 'bottleWordSingular', type: 'text', defaultValue: 'bottle' },
              { name: 'bottleWordPlural', type: 'text', defaultValue: 'bottles' },
              { name: 'gstLabel', type: 'text', defaultValue: 'GST · included' },
              { name: 'gstDisplayValue', type: 'text', defaultValue: '—' },
              { name: 'promoCodePlaceholder', type: 'text', defaultValue: 'Promo code' },
              { name: 'promoApplyLabel', type: 'text', defaultValue: 'Apply' },
            ],
          },
          {
            label: 'Trust',
            fields: [
              {
                name: 'securedPaymentLine',
                type: 'text',
                defaultValue: 'Secured by Razorpay · UPI · cards · netbanking',
              },
              {
                name: 'trustFootnote',
                type: 'textarea',
                defaultValue:
                  'Pressed within the last 14 days. Bottled in dark amber glass. Ships from Bangalore in two days.',
              },
              {
                name: 'saveForLaterLabel',
                type: 'text',
                admin: { description: 'Leave empty to hide “Save for later” (link-only for now).' },
              },
              { name: 'saveForLaterHref', type: 'text', defaultValue: '/account/saved' },
            ],
          },
        ],
      },
    ],
  },
]

export const accountFields: Field[] = [
  {
    name: 'account',
    type: 'group',
    label: 'Account / profile',
    admin: { description: 'Account dashboard chrome.' },
    fields: [
      {
        type: 'tabs',
        tabs: [
          {
            label: 'SEO & page',
            fields: [
              { name: 'metaTitle', type: 'text', defaultValue: 'My Account' },
              { name: 'pageTitle', type: 'text', defaultValue: 'My Account' },
            ],
          },
          {
            label: 'Cards & labels',
            fields: [
              { name: 'profileCardTitle', type: 'text', defaultValue: 'Profile' },
              { name: 'labelName', type: 'text', defaultValue: 'Name' },
              { name: 'labelEmail', type: 'text', defaultValue: 'Email' },
              { name: 'ordersCardTitle', type: 'text', defaultValue: 'Recent orders' },
              { name: 'viewAllOrdersLabel', type: 'text', defaultValue: 'View all →' },
              { name: 'emptyOrdersMessage', type: 'text', defaultValue: 'No orders yet — your first one is one click away.' },
              { name: 'shopNowLabel', type: 'text', defaultValue: 'Shop now' },
            ],
          },
          {
            label: 'Sidebar nav',
            fields: [
              {
                name: 'navItems',
                type: 'array',
                label: 'Account sidebar links',
                defaultValue: [
                  { href: '/account', label: 'Profile', icon: 'user' },
                  { href: '/account/orders', label: 'My Orders', icon: 'package' },
                  { href: '/account/saved', label: 'Saved items', icon: 'heart' },
                  { href: '/account/subscriptions', label: 'Subscriptions', icon: 'refresh' },
                ],
                fields: [
                  { name: 'href', type: 'text', required: true },
                  { name: 'label', type: 'text', required: true },
                  {
                    name: 'icon',
                    type: 'select',
                    options: [
                      { label: 'User', value: 'user' },
                      { label: 'Package', value: 'package' },
                      { label: 'Heart', value: 'heart' },
                      { label: 'Refresh', value: 'refresh' },
                    ],
                    defaultValue: 'user',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]

export const orderSuccessFields: Field[] = [
  {
    name: 'orderSuccess',
    type: 'group',
    label: 'Order confirmation (/order/success)',
    admin: { description: 'Thank-you page and timeline copy.' },
    fields: [
      {
        type: 'tabs',
        tabs: [
          {
            label: 'SEO & header',
            fields: [
              { name: 'metaTitle', type: 'text', defaultValue: 'Order Confirmed — Thank you!' },
              {
                name: 'headerWordmark',
                type: 'upload',
                relationTo: 'media',
                admin: {
                  description: 'Optional logo for the top bar; if empty the site falls back to /logo-wordmark.svg.',
                },
              },
              { name: 'headerAsideLabel', type: 'text', defaultValue: 'Order confirmation' },
              {
                name: 'orderRefEyebrowTemplate',
                type: 'text',
                defaultValue: 'Order #{id} · received',
                admin: { description: 'Shown when ?id= is present. Use {id} for the order reference.' },
              },
            ],
          },
          {
            label: 'Thank you',
            fields: [
              { name: 'thankYouHeadline', type: 'text', defaultValue: 'Thank you!' },
              {
                name: 'thankYouLinePrefix',
                type: 'text',
                defaultValue: 'Thank you,',
                admin: { description: 'When ?name= is set, headline becomes prefix + italic name + suffix.' },
              },
              { name: 'thankYouNameSuffix', type: 'text', defaultValue: '.' },
              {
                name: 'thankYouBody',
                type: 'textarea',
                defaultValue:
                  "Your bottles will be packed and dispatched soon. You'll receive tracking by email.",
              },
              {
                name: 'orderRefPrefix',
                type: 'text',
                defaultValue: 'Order ref:',
                admin: { description: 'Secondary line with raw id' },
              },
              {
                name: 'confirmationNote',
                type: 'textarea',
                defaultValue: 'Confirmation will be sent to your email.',
                admin: { description: 'Shown under primary actions.' },
              },
            ],
          },
          {
            label: 'Actions',
            fields: [
              { name: 'trackOrderLabel', type: 'text', defaultValue: 'Track your order' },
              { name: 'trackOrderHref', type: 'text', defaultValue: '/account' },
              { name: 'downloadInvoiceLabel', type: 'text', defaultValue: 'Download invoice' },
              { name: 'downloadInvoiceHref', type: 'text', defaultValue: '/account' },
            ],
          },
          {
            label: 'Timeline',
            fields: [
              { name: 'nextStepsTitle', type: 'text', defaultValue: 'Your bottles, on their way' },
              {
                name: 'timelineSteps',
                type: 'array',
                label: 'Timeline steps (horizontal)',
                defaultValue: [
                  { label: 'Order placed', sub: 'Confirmed', stamp: 'Today', done: true, active: false },
                  { label: 'Bottling', sub: 'At the press', stamp: 'Within 24 hrs', done: true, active: false },
                  { label: 'Out for delivery', sub: 'Courier', stamp: 'Expected soon', done: false, active: true },
                  { label: 'Delivered', sub: 'Enjoy', stamp: 'Estimated window', done: false, active: false },
                ],
                fields: [
                  { name: 'label', type: 'text', required: true },
                  { name: 'sub', type: 'text', required: true },
                  {
                    name: 'stamp',
                    type: 'text',
                    admin: { description: 'Small mono line under the title (dates, windows, etc.)' },
                  },
                  { name: 'done', type: 'checkbox', defaultValue: false },
                  {
                    name: 'active',
                    type: 'checkbox',
                    defaultValue: false,
                    admin: { description: 'Current step highlight' },
                  },
                ],
              },
            ],
          },
          {
            label: 'Upsell & nav',
            fields: [
              { name: 'upsellTitle', type: 'text', defaultValue: 'Never run out again' },
              {
                name: 'upsellBody',
                type: 'textarea',
                defaultValue: 'Set up a subscription and save 15% on every order. Cancel anytime.',
              },
              { name: 'upsellCtaLabel', type: 'text', defaultValue: 'Browse and subscribe' },
              { name: 'upsellCtaHref', type: 'text', defaultValue: '/shop' },
              { name: 'continueShoppingLabel', type: 'text', defaultValue: 'Continue shopping' },
              { name: 'viewOrdersLabel', type: 'text', defaultValue: 'View my orders' },
            ],
          },
          {
            label: 'Imagery',
            fields: [
              {
                name: 'heroImageCaptionLeft',
                type: 'text',
                admin: { description: 'Caption under hero image — left side' },
              },
              {
                name: 'heroImageCaptionRight',
                type: 'text',
                admin: { description: 'Caption under hero image — right side' },
              },
              { name: 'celebrationImage', type: 'upload', relationTo: 'media' },
            ],
          },
        ],
      },
    ],
  },
]
