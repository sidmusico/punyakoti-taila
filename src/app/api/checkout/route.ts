import { NextRequest, NextResponse } from 'next/server'

// NOTE: Install razorpay package: pnpm add razorpay
// import Razorpay from 'razorpay'

interface OrderItem {
  id: string; name: string; variantSize: string; price: number; quantity: number; sku: string
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { items: OrderItem[]; total: number; address: Record<string, string> }

    const amountInPaise = Math.round(body.total * 100)

    // Uncomment when razorpay package is installed:
    // const razorpay = new Razorpay({
    //   key_id: process.env.RAZORPAY_KEY_ID!,
    //   key_secret: process.env.RAZORPAY_KEY_SECRET!,
    // })
    // const order = await razorpay.orders.create({
    //   amount: amountInPaise,
    //   currency: 'INR',
    //   receipt: `PT-${Date.now()}`,
    //   notes: { customerEmail: body.address.email },
    // })
    // return NextResponse.json({
    //   orderId: order.id, amount: order.amount, currency: order.currency,
    //   key: process.env.RAZORPAY_KEY_ID,
    // })

    // ── Stub response for development ──
    return NextResponse.json({
      orderId: `order_dev_${Date.now()}`,
      amount: amountInPaise,
      currency: 'INR',
      key: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    })
  } catch (error) {
    console.error('[Checkout] Error:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
