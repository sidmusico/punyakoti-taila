import type { Payload } from 'payload'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

import * as resendSend from '@/lib/email/resendSend'

describe('notifyOrderEmails hook', () => {
  let payload: Payload
  let orderDbId: number | string
  const orderId = `PT-EMAIL-HOOK-${Date.now()}`

  beforeAll(async () => {
    payload = await getPayload({ config: await config })
    const created = await payload.create({
      collection: 'orders',
      overrideAccess: true,
      data: {
        orderId,
        customerName: 'Email Hook Test',
        customerEmail: 'hook-test@example.com',
        shippingAddress: { name: 'Email Hook Test', line1: '1 St', city: 'BLR', state: 'KA', pincode: '560001' },
        items: [{ productName: 'Sesame Oil', variantSize: '500ml', quantity: 1, unitPrice: 500, lineTotal: 500 }],
        subtotal: 500,
        total: 599,
        shippingFee: 99,
        paymentStatus: 'paid',
        status: 'confirmed',
      },
    })
    orderDbId = created.id
  })

  afterAll(async () => {
    if (orderDbId) {
      await payload.delete({ collection: 'orders', id: orderDbId, overrideAccess: true }).catch(() => {})
    }
  })

  it('calls Resend when status changes to packed, shipped, and returned', async () => {
    const sendSpy = vi.spyOn(resendSend, 'sendResendEmail').mockResolvedValue({ sent: true })

    await payload.update({
      collection: 'orders',
      id: orderDbId,
      overrideAccess: true,
      data: { status: 'packed' },
    })
    await payload.update({
      collection: 'orders',
      id: orderDbId,
      overrideAccess: true,
      data: { status: 'shipped', trackingNumber: 'TRK-99', courierPartner: 'Delhivery' },
    })
    await payload.update({
      collection: 'orders',
      id: orderDbId,
      overrideAccess: true,
      data: { status: 'returned' },
    })

    const subjects = sendSpy.mock.calls.map((c) => c[0].subject)
    expect(subjects.some((s) => /packed/i.test(s))).toBe(true)
    expect(subjects.some((s) => /shipped/i.test(s))).toBe(true)
    expect(subjects.some((s) => /return/i.test(s))).toBe(true)

    sendSpy.mockRestore()
  })

  it('sends shipped email when tracking is added while status stays packed (auto-promotes to shipped)', async () => {
    const orderId2 = `PT-TRACK-${Date.now()}`
    const created = await payload.create({
      collection: 'orders',
      overrideAccess: true,
      data: {
        orderId: orderId2,
        customerName: 'Track Test',
        customerEmail: 'track-test@example.com',
        shippingAddress: { name: 'T', line1: '1 St', city: 'BLR', state: 'KA', pincode: '560001' },
        items: [{ productName: 'Oil', variantSize: '500ml', quantity: 1, unitPrice: 500, lineTotal: 500 }],
        subtotal: 500,
        total: 599,
        shippingFee: 99,
        paymentStatus: 'paid',
        status: 'packed',
      },
    })

    const sendSpy = vi.spyOn(resendSend, 'sendResendEmail').mockResolvedValue({ sent: true })

    const updated = await payload.update({
      collection: 'orders',
      id: created.id,
      overrideAccess: true,
      data: { trackingNumber: 'AWB-123', courierPartner: 'Delhivery' },
    })

    expect(updated.status).toBe('shipped')
    const subjects = sendSpy.mock.calls.map((c) => c[0].subject)
    expect(subjects.some((s) => /shipped/i.test(s))).toBe(true)

    sendSpy.mockRestore()
    await payload.delete({ collection: 'orders', id: created.id, overrideAccess: true }).catch(() => {})
  })
})
