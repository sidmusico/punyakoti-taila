import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { z } from 'zod'

import { getRazorpayClient, verifyPaymentSignature } from '@/lib/razorpay/server'
import { finalizePaidOrder } from '@/lib/orders/finalizeOrder'
import configPromise from '@payload-config'

/** Razorpay payment method → our Orders enum (unknown methods left unset). */
function mapPaymentMethod(method?: string): 'upi' | 'card' | 'netbanking' | 'paylater' | 'cod' | undefined {
  switch (method) {
    case 'upi':
    case 'card':
    case 'netbanking':
    case 'paylater':
      return method
    default:
      return undefined
  }
}

/** Razorpay payment status → our Orders paymentStatus enum. */
function mapPaymentStatus(status?: string): 'pending' | 'paid' | 'failed' | 'refunded' {
  switch (status) {
    case 'captured':
    case 'authorized':
      return 'paid'
    case 'refunded':
      return 'refunded'
    case 'failed':
      return 'failed'
    default:
      return 'paid' // signature verified + handler fired ⇒ treat as paid
  }
}

async function fetchPaymentFacts(paymentId: string): Promise<{
  paymentMethod: ReturnType<typeof mapPaymentMethod>
  paymentStatus: ReturnType<typeof mapPaymentStatus>
}> {
  try {
    const payment = await getRazorpayClient().payments.fetch(paymentId)
    return { paymentMethod: mapPaymentMethod(payment.method), paymentStatus: mapPaymentStatus(payment.status) }
  } catch (err) {
    console.error('[verify-payment] could not fetch payment:', err)
    return { paymentMethod: undefined, paymentStatus: 'paid' }
  }
}

const verifySchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
})

/**
 * Verify the Razorpay signature (HMAC-SHA256) and finalize the pending order.
 * Order confirmation email is sent from finalizePaidOrder via Resend.
 */
export async function POST(req: NextRequest) {
  try {
    const parsed = verifySchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Missing or invalid payment fields', details: parsed.error.flatten() },
        { status: 400 },
      )
    }
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data

    if (!verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
      return NextResponse.json({ error: 'Invalid signature', success: false }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })
    const facts = await fetchPaymentFacts(razorpay_payment_id)

    const { order, newlyFinalized } = await finalizePaidOrder(payload, {
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      facts,
    })

    if (!order) {
      // Should not happen — /api/checkout always creates the pending order first.
      console.error('[verify-payment] no pending order for', razorpay_order_id)
      return NextResponse.json({ success: true, orderId: null })
    }

    if (newlyFinalized) {
      payload.logger.info(`[verify-payment] finalized ${order.orderId}`)
    }

    return NextResponse.json({ success: true, orderId: order.orderId, ref: razorpay_order_id })
  } catch (error) {
    console.error('[verify-payment]', error)
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 })
  }
}
