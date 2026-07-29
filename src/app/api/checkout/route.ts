import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { z } from 'zod'
import config from '@payload-config'

import { createRazorpayOrder, mapRazorpayErrorStatus, RazorpayConfigError } from '@/lib/razorpay/createOrder'
import { RAZORPAY_MIN_AMOUNT_PAISE } from '@/lib/razorpay/server'
import { computeOrderPricing } from '@/lib/orders/pricing'
import { getStorefrontSession } from '@/lib/auth/getStorefrontSession'
import { getStorefrontBundle } from '@/utilities/getStorefrontBundle'

const itemSchema = z.object({
  productId: z.union([z.string(), z.number()]).nullish(),
  slug: z.string().nullish(),
  sku: z.string().nullish(),
  name: z.string().min(1),
  variantSize: z.string().min(1),
  quantity: z.number().int().min(1),
  isSubscription: z.boolean().optional(),
  price: z.number().optional(), // client hint (fallback only)
})

const addressSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(10),
  line1: z.string().min(1),
  line2: z.string().optional(),
  landmark: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  pincode: z.string().min(6),
})

const billingSchema = z.object({
  name: z.string().optional(),
  line1: z.string().optional(),
  line2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
})

const bodySchema = z.object({
  items: z.array(itemSchema).min(1),
  address: addressSchema,
  billing: billingSchema.nullable().optional(),
  billingSameAsShipping: z.boolean().optional(),
  delivery: z.object({ method: z.string().optional(), leaveAtDoor: z.boolean().optional() }).optional(),
  promo: z.string().nullable().optional(),
})

/**
 * Checkout — recompute pricing server-side, create a Razorpay order, and
 * persist a PENDING Payload order (linked to the signed-in customer when
 * available). `/api/verify-payment` finalizes it after payment succeeds.
 */
export async function POST(req: NextRequest) {
  try {
    const parsed = bodySchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 })
    }
    const { items, address, billing, billingSameAsShipping, delivery, promo } = parsed.data

    const payload = await getPayload({ config })
    const [{ storefront, freeShippingThreshold }, session] = await Promise.all([
      getStorefrontBundle(),
      getStorefrontSession().catch(() => null),
    ])

    // Authoritative pricing (never trust the client total).
    const pricing = await computeOrderPricing(payload, {
      items: items.map((i) => ({ ...i, unitPrice: i.price })),
      deliveryMethodId: delivery?.method,
      leaveAtDoor: delivery?.leaveAtDoor,
      promoCode: promo,
      checkout: storefront.checkout,
      freeShippingThreshold,
    })

    const amountInPaise = Math.round(pricing.total * 100)
    if (amountInPaise < RAZORPAY_MIN_AMOUNT_PAISE) {
      return NextResponse.json({ error: 'Order total is below the minimum payable amount.' }, { status: 400 })
    }

    const orderRef = `PT-${Date.now()}`
    const razorpay = await createRazorpayOrder({
      amount: amountInPaise,
      currency: 'INR',
      receipt: orderRef,
      notes: { orderRef, customerEmail: address.email.slice(0, 255) },
    })

    const sameBilling = billingSameAsShipping !== false

    await payload.create({
      collection: 'orders',
      overrideAccess: true,
      data: {
        orderId: orderRef,
        razorpayOrderId: razorpay.order_id,
        ...(session?.customer?.id ? { customer: session.customer.id } : {}),
        customerName: address.name,
        customerEmail: address.email,
        customerPhone: address.phone,
        shippingAddress: {
          name: address.name,
          line1: address.line1,
          line2: address.line2 || '',
          landmark: address.landmark || '',
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          phone: address.phone,
        },
        billingSameAsShipping: sameBilling,
        billingAddress:
          sameBilling || !billing
            ? undefined
            : {
                name: billing.name || address.name,
                line1: billing.line1 || '',
                line2: billing.line2 || '',
                city: billing.city || '',
                state: billing.state || '',
                pincode: billing.pincode || '',
                phone: address.phone,
              },
        items: pricing.lineItems.map((l) => ({
          ...(l.product ? { product: l.product } : {}),
          productName: l.productName,
          variantSize: l.variantSize,
          sku: l.sku,
          imageUrl: l.imageUrl,
          quantity: l.quantity,
          unitPrice: l.unitPrice,
          lineTotal: l.lineTotal,
          isSubscription: l.isSubscription,
        })),
        subtotal: pricing.subtotal,
        discount: pricing.discount,
        ...(pricing.couponCode ? { couponCode: pricing.couponCode } : {}),
        shippingFee: pricing.shippingFee,
        ...(pricing.deliveryMethod ? { deliveryMethod: pricing.deliveryMethod } : {}),
        ...(pricing.deliveryDetails ? { deliveryDetails: pricing.deliveryDetails } : {}),
        total: pricing.total,
        paymentStatus: 'pending',
        status: 'pending',
        ...(delivery?.leaveAtDoor ? { notes: 'Customer requested: leave at the door if not home.' } : {}),
      },
    })

    return NextResponse.json({
      order_id: razorpay.order_id,
      amount: razorpay.amount,
      currency: razorpay.currency,
      key: razorpay.key,
      receipt: orderRef,
    })
  } catch (error) {
    if (error instanceof RazorpayConfigError) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    const status = (error as { status?: number }).status
    if (status === 400) {
      return NextResponse.json({ error: (error as Error).message }, { status: 400 })
    }
    console.error('[checkout]', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: mapRazorpayErrorStatus(error) })
  }
}
