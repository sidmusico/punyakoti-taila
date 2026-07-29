/** Default copy for the Email Templates global (seed + fallbacks). */

export type EmailTemplateBlock = {
  enabled?: boolean
  subject: string
  headline: string
  body: string
  includeLineItems?: boolean
  includeTotals?: boolean
  includeShippingAddress?: boolean
}

const order = (
  subject: string,
  headline: string,
  body: string,
  opts?: Partial<EmailTemplateBlock>,
): EmailTemplateBlock => ({
  enabled: true,
  subject,
  headline,
  body,
  includeLineItems: true,
  includeTotals: subject.includes('confirmed'),
  includeShippingAddress: true,
  ...opts,
})

export const emailTemplatesSeedDefaults = {
  mergeTagsHelp:
    'Order emails: {{customerName}}, {{orderId}}, {{headline}}, {{body}}, {{trackingNumber}}, {{courier}}, {{deliveryMethod}}, {{shopUrl}}. Welcome: {{customerName}}, {{shopUrl}} (logo + Shop button use the site URL for the current environment). Auth: {{otp}}, {{confirmationUrl}}, {{email}}. Line items, totals, and address blocks are appended automatically when enabled on each template.',
  orderConfirmed: order(
    'Order {{orderId}} confirmed — Punyakoti Taila',
    'Thank you, {{customerName}}!',
    "Your order {{orderId}} is confirmed. We're preparing your wood-pressed oils and will email you when they ship.",
    { includeTotals: true },
  ),
  orderPacked: order(
    'Order {{orderId}} packed — Punyakoti Taila',
    'Your order is packed',
    'Good news — your order {{orderId}} has been carefully packed and is ready to leave our facility.',
    { includeTotals: false },
  ),
  orderShipped: order(
    'Order {{orderId}} has shipped — Punyakoti Taila',
    'Your order is on the way',
    'Your wood-pressed oils have left our facility. Tracking details are below when available.',
    { includeTotals: false, includeShippingAddress: false },
  ),
  orderOutForDelivery: order(
    'Order {{orderId}} is out for delivery — Punyakoti Taila',
    'Out for delivery today',
    'Your order is with the courier and should arrive soon.',
    { includeTotals: false },
  ),
  orderDelivered: order(
    'Order {{orderId}} delivered — Punyakoti Taila',
    'Delivered to your door',
    'We hope you enjoy your oils. Thank you for choosing Punyakoti Taila.',
    { includeTotals: false, includeLineItems: false, includeShippingAddress: false },
  ),
  orderCancelled: order(
    'Order {{orderId}} cancelled — Punyakoti Taila',
    'Order cancelled',
    'This order has been cancelled. If you were charged, a refund will be processed per our policy.',
    { includeTotals: false },
  ),
  orderReturned: order(
    'Order {{orderId}} return update — Punyakoti Taila',
    'Return received',
    "We've received your return for order {{orderId}}. Our team will process it shortly.",
    { includeTotals: false },
  ),
  orderRefunded: order(
    'Refund for order {{orderId}} — Punyakoti Taila',
    'Refund processed',
    'A refund has been issued. It may take 5–7 business days to appear on your statement.',
    { includeTotals: false },
  ),
  welcome: {
    enabled: true,
    subject: 'Welcome to Punyakoti Taila',
    headline: 'Welcome, {{customerName}}',
    body: 'Your account is ready. Explore wood-pressed oils crafted in small batches and delivered to your kitchen. Browse the shop anytime at {{shopUrl}}/shop.',
    includeLineItems: false,
    includeTotals: false,
    includeShippingAddress: false,
  },
  otpEmail: {
    enabled: true,
    subject: 'Your sign-in code — Punyakoti Taila',
    headline: 'Your sign-in code',
    body: 'Use this one-time code to sign in: {{otp}}\n\nThis code expires soon. If you did not request it, ignore this email.',
    includeLineItems: false,
    includeTotals: false,
    includeShippingAddress: false,
  },
  signupConfirmation: {
    enabled: true,
    subject: 'Confirm your email — Punyakoti Taila',
    headline: 'Confirm your email',
    body: 'Tap the button below to confirm your email and finish creating your account.\n\n{{confirmationUrl}}',
    includeLineItems: false,
    includeTotals: false,
    includeShippingAddress: false,
  },
}

export type OrderEmailTemplateKey =
  | 'confirmed'
  | 'packed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'returned'
  | 'refunded'

export const ORDER_STATUS_TO_TEMPLATE: Record<OrderEmailTemplateKey, keyof typeof emailTemplatesSeedDefaults> = {
  confirmed: 'orderConfirmed',
  packed: 'orderPacked',
  shipped: 'orderShipped',
  out_for_delivery: 'orderOutForDelivery',
  delivered: 'orderDelivered',
  cancelled: 'orderCancelled',
  returned: 'orderReturned',
  refunded: 'orderRefunded',
}
