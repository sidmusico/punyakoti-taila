import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      razorpay_order_id: string
      razorpay_payment_id: string
      razorpay_signature: string
      address: {
        name: string; email: string; phone: string
        line1: string; line2?: string; city: string; state: string; pincode: string
      }
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, address } = body

    // ── Verify signature ──────────────────────────────────────────────
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // ── Create order in Payload CMS ───────────────────────────────────
    const payload = await getPayload({ config: configPromise })
    const orderId = `PT-${Date.now()}`

    await payload.create({
      collection: 'orders',
      data: {
        orderId,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        customerName: address.name,
        customerEmail: address.email,
        customerPhone: address.phone,
        shippingAddress: {
          name: address.name,
          line1: address.line1,
          line2: address.line2 || '',
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          phone: address.phone,
        },
        items: [{ product: null as unknown as number, productName: 'Order via API', variantSize: '500ml', quantity: 1, unitPrice: 0, lineTotal: 0 }],
        subtotal: 0,
        total: 0,
        paymentMethod: 'upi',
        paymentStatus: 'paid',
        status: 'confirmed',
      },
    })

    return NextResponse.json({ success: true, orderId })
  } catch (error) {
    console.error('[Webhook] Error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
