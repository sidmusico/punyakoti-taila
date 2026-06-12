/**
 * Defaults for storefront-related Payload globals (split like Homepage).
 * Applied by GET /api/seed-pages when each global is still empty.
 * After editing CMS locally, run GET /api/export-storefront-seed and commit `src/seed/generated/*.json`.
 */

export const shopListingSeedDefaults = {
  plp: {
    metaTitle: 'Shop All Oils',
    metaDescription:
      'Browse our full collection of wood-pressed, cold-pressed oils from single-origin farms across India.',
    eyebrow: 'The collection',
    headline: 'All oils',
    introWithCount: '{count} single-origin wood-pressed {oilWord}',
    eyebrowWhenCategory: 'Browsing',
    headlineWhenCategory: '{category}',
    introWhenCategory: '{count} wood-pressed {oilWord} in {category}.',
    filterCategoryLabel: 'Category',
    filterSortLabel: 'Sort by',
    categoryFilters: [
      { label: 'All', value: '' },
      { label: 'Cooking Oils', value: 'cooking' },
      { label: 'Wellness', value: 'wellness' },
    ],
    sortOptions: [
      { label: 'Featured', value: 'default' },
      { label: 'Price: Low → High', value: 'price-asc' },
      { label: 'Price: High → Low', value: 'price-desc' },
    ],
    emptyTitle: 'No products found in this category.',
    emptyCtaLabel: 'View all oils',
    emptyCtaHref: '/shop',
  },
} as const

export const productDetailSeedDefaults = {
  pdp: {
    ratingDisplay: '4.9',
    reviewsDisplay: '612 reviews',
    starsCount: 5,
    variantSizeLabels: [
      { sizeValue: '250ml', label: '250 ml' },
      { sizeValue: '500ml', label: '500 ml' },
      { sizeValue: '1L', label: '1 L' },
      { sizeValue: '5L', label: '5 L' },
    ],
    shippingBullets: [
      { icon: 'truck', text: 'Free shipping on orders above ₹999' },
      { icon: 'package', text: 'Dispatched within 24 hours · Delivered in 3–5 days' },
      { icon: 'shield', text: 'Lab tested batch. Certificate available on request.' },
    ],
    aboutHeading: 'About this oil',
    howToUseHeading: 'How to use',
    benefitsHeading: "Why it's good for you",
  },
} as const

export const cartSeedDefaults = {
  cartDrawer: {
    title: 'Your Basket',
    freeShippingProgress: 'Add {remaining} more for free shipping',
    freeShippingUnlocked: "You've unlocked free shipping!",
    emptyTitle: 'Your basket is empty',
    emptySubtitle: 'Add some oils to get started',
    browseButtonLabel: 'Browse Oils',
    subtotalLabel: 'Subtotal',
    shippingLabel: 'Shipping',
    shippingFreeLabel: 'Free',
    totalLabel: 'Total',
    continueCheckoutLabel: 'Continue to Checkout',
    continueShoppingLabel: 'Continue shopping',
    subscribeSuffix: ' · Subscribe',
    subscribePillLabel: 'Subscribe · save 15%',
    removeLineLabel: 'Remove',
    flatShippingAmount: 99,
  },
  cartPage: {
    metaTitle: 'Your cart',
    metaDescription: 'Review items in your basket before checkout.',
    listingEyebrow: 'Your basket',
    breadcrumbHomeLabel: 'Home',
    breadcrumbHomeHref: '/',
    breadcrumbCurrentLabel: 'Basket',
    headline: 'Your cart',
    headlineLineBeforeItalic: 'Three bottles, ',
    headlineItalic: 'well chosen.',
    headlineLineAfterItalic: '',
    subhead: 'Review your oils and proceed to secure checkout.',
    checkoutHref: '/checkout',
    continueShoppingHref: '/shop',
    orderSummaryEyebrow: 'Order summary',
    subtotalLineTemplate: 'Subtotal · {count} {bottleWord}',
    bottleWordSingular: 'bottle',
    bottleWordPlural: 'bottles',
    gstLabel: 'GST · included',
    gstDisplayValue: '—',
    promoCodePlaceholder: 'Promo code',
    promoApplyLabel: 'Apply',
    securedPaymentLine: 'Secured by Razorpay · UPI · cards · netbanking',
    trustFootnote:
      'Pressed within the last 14 days. Bottled in dark amber glass. Ships from Bangalore in two days.',
    saveForLaterLabel: '',
    saveForLaterHref: '/account/saved',
  },
} as const

export const accountSeedDefaults = {
  account: {
    metaTitle: 'My Account',
    pageTitle: 'My Account',
    profileCardTitle: 'Profile',
    labelName: 'Name',
    labelEmail: 'Email',
    ordersCardTitle: 'Recent orders',
    viewAllOrdersLabel: 'View all →',
    emptyOrdersMessage: 'No orders yet — your first one is one click away.',
    shopNowLabel: 'Shop now',
    navItems: [
      { href: '/account', label: 'Profile', icon: 'user' },
      { href: '/account/orders', label: 'My Orders', icon: 'package' },
      { href: '/account/saved', label: 'Saved items', icon: 'heart' },
      { href: '/account/subscriptions', label: 'Subscriptions', icon: 'refresh' },
    ],
  },
} as const

export const orderSuccessSeedDefaults = {
  orderSuccess: {
    metaTitle: 'Order Confirmed — Thank you!',
    headerAsideLabel: 'Order confirmation',
    orderRefEyebrowTemplate: 'Order #{id} · received',
    thankYouHeadline: 'Thank you!',
    thankYouLinePrefix: 'Thank you,',
    thankYouNameSuffix: '.',
    thankYouBody:
      "Your bottles will be packed and dispatched soon. You'll receive tracking by email.",
    orderRefPrefix: 'Order ref:',
    trackOrderLabel: 'Track your order',
    trackOrderHref: '/account',
    downloadInvoiceLabel: 'Download invoice',
    downloadInvoiceHref: '/account',
    confirmationNote: 'Confirmation will be sent to your email.',
    nextStepsTitle: 'Your bottles, on their way',
    timelineSteps: [
      { label: 'Order placed', sub: 'Confirmed', stamp: 'Today', done: true, active: false },
      { label: 'Bottling', sub: 'At the press', stamp: 'Within 24 hrs', done: true, active: false },
      { label: 'Out for delivery', sub: 'Courier', stamp: 'Expected soon', done: false, active: true },
      { label: 'Delivered', sub: 'Enjoy', stamp: 'Estimated window', done: false, active: false },
    ],
    upsellTitle: 'Never run out again',
    upsellBody: 'Set up a subscription and save 15% on every order. Cancel anytime.',
    upsellCtaLabel: 'Browse and subscribe',
    upsellCtaHref: '/shop',
    continueShoppingLabel: 'Continue shopping',
    viewOrdersLabel: 'View my orders',
    heroImageCaptionLeft: '',
    heroImageCaptionRight: '',
  },
} as const

/** Defaults for the `newsletter-popup` global — pure subscription pitch, no press/origin info. */
export const newsletterPopupSeedDefaults = {
  enabled: true,
  delaySeconds: 6,
  snoozeDays: 7,
  panel: {
    kickerLine: 'Punyakoti Taila',
    title: 'Goodness, bottled.',
    titleItalic: 'bottled.',
    bottleVariant: 'sesame',
    footerLeft: 'Pure tradition',
    footerRight: 'Pure goodness',
  },
  content: {
    eyebrow: 'Join the family',
    headlinePre: 'Fifteen',
    headlineItalic: 'percent off,',
    headlinePost: 'your first order.',
    body: 'A short newsletter with member-only offers, new arrivals, and simple recipes — plus a 15% discount code for your first order.',
    bullets: [
      { icon: 'star', text: 'Member-only offers & early access' },
      { icon: 'mail', text: 'One short email a fortnight — no spam' },
      { icon: 'shield', text: 'Unsubscribe anytime, in one click' },
    ],
    emailLabel: 'Email',
    emailPlaceholder: 'your@kitchen.in',
    ctaLabel: 'Get my code',
    privacyPrefix: 'By subscribing you agree to our',
    privacyLinkLabel: 'privacy policy',
    privacyHref: '/privacy',
    privacySuffix: "We won't sell your address.",
    dismissLabel: 'No thanks, keep shopping',
    successTitle: 'Check your inbox.',
    successBody: 'Your code is on its way to {email}.',
  },
} as const

/** Merged shape for reference / manual JSON (not a Payload slug). */
export const storefrontSeedDefaultsMerged = {
  plp: shopListingSeedDefaults.plp,
  pdp: productDetailSeedDefaults.pdp,
  cartDrawer: cartSeedDefaults.cartDrawer,
  cartPage: cartSeedDefaults.cartPage,
  account: accountSeedDefaults.account,
  orderSuccess: orderSuccessSeedDefaults.orderSuccess,
} as const
