import type { Payload } from 'payload'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { describe, it, beforeAll, afterAll, expect } from 'vitest'

import { computeOrderPricing } from '@/lib/orders/pricing'
import { finalizePaidOrder } from '@/lib/orders/finalizeOrder'
import {
  renderOrderConfirmationHtml,
  sendOrderConfirmationEmail,
} from '@/lib/email/sendOrderEmails'

/* A fake product so pricing is deterministic without touching the catalog. */
const FAKE_PRODUCT = {
  id: 101,
  title: 'Wood-Pressed Groundnut Oil',
  variants: [
    { size: '500ml', sku: 'PT-GN-500', price: 500, subscribePrice: 425 },
    { size: '1L', sku: 'PT-GN-1L', price: 900 },
  ],
}

const mockPayload = {
  findByID: async ({ id }: { id: number }) => (id === FAKE_PRODUCT.id ? FAKE_PRODUCT : null),
  find: async () => ({ docs: [] }),
} as unknown as Payload

const CHECKOUT_CFG = {
  deliveryMethods: [
    { methodId: 'standard', label: 'Standard', freeOverThreshold: true, fee: 99, etaMinDays: 4, etaMaxDays: 6 },
    { methodId: 'express', label: 'Express', freeOverThreshold: false, fee: 89, etaMinDays: 1, etaMaxDays: 1 },
  ],
}

describe('computeOrderPricing', () => {
  it('prices from the product variant, applies shipping under the threshold', async () => {
    const p = await computeOrderPricing(mockPayload, {
      items: [{ productId: '101', name: 'x', variantSize: '500ml', quantity: 1, unitPrice: 1 }],
      deliveryMethodId: 'standard',
      checkout: CHECKOUT_CFG as never,
      freeShippingThreshold: 999,
    })
    expect(p.lineItems[0]!.unitPrice).toBe(500) // server price, NOT the client hint of 1
    expect(p.subtotal).toBe(500)
    expect(p.shippingFee).toBe(99) // below ₹999 threshold
    expect(p.total).toBe(599)
    expect(p.deliveryMethod).toBe('Standard')
    expect(p.deliveryDetails?.methodId).toBe('standard')
    expect(p.deliveryDetails?.catalogFee).toBe(99)
    expect(p.deliveryDetails?.freeOverThreshold).toBe(true)
    expect(p.deliveryDetails?.etaLabel).toBeTruthy()
  })

  it('uses the subscribe price and gives free standard shipping over the threshold', async () => {
    const p = await computeOrderPricing(mockPayload, {
      items: [{ productId: '101', name: 'x', variantSize: '500ml', quantity: 3, isSubscription: true }],
      deliveryMethodId: 'standard',
      checkout: CHECKOUT_CFG as never,
      freeShippingThreshold: 999,
    })
    expect(p.lineItems[0]!.unitPrice).toBe(425) // subscribePrice
    expect(p.subtotal).toBe(1275)
    expect(p.shippingFee).toBe(0) // ≥ ₹999 → free
    expect(p.total).toBe(1275)
  })

  it('applies the WELCOME15 promo', async () => {
    const p = await computeOrderPricing(mockPayload, {
      items: [{ productId: '101', name: 'x', variantSize: '1L', quantity: 1 }],
      deliveryMethodId: 'express',
      promoCode: 'welcome15',
      checkout: CHECKOUT_CFG as never,
      freeShippingThreshold: 999,
    })
    expect(p.subtotal).toBe(900)
    expect(p.discount).toBe(135) // 15%
    expect(p.couponCode).toBe('WELCOME15')
    expect(p.shippingFee).toBe(89) // express flat fee
    expect(p.total).toBe(854) // 900 - 135 + 89
  })

  it('falls back to the client price when the product is unknown', async () => {
    const p = await computeOrderPricing(mockPayload, {
      items: [{ productId: '999', name: 'Ghost', variantSize: '500ml', quantity: 2, unitPrice: 250 }],
      checkout: CHECKOUT_CFG as never,
      freeShippingThreshold: 999,
    })
    expect(p.lineItems[0]!.unitPrice).toBe(250)
    expect(p.subtotal).toBe(500)
  })
})

describe('finalizePaidOrder (local DB)', () => {
  let payload: Payload
  let orderDbId: number | string
  const razorpayOrderId = `order_test_${Date.now()}`

  beforeAll(async () => {
    payload = await getPayload({ config: await config })
    const created = await payload.create({
      collection: 'orders',
      overrideAccess: true,
      data: {
        orderId: `PT-TEST-${Date.now()}`,
        razorpayOrderId,
        customerName: 'Test Buyer',
        customerEmail: 'buyer@example.com',
        shippingAddress: { name: 'Test Buyer', line1: '1 St', city: 'BLR', state: 'KA', pincode: '560001' },
        items: [{ productName: 'Groundnut 500ml', variantSize: '500ml', quantity: 1, unitPrice: 500, lineTotal: 500 }],
        subtotal: 500,
        total: 599,
        shippingFee: 99,
        paymentStatus: 'pending',
        status: 'pending',
      },
    })
    orderDbId = created.id
  })

  afterAll(async () => {
    if (orderDbId) await payload.delete({ collection: 'orders', id: orderDbId, overrideAccess: true }).catch(() => {})
  })

  it('marks the order paid + confirmed, then is idempotent', async () => {
    const first = await finalizePaidOrder(payload, {
      razorpayOrderId,
      razorpayPaymentId: 'pay_test_123',
      facts: { paymentMethod: 'upi', paymentStatus: 'paid' },
    })
    expect(first.newlyFinalized).toBe(true)
    expect(first.order?.paymentStatus).toBe('paid')
    expect(first.order?.status).toBe('confirmed')
    expect(first.order?.razorpayPaymentId).toBe('pay_test_123')
    expect(first.order?.paymentMethod).toBe('upi')

    const second = await finalizePaidOrder(payload, {
      razorpayOrderId,
      razorpayPaymentId: 'pay_test_123',
      facts: { paymentStatus: 'paid' },
    })
    expect(second.newlyFinalized).toBe(false) // no double-processing
  })

  it('returns null for an unknown order', async () => {
    const r = await finalizePaidOrder(payload, {
      razorpayOrderId: 'order_does_not_exist',
      razorpayPaymentId: 'pay_x',
      facts: { paymentStatus: 'paid' },
    })
    expect(r.order).toBeNull()
  })
})

describe('order confirmation email', () => {
  const data = {
    orderId: 'PT-123',
    customerName: 'Priya',
    customerEmail: 'priya@example.com',
    items: [{ productName: 'Groundnut Oil', variantSize: '500ml', quantity: 2, lineTotal: 1000 }],
    subtotal: 1000,
    total: 1099,
    shippingFee: 99,
  }

  it('renders branded HTML with the order id + total', () => {
    const html = renderOrderConfirmationHtml(data)
    expect(html).toContain('PT-123')
    expect(html).toContain('₹1,099')
    expect(html).toContain('Groundnut Oil')
  })

  it('skips sending when RESEND_API_KEY is absent (never sends in tests)', async () => {
    const saved = process.env.RESEND_API_KEY
    delete process.env.RESEND_API_KEY
    const res = await sendOrderConfirmationEmail(data)
    expect(res.skipped).toBe(true)
    if (saved) process.env.RESEND_API_KEY = saved
  })
})
