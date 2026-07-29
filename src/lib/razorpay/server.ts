import crypto from 'crypto'

import Razorpay from 'razorpay'

export const RAZORPAY_MIN_AMOUNT_PAISE = 100

export class RazorpayConfigError extends Error {
  readonly status = 401
  constructor(message = 'Razorpay credentials are not configured') {
    super(message)
    this.name = 'RazorpayConfigError'
  }
}

/** Public key for Checkout.js — never expose KEY_SECRET to the client. */
export function getRazorpayKeyId(): string {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim() || process.env.RAZORPAY_KEY_ID?.trim()
  if (!keyId) {
    throw new RazorpayConfigError('Set RAZORPAY_KEY_ID or NEXT_PUBLIC_RAZORPAY_KEY_ID')
  }
  return keyId
}

export function getRazorpayClient(): Razorpay {
  const key_id = process.env.RAZORPAY_KEY_ID?.trim()
  const key_secret = process.env.RAZORPAY_KEY_SECRET?.trim()
  if (!key_id || !key_secret) {
    throw new RazorpayConfigError('Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET')
  }
  return new Razorpay({ key_id, key_secret })
}

export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string,
): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET?.trim()
  if (!secret || !orderId || !paymentId || !signature) {
    return false
  }
  const expected = crypto.createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest('hex')
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
  } catch {
    return false
  }
}

export function mapRazorpayErrorStatus(err: unknown): number {
  if (err instanceof RazorpayConfigError) return err.status
  const statusCode = (err as { statusCode?: number })?.statusCode
  if (statusCode === 401) return 401
  return 500
}
