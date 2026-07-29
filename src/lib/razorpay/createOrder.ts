import {
  getRazorpayClient,
  getRazorpayKeyId,
  RAZORPAY_MIN_AMOUNT_PAISE,
  RazorpayConfigError,
  mapRazorpayErrorStatus,
} from '@/lib/razorpay/server'

export type CreateRazorpayOrderInput = {
  amount: number
  currency?: string
  receipt?: string
  notes?: Record<string, string>
}

export type CreateRazorpayOrderResult = {
  order_id: string
  orderId: string
  amount: number
  currency: string
  key: string
  checkout_config_id?: string
}

export async function createRazorpayOrder(
  input: CreateRazorpayOrderInput,
): Promise<CreateRazorpayOrderResult> {
  const amount = Math.round(input.amount)
  if (!Number.isFinite(amount) || amount < RAZORPAY_MIN_AMOUNT_PAISE) {
    const err = new Error(`amount must be at least ${RAZORPAY_MIN_AMOUNT_PAISE} paise`)
    ;(err as { status?: number }).status = 400
    throw err
  }

  const currency = (input.currency || 'INR').toUpperCase()
  const receipt = input.receipt || `PT-${Date.now()}`

  const checkoutConfigId = process.env.RAZORPAY_CHECKOUT_CONFIG_ID?.trim()

  const razorpay = getRazorpayClient()
  const order = await razorpay.orders.create({
    amount,
    currency,
    receipt,
    notes: input.notes,
    ...(checkoutConfigId ? { checkout_config_id: checkoutConfigId } : {}),
  })

  return {
    order_id: order.id,
    orderId: order.id,
    amount: Number(order.amount),
    currency: order.currency,
    key: getRazorpayKeyId(),
    ...(checkoutConfigId ? { checkout_config_id: checkoutConfigId } : {}),
  }
}

export { RazorpayConfigError, mapRazorpayErrorStatus }
