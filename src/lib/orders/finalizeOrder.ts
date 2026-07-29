import type { Payload } from 'payload'

import { orderToEmailData, sendOrderConfirmationEmail } from '@/lib/email/sendOrderEmails'
import type { Order } from '@/payload-types'

export type PaymentFacts = {
  paymentMethod?: 'upi' | 'card' | 'netbanking' | 'paylater' | 'cod'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
}

/**
 * Mark the pending order (matched by Razorpay order id) as paid + confirmed.
 * Idempotent: a second call for an already-paid order is a no-op, so payment
 * retries / duplicate webhook deliveries never double-process.
 */
export async function finalizePaidOrder(
  payload: Payload,
  args: { razorpayOrderId: string; razorpayPaymentId: string; facts: PaymentFacts },
): Promise<{ order: Order | null; newlyFinalized: boolean }> {
  const res = await payload.find({
    collection: 'orders',
    where: { razorpayOrderId: { equals: args.razorpayOrderId } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const existing = res.docs[0] as Order | undefined
  if (!existing) return { order: null, newlyFinalized: false }
  if (existing.paymentStatus === 'paid') return { order: existing, newlyFinalized: false }

  const updated = await payload.update({
    collection: 'orders',
    id: existing.id,
    overrideAccess: true,
    depth: 1,
    context: { skipOrderEmails: true },
    data: {
      razorpayPaymentId: args.razorpayPaymentId,
      paymentStatus: args.facts.paymentStatus,
      status: args.facts.paymentStatus === 'paid' ? 'confirmed' : existing.status,
      ...(args.facts.paymentMethod ? { paymentMethod: args.facts.paymentMethod } : {}),
    },
  })

  const order = updated as Order

  if (args.facts.paymentStatus === 'paid') {
    const emailResult = await sendOrderConfirmationEmail(orderToEmailData(order), payload)
    if (emailResult.sent) {
      payload.logger.info(`[email] order confirmation sent for ${order.orderId}`)
    } else if (emailResult.skipped) {
      payload.logger.warn(`[email] order confirmation skipped for ${order.orderId} (RESEND_API_KEY?)`)
    } else {
      payload.logger.error(
        `[email] order confirmation failed for ${order.orderId}: ${emailResult.error ?? 'unknown'}`,
      )
    }
  }

  return { order, newlyFinalized: true }
}
