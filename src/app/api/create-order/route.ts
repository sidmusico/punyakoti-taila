import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import {
  createRazorpayOrder,
  mapRazorpayErrorStatus,
  RazorpayConfigError,
} from '@/lib/razorpay/createOrder'
import { RAZORPAY_MIN_AMOUNT_PAISE } from '@/lib/razorpay/server'

const bodySchema = z.object({
  amount: z.number().int().min(RAZORPAY_MIN_AMOUNT_PAISE),
  currency: z.string().min(3).max(3).optional(),
  receipt: z.string().max(40).optional(),
})

/**
 * Razorpay Standard Checkout — create order (amount in paise).
 * POST /api/create-order
 */
export async function POST(req: NextRequest) {
  try {
    const json: unknown = await req.json()
    const parsed = bodySchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 },
      )
    }

    const result = await createRazorpayOrder(parsed.data)
    return NextResponse.json({
      order_id: result.order_id,
      amount: result.amount,
      currency: result.currency,
      key: result.key,
    })
  } catch (error) {
    if (error instanceof RazorpayConfigError) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    const status = (error as { status?: number }).status
    if (status === 400) {
      return NextResponse.json({ error: (error as Error).message }, { status: 400 })
    }
    console.error('[create-order]', error)
    return NextResponse.json({ error: 'Failed to create Razorpay order' }, { status: mapRazorpayErrorStatus(error) })
  }
}
