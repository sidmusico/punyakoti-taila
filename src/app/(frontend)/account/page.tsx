import type { Metadata } from 'next'
import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'

import { Breadcrumb } from '@/components/shop/Breadcrumb'
import { Icons } from '@/components/ui/pt/Icons'
import { LogoutButton } from '@/components/shop/LogoutButton'
import { ReorderButton, type ReorderItem } from '@/components/shop/ReorderButton'
import { getStorefrontSession } from '@/lib/auth/getStorefrontSession'
import { getStorefrontBundle } from '@/utilities/getStorefrontBundle'
import type { Order, Product } from '@/payload-types'

export async function generateMetadata(): Promise<Metadata> {
  const { storefront } = await getStorefrontBundle()
  return { title: storefront.account?.metaTitle ?? 'My Account' }
}

/* ── Tabs (design: account sections with eyebrow + italic display headline) ── */

type TabId = 'overview' | 'orders' | 'subscriptions' | 'wishlist'

const TABS: Array<{ id: TabId; label: string; icon: 'user' | 'package' | 'heart' | 'refresh' }> = [
  { id: 'overview', label: 'Dashboard', icon: 'user' },
  { id: 'orders', label: 'Orders', icon: 'package' },
  { id: 'subscriptions', label: 'Subscriptions', icon: 'refresh' },
  { id: 'wishlist', label: 'Saved bottles', icon: 'heart' },
]

function formatPrice(n: number) {
  return `₹${Math.round(n).toLocaleString('en-IN')}`
}

function formatDate(iso?: string | null) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function NavIcon({ icon, size = 16 }: { icon?: string | null; size?: number }) {
  switch (icon) {
    case 'package': return <Icons.package size={size} />
    case 'heart': return <Icons.heart size={size} />
    case 'refresh': return <Icons.refresh size={size} />
    case 'pin': return <Icons.pin size={size} />
    case 'mail': return <Icons.mail size={size} />
    default: return <Icons.user size={size} />
  }
}

/* Status chip tones (design: mustard while moving, green when delivered, terra when off-path). */
function StatusChip({ status }: { status?: Order['status'] }) {
  const label = (status ?? 'pending').replace(/^\w/, (c) => c.toUpperCase())
  const tone =
    status === 'delivered'
      ? { background: 'var(--green-100)', color: 'var(--green-800)' }
      : status === 'cancelled' || status === 'returned'
        ? { background: 'var(--terra-100)', color: 'var(--terra-700)' }
        : { background: 'var(--mustard-100)', color: 'var(--mustard-700)' }
  return (
    <span className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider" style={tone}>
      {label}
    </span>
  )
}

function toReorderItems(order: Order): ReorderItem[] {
  return (order.items ?? []).map((i) => {
    const product = typeof i.product === 'object' && i.product ? (i.product as Product) : null
    return {
      productId: String(product?.id ?? i.product ?? i.sku ?? i.productName),
      slug: product?.slug ?? '',
      name: i.productName,
      variantSize: i.variantSize,
      sku: i.sku ?? i.productName,
      price: i.unitPrice,
      isSubscription: Boolean(i.isSubscription),
      quantity: i.quantity,
    }
  })
}

function OrderRow({ order }: { order: Order }) {
  const itemNames = (order.items ?? []).map((i) => i.productName).join(', ')
  const bottleCount = (order.items ?? []).reduce((s, i) => s + i.quantity, 0)
  const canReorder = order.status === 'delivered' || order.status === 'cancelled' || order.status === 'returned'
  return (
    <div
      className="flex flex-wrap items-center justify-between gap-4 rounded-2xl p-5"
      style={{ background: 'var(--cream-100)', border: '1px solid var(--cream-400)' }}
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2.5 text-xs" style={{ color: 'var(--ink-400)' }}>
          <span style={{ fontFamily: 'var(--font-mono)' }}>#{order.orderId}</span>
          <span>· {formatDate(order.createdAt)}</span>
          <StatusChip status={order.status} />
        </div>
        <div className="mt-1.5 truncate" style={{ fontFamily: 'var(--font-display)', fontSize: 19, color: 'var(--green-900)' }}>
          {itemNames || `${bottleCount} bottle${bottleCount === 1 ? '' : 's'}`}
        </div>
        <div className="mt-1 text-[13px]" style={{ color: 'var(--ink-500)' }}>
          {bottleCount} bottle{bottleCount === 1 ? '' : 's'} · <strong style={{ color: 'var(--green-900)' }}>{formatPrice(order.total)}</strong>
          {order.trackingNumber ? (
            <span> · {order.courierPartner ?? 'Tracking'} {order.trackingNumber}</span>
          ) : null}
        </div>
      </div>
      {canReorder && <ReorderButton items={toReorderItems(order)} />}
    </div>
  )
}

function EmptyState({
  icon, message, ctaLabel, ctaHref,
}: { icon: React.ReactNode; message: string; ctaLabel: string; ctaHref: string }) {
  return (
    <div
      className="flex flex-col items-center gap-3 rounded-2xl py-14 text-center"
      style={{ background: 'var(--cream-100)', border: '1px solid var(--cream-400)' }}
    >
      <span style={{ color: 'var(--ink-200)' }}>{icon}</span>
      <p className="text-sm" style={{ color: 'var(--ink-400)' }}>{message}</p>
      <Link
        href={ctaHref}
        className="mt-1 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors"
        style={{ background: 'var(--green-800)', color: 'var(--cream-100)' }}
      >
        {ctaLabel}
      </Link>
    </div>
  )
}

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const session = await getStorefrontSession()
  if (!session) redirect('/login')

  const sp = await searchParams
  const tab: TabId =
    sp.tab === 'orders'
      ? 'orders'
      : sp.tab === 'subscriptions'
        ? 'subscriptions'
        : sp.tab === 'wishlist'
          ? 'wishlist'
          : 'overview'

  const { customer, email, phone } = session
  const { storefront } = await getStorefrontBundle()
  const a = storefront.account
  const navItems = a?.navItems?.filter((n) => n.href && n.label) ?? []

  /* Live order data for this customer (depth 1 so reorder gets product slugs). */
  let orders: Order[] = []
  try {
    const payload = await getPayload({ config })
    const res = await payload.find({
      collection: 'orders',
      where: { customer: { equals: customer.id } },
      sort: '-createdAt',
      limit: 50,
      depth: 1,
      overrideAccess: true,
    })
    orders = res.docs as Order[]
  } catch {
    orders = []
  }

  const lifetimeOrders = orders.length
  const lifetimeBottles = orders.reduce(
    (s, o) => s + (o.items ?? []).reduce((x, i) => x + i.quantity, 0),
    0,
  )
  const lifetimeSpent = orders.reduce((s, o) => s + (o.total ?? 0), 0)
  const activeOrder = orders.find(
    (o) => !['delivered', 'cancelled', 'returned'].includes(o.status ?? ''),
  )

  /* Subscriptions — derived from `isSubscription` order lines (newest first,
     deduped per product+size). Becomes a managed list once a real
     subscriptions backend lands. */
  type ShelfItem = ReorderItem & { lastOrdered: string; deliveries: number }
  const shelf: ShelfItem[] = []
  for (const o of orders) {
    for (const i of o.items ?? []) {
      if (!i.isSubscription) continue
      const product = typeof i.product === 'object' && i.product ? (i.product as Product) : null
      const key = `${product?.id ?? i.product ?? i.sku}-${i.variantSize}`
      const existing = shelf.find((s) => `${s.productId}-${s.variantSize}` === key)
      if (existing) {
        existing.deliveries += 1
        continue
      }
      shelf.push({
        productId: String(product?.id ?? i.product ?? i.sku ?? i.productName),
        slug: product?.slug ?? '',
        name: i.productName,
        variantSize: i.variantSize,
        sku: i.sku ?? i.productName,
        price: i.unitPrice,
        isSubscription: true,
        quantity: i.quantity,
        lastOrdered: o.createdAt,
        deliveries: 1,
      })
    }
  }
  const subscriptionSpend = orders.reduce(
    (s, o) => s + (o.items ?? []).reduce((x, i) => x + (i.isSubscription ? i.lineTotal : 0), 0),
    0,
  )
  // Subscribe & save price is 15% below one-time — estimate what that saved.
  const subscriptionSavings = Math.round(subscriptionSpend * (15 / 85))

  const displayEmail = customer.email || email || '—'
  const displayPhone = customer.phone || phone || '—'
  const firstName = (customer.name || displayEmail).split(/[\s@]/)[0] || 'there'
  const memberSince = new Date(customer.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })

  const meta =
    tab === 'orders'
      ? { eyebrow: `${lifetimeOrders} lifetime · ${lifetimeBottles} bottles`, title: 'Your ', italic: 'orders.' }
      : tab === 'subscriptions'
        ? {
            eyebrow: shelf.length
              ? `${shelf.length} on your shelf · saving 15% per delivery`
              : 'Save 15% on every delivery',
            title: 'Your ',
            italic: 'shelf.',
          }
        : tab === 'wishlist'
          ? { eyebrow: 'Saved for later', title: 'Bottles you ', italic: 'noted.' }
          : { eyebrow: `Member since ${memberSince}`, title: 'Hello, ', italic: `${firstName}.` }

  const activeTabLabel = TABS.find((t) => t.id === tab)?.label

  const statCards = [
    { l: 'Orders', v: String(lifetimeOrders), s: 'lifetime' },
    { l: 'Bottles', v: String(lifetimeBottles), s: 'delivered' },
    { l: 'Spent', v: formatPrice(lifetimeSpent), s: 'with us' },
    { l: 'Member', v: memberSince.split(' ')[0] ?? '—', s: memberSince.split(' ')[1] ?? '' },
  ]

  return (
    <div className="pt-page-container pb-16">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          tab === 'overview' ? { label: 'Your account' } : { label: 'Your account', href: '/account' },
          ...(tab !== 'overview' && activeTabLabel ? [{ label: activeTabLabel }] : []),
        ]}
      />

      {/* eyebrow + display headline (design pattern) */}
      <div className="mb-8">
        <div className="pt-eyebrow">{meta.eyebrow}</div>
        <h1
          className="mt-2"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 400,
            fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
            lineHeight: 1,
            letterSpacing: '-0.02em',
            color: 'var(--green-900)',
            margin: 0,
          }}
        >
          {meta.title}
          <span className="pt-display-italic" style={{ color: 'var(--mustard-600)' }}>{meta.italic}</span>
        </h1>
      </div>

      <div className="grid md:grid-cols-[240px_1fr] gap-10 lg:gap-14 items-start">
        {/* ── Sidebar ─────────────────────────────────────────────────── */}
        <aside>
          <nav className="flex flex-col gap-1" aria-label="Account sections">
            {TABS.map((t) => {
              const active = t.id === tab
              const count =
                t.id === 'orders' && lifetimeOrders > 0
                  ? lifetimeOrders
                  : t.id === 'subscriptions' && shelf.length > 0
                    ? shelf.length
                    : null
              return (
                <Link
                  key={t.id}
                  href={t.id === 'overview' ? '/account' : `/account?tab=${t.id}`}
                  aria-current={active ? 'page' : undefined}
                  className="grid grid-cols-[16px_1fr_auto] items-center gap-3 rounded-xl px-3.5 py-3 text-sm transition-colors hover:bg-cream-300"
                  style={
                    active
                      ? { background: 'var(--cream-100)', color: 'var(--green-900)', fontWeight: 600, boxShadow: 'var(--sh-xs)' }
                      : { color: 'var(--ink-700)', fontWeight: 500 }
                  }
                >
                  <NavIcon icon={t.icon} />
                  <span>{t.label}</span>
                  {count != null && (
                    <span className="text-[11px]" style={{ fontFamily: 'var(--font-mono)', color: active ? 'var(--green-800)' : 'var(--ink-500)' }}>
                      {count}
                    </span>
                  )}
                </Link>
              )
            })}

            {/* CMS-managed extra links */}
            {navItems
              .filter(
                (n) =>
                  ![
                    '/account',
                    '/account/orders',
                    '/account/saved',
                    '/account/subscriptions',
                    '/account?tab=orders',
                    '/account?tab=subscriptions',
                    '/account?tab=wishlist',
                  ].includes(n.href ?? ''),
              )
              .map(({ href, label, icon }) => (
                <Link
                  key={href}
                  href={href!}
                  className="grid grid-cols-[16px_1fr] items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-colors hover:bg-cream-300"
                  style={{ color: 'var(--ink-700)' }}
                >
                  <span style={{ color: 'var(--green-700)' }}><NavIcon icon={icon} /></span>
                  {label}
                </Link>
              ))}

            <Link
              href="/account/profile"
              className="grid grid-cols-[16px_1fr] items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-colors hover:bg-cream-300"
              style={{ color: 'var(--ink-700)' }}
            >
              <Icons.user size={16} />
              Personal info
            </Link>

            <hr className="my-3" style={{ borderColor: 'var(--cream-400)' }} />
            <div className="px-1">
              <LogoutButton />
            </div>
          </nav>

          {/* subscribe teaser (design: dark tier card) */}
          <div className="mt-7 rounded-xl p-[18px]" style={{ background: 'var(--green-950)', color: 'var(--cream-100)' }}>
            <div className="pt-eyebrow" style={{ color: 'var(--mustard-400)' }}>Subscribe &amp; save</div>
            <div className="mt-1.5" style={{ fontFamily: 'var(--font-display)', fontSize: 22 }}>Never run out.</div>
            <p className="mt-1.5 text-xs leading-relaxed" style={{ color: 'rgba(245,239,224,0.6)' }}>
              15% off every delivery · pause or cancel anytime.
            </p>
            <Link
              href="/shop"
              className="mt-3 inline-block rounded-lg px-4 py-2 text-xs font-semibold transition-opacity hover:opacity-90"
              style={{ background: 'var(--mustard-500)', color: 'var(--green-950)' }}
            >
              Browse oils
            </Link>
          </div>
        </aside>

        {/* ── Main content ────────────────────────────────────────────── */}
        <div className="flex flex-col gap-8 min-w-0">
          {tab === 'overview' && (
            <>
              {/* stats row (design: 4 eyebrow stat cards) */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {statCards.map(({ l, v, s }) => (
                  <div key={l} className="rounded-2xl p-5" style={{ background: 'var(--cream-100)', border: '1px solid var(--cream-400)' }}>
                    <div className="pt-eyebrow">{l}</div>
                    <div className="mt-2" style={{ fontFamily: 'var(--font-display)', fontSize: 30, lineHeight: 1, color: 'var(--green-900)' }}>{v}</div>
                    <div className="mt-1.5 text-[11px] uppercase tracking-wider" style={{ color: 'var(--ink-400)' }}>{s}</div>
                  </div>
                ))}
              </div>

              {/* on its way */}
              {activeOrder && (
                <section>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 28, color: 'var(--green-900)', margin: '0 0 14px' }}>
                    On its way
                  </h2>
                  <OrderRow order={activeOrder} />
                </section>
              )}

              {/* profile card */}
              <div className="rounded-2xl p-6" style={{ background: 'var(--cream-100)', border: '1px solid var(--cream-400)' }}>
                <div className="mb-4 flex items-center justify-between">
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--green-900)', margin: 0 }}>
                    {a?.profileCardTitle ?? 'Profile'}
                  </h2>
                  <Link href="/account/profile" className="text-xs font-medium underline underline-offset-4" style={{ color: 'var(--green-700)' }}>
                    Edit
                  </Link>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { label: a?.labelName ?? 'Name', value: customer.name || '—' },
                    { label: a?.labelEmail ?? 'Email', value: displayEmail },
                    { label: 'Phone', value: displayPhone },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-xl p-4" style={{ background: 'var(--cream-200)' }}>
                      <div className="mb-1 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ink-400)' }}>{label}</div>
                      <div className="truncate text-sm font-medium" style={{ color: 'var(--ink-900)' }}>{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* recent orders */}
              <section>
                <div className="mb-4 flex items-baseline justify-between">
                  <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 28, color: 'var(--green-900)', margin: 0 }}>
                    {a?.ordersCardTitle ?? 'Recent orders'}
                  </h2>
                  {lifetimeOrders > 0 && (
                    <Link href="/account?tab=orders" className="text-sm underline underline-offset-4" style={{ color: 'var(--green-700)' }}>
                      {a?.viewAllOrdersLabel ?? 'View all'}
                    </Link>
                  )}
                </div>
                {lifetimeOrders === 0 ? (
                  <EmptyState
                    icon={<Icons.package size={32} />}
                    message={a?.emptyOrdersMessage ?? "You haven't placed an order yet."}
                    ctaLabel={a?.shopNowLabel ?? 'Shop now'}
                    ctaHref="/shop"
                  />
                ) : (
                  <div className="flex flex-col gap-3">
                    {orders.slice(0, 3).map((o) => <OrderRow key={o.id} order={o} />)}
                  </div>
                )}
              </section>
            </>
          )}

          {tab === 'orders' &&
            (lifetimeOrders === 0 ? (
              <EmptyState
                icon={<Icons.package size={36} />}
                message={a?.emptyOrdersMessage ?? "You haven't placed an order yet — your history will live here."}
                ctaLabel={a?.shopNowLabel ?? 'Shop now'}
                ctaHref="/shop"
              />
            ) : (
              <div className="flex flex-col gap-3">
                {orders.map((o) => <OrderRow key={o.id} order={o} />)}
              </div>
            ))}

          {tab === 'subscriptions' && (
            <>
              {/* dark stats band (design: "Your shelf") */}
              <div
                className="flex flex-wrap items-center gap-8 rounded-2xl px-7 py-6"
                style={{ background: 'var(--green-950)', color: 'var(--cream-100)' }}
              >
                {[
                  { l: 'On your shelf', v: String(shelf.length) },
                  { l: 'Spent on subscriptions', v: formatPrice(subscriptionSpend) },
                  { l: 'Saved at 15% off', v: subscriptionSavings > 0 ? `~${formatPrice(subscriptionSavings)}` : '—' },
                ].map(({ l, v }) => (
                  <div key={l} className="min-w-[120px]">
                    <div className="pt-eyebrow" style={{ color: 'var(--mustard-400)' }}>{l}</div>
                    <div className="mt-2" style={{ fontFamily: 'var(--font-display)', fontSize: 30, lineHeight: 1 }}>{v}</div>
                  </div>
                ))}
                <Link
                  href="/shop"
                  className="ml-auto rounded-lg px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
                  style={{ background: 'var(--mustard-500)', color: 'var(--green-950)' }}
                >
                  + Add a subscription
                </Link>
              </div>

              {shelf.length === 0 ? (
                <EmptyState
                  icon={<Icons.refresh size={36} />}
                  message="Nothing on your shelf yet. Choose “Subscribe & save” on any oil to get 15% off every delivery."
                  ctaLabel="Browse oils"
                  ctaHref="/shop"
                />
              ) : (
                <section>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 28, color: 'var(--green-900)', margin: '0 0 14px' }}>
                    Your shelf
                  </h2>
                  <div className="flex flex-col gap-3">
                    {shelf.map((s) => (
                      <div
                        key={`${s.productId}-${s.variantSize}`}
                        className="flex flex-wrap items-center justify-between gap-4 rounded-2xl p-5"
                        style={{ background: 'var(--cream-100)', border: '1px solid var(--cream-400)' }}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2.5 text-xs" style={{ color: 'var(--ink-400)' }}>
                            <span
                              className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                              style={{ background: 'var(--green-100)', color: 'var(--green-800)' }}
                            >
                              Subscribed
                            </span>
                            <span style={{ fontFamily: 'var(--font-mono)' }}>
                              Delivery #{s.deliveries}
                            </span>
                          </div>
                          <div className="mt-1.5 truncate" style={{ fontFamily: 'var(--font-display)', fontSize: 19, color: 'var(--green-900)' }}>
                            {s.name} · {s.variantSize}
                          </div>
                          <div className="mt-1 text-[13px]" style={{ color: 'var(--ink-500)' }}>
                            Last ordered {formatDate(s.lastOrdered)} ·{' '}
                            <strong style={{ color: 'var(--green-900)' }}>{formatPrice(s.price)}</strong> per delivery · 15% off
                          </div>
                        </div>
                        <ReorderButton items={[s]} />
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-xs" style={{ color: 'var(--ink-400)' }}>
                    Automatic deliveries with skip / pause controls are coming soon — for now, reorder your
                    shelf in one click at the same subscriber price.
                  </p>
                </section>
              )}
            </>
          )}

          {tab === 'wishlist' && (
            <EmptyState
              icon={<Icons.heart size={36} />}
              message="Nothing saved yet. Tap the heart on any bottle to keep it here."
              ctaLabel="Browse the collection"
              ctaHref="/shop"
            />
          )}
        </div>
      </div>
    </div>
  )
}
