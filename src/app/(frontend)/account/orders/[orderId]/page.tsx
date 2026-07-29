import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'

import { Breadcrumb } from '@/components/shop/Breadcrumb'
import { OrderLineItems, orderDocToLineRows } from '@/components/shop/OrderLineItems'
import { StatusChip } from '@/components/shop/OrderStatusChip'
import { getStorefrontSession } from '@/lib/auth/getStorefrontSession'
import type { Order } from '@/payload-types'

const rupee = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`

function formatDate(iso?: string | null) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ orderId: string }>
}): Promise<Metadata> {
  const { orderId } = await params
  return { title: `Order ${decodeURIComponent(orderId)}` }
}

export default async function AccountOrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>
}) {
  const session = await getStorefrontSession()
  if (!session) redirect('/login')

  const { orderId: rawId } = await params
  const orderId = decodeURIComponent(rawId)

  const payload = await getPayload({ config })
  const res = await payload.find({
    collection: 'orders',
    where: {
      and: [{ orderId: { equals: orderId } }, { customer: { equals: session.customer.id } }],
    },
    limit: 1,
    depth: 1,
    overrideAccess: true,
  })

  const order = res.docs[0] as Order | undefined
  if (!order) notFound()

  const items = orderDocToLineRows(order)
  const a = order.shippingAddress
  const paymentLabel =
    order.paymentMethod &&
    { upi: 'UPI', card: 'Card', netbanking: 'Net banking', paylater: 'Pay later', cod: 'Cash on delivery' }[
      order.paymentMethod
    ]

  return (
    <div className="pt-page-container pb-16">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Your account', href: '/account' },
          { label: 'Orders', href: '/account?tab=orders' },
          { label: order.orderId },
        ]}
      />

      <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs" style={{ color: 'var(--ink-400)' }}>
            <span style={{ fontFamily: 'var(--font-mono)' }}>#{order.orderId}</span>
            <span>· {formatDate(order.createdAt)}</span>
            <StatusChip status={order.status} />
          </div>
          <h1
            className="mt-2"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 400,
              fontSize: 'clamp(1.75rem, 3vw, 2.4rem)',
              color: 'var(--green-900)',
            }}
          >
            Order details
          </h1>
        </div>
        <Link
          href="/account?tab=orders"
          className="text-sm font-medium"
          style={{ color: 'var(--green-800)' }}
        >
          ← All orders
        </Link>
      </div>

      <div className="mt-8 grid lg:grid-cols-[1fr_min(380px,34vw)] gap-8 lg:gap-10 items-start">
        <section
          className="rounded-2xl p-6"
          style={{ background: 'var(--cream-100)', border: '1px solid var(--cream-400)' }}
        >
          <h2 className="text-[11px] uppercase tracking-[0.18em] mb-4" style={{ color: 'var(--ink-500)' }}>
            Items
          </h2>
          <OrderLineItems items={items} />
        </section>

        <aside
          className="rounded-2xl p-6 lg:sticky lg:top-20"
          style={{ background: 'var(--cream-100)', border: '1px solid var(--cream-400)' }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-[0.18em]" style={{ color: 'var(--ink-500)' }}>
              Summary
            </span>
            <span
              className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
              style={{ background: 'var(--green-100)', color: 'var(--green-800)' }}
            >
              {order.paymentStatus === 'paid' ? 'Paid' : order.paymentStatus}
            </span>
          </div>
          <div className="mt-4 flex flex-col gap-1.5 text-sm" style={{ color: 'var(--ink-500)' }}>
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{rupee(order.subtotal)}</span>
            </div>
            {order.discount ? (
              <div className="flex justify-between" style={{ color: 'var(--green-700)' }}>
                <span>Discount</span>
                <span>− {rupee(order.discount)}</span>
              </div>
            ) : null}
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{(order.shippingFee ?? 0) === 0 ? 'Free' : rupee(order.shippingFee ?? 0)}</span>
            </div>
          </div>
          <div className="mt-3 flex justify-between border-t pt-3" style={{ borderColor: 'var(--cream-400)' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--green-900)' }}>Total</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--green-900)' }}>
              {rupee(order.total)}
            </span>
          </div>
          {a ? (
            <div className="mt-5 text-xs" style={{ color: 'var(--ink-500)' }}>
              <div className="mb-1 uppercase tracking-wider" style={{ color: 'var(--ink-400)' }}>
                Shipping to
              </div>
              <div style={{ color: 'var(--ink-700)' }}>
                {[a.name, a.line1, a.line2, `${a.city} ${a.pincode}`].filter(Boolean).join(', ')}
              </div>
            </div>
          ) : null}
          {paymentLabel ? (
            <div className="mt-4 text-xs" style={{ color: 'var(--ink-500)' }}>
              <div className="mb-1 uppercase tracking-wider" style={{ color: 'var(--ink-400)' }}>
                Payment
              </div>
              <div style={{ color: 'var(--ink-700)' }}>{paymentLabel}</div>
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  )
}
