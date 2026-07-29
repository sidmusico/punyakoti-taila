import crypto from 'crypto'
import { describe, expect, it, beforeEach, afterEach } from 'vitest'

import { verifyPaymentSignature } from '@/lib/razorpay/server'

describe('verifyPaymentSignature', () => {
  const secret = 'test_secret_key'
  const orderId = 'order_test123'
  const paymentId = 'pay_test456'

  beforeEach(() => {
    process.env.RAZORPAY_KEY_SECRET = secret
  })

  afterEach(() => {
    delete process.env.RAZORPAY_KEY_SECRET
  })

  it('returns true for a valid HMAC signature', () => {
    const signature = crypto
      .createHmac('sha256', secret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex')

    expect(verifyPaymentSignature(orderId, paymentId, signature)).toBe(true)
  })

  it('returns false when signature does not match', () => {
    expect(verifyPaymentSignature(orderId, paymentId, 'invalid_signature')).toBe(false)
  })
})
