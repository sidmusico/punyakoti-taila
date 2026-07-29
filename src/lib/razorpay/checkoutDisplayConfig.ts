/**
 * Razorpay Standard Checkout — payment method layout.
 * @see https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/configure-payment-methods/
 *
 * UPI must be enabled in Razorpay Dashboard → Account & Settings → Payment Methods.
 * Test keys: cards are hidden by default so "international cards" errors are avoided;
 * use UPI `success@razorpay` or netbanking in test mode.
 */

export type RazorpayMethodFlags = {
  upi: boolean
  card: boolean
  netbanking: boolean
  wallet: boolean
  emi: boolean
  paylater: boolean
}

export function isRazorpayTestKey(keyId: string): boolean {
  return keyId.startsWith('rzp_test_')
}

/** Client-side checkout `method` + `config` for Checkout.js */
export function buildRazorpayCheckoutOptions(razorpayKeyId: string): {
  method: RazorpayMethodFlags
  config: {
    display: {
      sequence: string[]
      preferences: { show_default_blocks: boolean }
      hide?: Array<{ method: string }>
    }
  }
} {
  const hideCards =
    isRazorpayTestKey(razorpayKeyId) ||
    process.env.NEXT_PUBLIC_RAZORPAY_HIDE_CARDS === 'true'

  const method: RazorpayMethodFlags = {
    upi: true,
    netbanking: true,
    wallet: true,
    card: !hideCards,
    emi: false,
    paylater: false,
  }

  const sequence = hideCards
    ? ['upi', 'netbanking', 'wallet']
    : ['upi', 'card', 'netbanking', 'wallet']

  return {
    method,
    config: {
      display: {
        sequence,
        preferences: {
          show_default_blocks: false,
        },
        ...(hideCards ? { hide: [{ method: 'card' }] } : {}),
      },
    },
  }
}

/** @deprecated Use buildRazorpayCheckoutOptions */
export function getRazorpayCheckoutDisplayConfig() {
  return buildRazorpayCheckoutOptions('rzp_test_').config
}

/** Razorpay expects E.164 for UPI intent / collect (India: +91 + 10 digits). */
export function razorpayPrefillContact(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10) return `+91${digits}`
  if (digits.length === 12 && digits.startsWith('91')) return `+${digits}`
  if (phone.trim().startsWith('+')) return phone.trim()
  return digits ? `+91${digits.slice(-10)}` : ''
}
