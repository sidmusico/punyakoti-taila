'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCartHydrated, useCartStore } from '@/store/cart'
import { Breadcrumb } from '@/components/shop/Breadcrumb'
import { Icons } from '@/components/ui/pt/Icons'
import { useStorefrontBundle } from '@/providers/StorefrontCopyProvider'
import type { StorefrontMerged } from '@/utilities/getStorefrontBundle'

function formatPrice(n: number) {
  return `₹${n.toLocaleString('en-IN')}`
}

function interpolate(template: string, vars: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`)
}

export function CartPageView({
  cartPage,
  heroImageUrl,
}: {
  cartPage?: StorefrontMerged['cartPage'] | null
  heroImageUrl?: string | null
}) {
  const { storefront, freeShippingThreshold } = useStorefrontBundle()
  const d = storefront.cartDrawer ?? {}
  const c = cartPage ?? storefront.cartPage ?? {}
  const { items, removeItem, updateQty, total, itemCount, clearCart } = useCartStore()
  const cartHydrated = useCartHydrated()
  const grandTotal = total()
  const count = itemCount()
  const totalSavings = items.reduce(
    (sum, i) => sum + (i.mrp && i.mrp > i.price ? (i.mrp - i.price) * i.quantity : 0),
    0,
  )
  const [promoCode, setPromoCode] = useState('')
  const [promoMessage, setPromoMessage] = useState<string | null>(null)
  const flatShip =
    typeof d?.flatShippingAmount === 'number' && !Number.isNaN(d.flatShippingAmount)
      ? d.flatShippingAmount
      : 99
  const remaining = Math.max(0, freeShippingThreshold - grandTotal)
  const shipPaid = grandTotal + (grandTotal >= freeShippingThreshold ? 0 : flatShip)

  const checkoutHref = c?.checkoutHref ?? '/checkout'
  const continueHref = c?.continueShoppingHref ?? '/shop'

  const bottleWord =
    count === 1 ? (c?.bottleWordSingular ?? 'bottle') : (c?.bottleWordPlural ?? 'bottles')
  const subtotalLine =
    c?.subtotalLineTemplate && c.subtotalLineTemplate.trim()
      ? interpolate(c.subtotalLineTemplate, {
          count: String(count),
          bottleWord,
        })
      : (d?.subtotalLabel ?? 'Subtotal')

  const showSplitHeadline =
    Boolean(c?.headlineLineBeforeItalic?.trim()) || Boolean(c?.headlineItalic?.trim())

  return (
    <div className="pt-page-container pb-28 lg:pb-16">
      <Breadcrumb
        items={[
          { label: c?.breadcrumbHomeLabel ?? 'Home', href: c?.breadcrumbHomeHref ?? '/' },
          { label: c?.breadcrumbCurrentLabel ?? 'Basket' },
        ]}
      />

      {heroImageUrl ? (
        <div className="relative w-full max-h-[140px] overflow-hidden rounded-2xl">
          <Image
            src={heroImageUrl}
            alt=""
            width={1440}
            height={400}
            className="w-full h-[110px] md:h-[140px] object-cover"
            sizes="100vw"
          />
        </div>
      ) : null}

      {!cartHydrated ? null : items.length === 0 ? (
        <div className="mt-8 rounded-2xl p-12 text-center max-w-lg mx-auto" style={{ background: 'var(--cream-100)', border: '1px solid var(--cream-400)' }}>
          <Icons.bag size={40} style={{ color: 'var(--ink-300)', margin: '0 auto 16px' }} />
          <p className="font-medium" style={{ color: 'var(--ink-500)' }}>{d?.emptyTitle}</p>
          <p className="text-sm mt-1" style={{ color: 'var(--ink-400)' }}>{d?.emptySubtitle}</p>
          <Link
            href={continueHref}
            className="mt-6 inline-flex px-6 py-3 rounded-xl text-sm font-medium transition-colors"
            style={{ background: 'var(--green-800)', color: 'var(--cream-100)' }}
          >
            {d?.browseButtonLabel}
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-5 lg:mt-6 grid lg:grid-cols-[1fr_min(380px,34vw)] gap-10 lg:gap-14 items-start">
            <div>
              <div className="text-[11px] uppercase tracking-[0.18em]" style={{ color: 'var(--ink-500)' }}>
                {c?.listingEyebrow}
              </div>
              <h1
                className="mt-2"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 400,
                  fontSize: 'clamp(1.9rem, 3.5vw, 2.6rem)',
                  lineHeight: 1.05,
                  letterSpacing: '-0.02em',
                  color: 'var(--green-900)',
                }}
              >
                {showSplitHeadline ? (
                  <>
                    {c?.headlineLineBeforeItalic}
                    {c?.headlineItalic ? (
                      <span className="pt-display-italic" style={{ color: 'var(--mustard-600)' }}>
                        {c.headlineItalic}
                      </span>
                    ) : null}
                    {c?.headlineLineAfterItalic}
                  </>
                ) : (
                  c?.headline
                )}
              </h1>
              {c?.subhead ? (
                <p className="mt-3 text-base max-w-xl" style={{ color: 'var(--ink-500)' }}>
                  {c.subhead}
                </p>
              ) : null}

              <div className="mt-5 flex flex-col">
                {items.map((item, idx) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[64px_1fr_auto] sm:grid-cols-[76px_1fr_auto] gap-3 sm:gap-5 py-3.5 items-center border-b border-[var(--cream-400)]"
                    style={idx === 0 ? { borderTop: '1px solid var(--cream-400)' } : undefined}
                  >
                    <Link
                      href={`/shop/${item.slug}`}
                      className="rounded-xl grid place-items-center aspect-[5/6] max-h-[90px] overflow-hidden"
                      style={{ background: 'var(--cream-100)' }}
                      tabIndex={-1}
                      aria-hidden
                    >
                      {item.image ? (
                        <Image src={item.image} alt="" width={100} height={120} className="object-cover w-full h-full rounded-xl transition-transform duration-300 hover:scale-105" />
                      ) : (
                        <Icons.drop size={28} style={{ color: 'var(--wood-500)' }} />
                      )}
                    </Link>
                    <div className="min-w-0">
                      <Link
                        href={`/shop/${item.slug}`}
                        className="font-medium leading-snug hover:underline"
                        style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'var(--green-900)' }}
                      >
                        {item.name}
                      </Link>
                      <div className="mt-0.5 text-[13px] flex flex-wrap items-center gap-2" style={{ color: 'var(--ink-500)' }}>
                        <span>{item.variantSize}</span>
                        {item.isSubscription && d?.subscribePillLabel ? (
                          <span
                            className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                            style={{ background: 'var(--green-100)', color: 'var(--green-800)' }}
                          >
                            {d.subscribePillLabel}
                          </span>
                        ) : item.isSubscription ? (
                          <span>{d?.subscribeSuffix}</span>
                        ) : null}
                      </div>
                      <div className="mt-1.5 flex flex-wrap items-center gap-4 text-[13px]" style={{ color: 'var(--ink-500)' }}>
                        {c?.saveForLaterLabel?.trim() ? (
                          <Link href={c?.saveForLaterHref ?? '#'} className="border-b border-[var(--ink-400)] pb-px hover:opacity-80">
                            {c.saveForLaterLabel}
                          </Link>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="border-b border-[var(--ink-400)] pb-px bg-transparent border-0 cursor-pointer p-0 font-inherit hover:opacity-80"
                          style={{ color: 'var(--ink-500)' }}
                        >
                          {d?.removeLineLabel}
                        </button>
                      </div>
                    </div>
                    <div className="text-right self-start sm:self-center">
                      <div
                        className="inline-flex items-center rounded-lg border overflow-hidden"
                        style={{ borderColor: 'var(--cream-400)', background: 'var(--cream-100)', flex: '0 0 auto' }}
                      >
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                          className="grid place-items-center bg-transparent border-0 cursor-pointer"
                          style={{ color: 'var(--green-900)', width: 32, height: 32, padding: 0, flex: '0 0 auto' }}
                          aria-label="Decrease quantity"
                        >
                          <Icons.minus size={12} />
                        </button>
                        <span className="text-center text-sm font-semibold" style={{ width: 30, flex: '0 0 auto' }}>
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          className="grid place-items-center bg-transparent border-0 cursor-pointer"
                          style={{ color: 'var(--green-900)', width: 32, height: 32, padding: 0, flex: '0 0 auto' }}
                          aria-label="Increase quantity"
                        >
                          <Icons.plus size={12} />
                        </button>
                      </div>
                      <div className="mt-1.5">
                        {item.mrp && item.mrp > item.price ? (
                          <div className="text-xs line-through" style={{ color: 'var(--ink-300)' }}>
                            {formatPrice(item.mrp * item.quantity)}
                          </div>
                        ) : null}
                        <div className="text-base font-semibold" style={{ color: 'var(--green-900)' }}>
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Clear basket — subtle, with confirm */}
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Remove all items from your basket?')) clearCart()
                  }}
                  className="text-xs transition-opacity hover:opacity-70"
                  style={{ color: 'var(--ink-400)' }}
                >
                  Clear basket
                </button>
              </div>

              {/* Free shipping progress (matches design cart-checkout.jsx) */}
              <div
                className="mt-4 rounded-xl px-4 py-4 flex gap-3 items-start"
                style={{ background: 'var(--green-100)' }}
              >
                <Icons.truck size={20} className="shrink-0 mt-0.5" style={{ color: 'var(--green-800)' }} />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold" style={{ color: 'var(--green-900)' }}>
                    {remaining > 0
                      ? interpolate(d?.freeShippingProgress ?? '', { remaining: formatPrice(remaining) })
                      : (d?.freeShippingUnlocked ?? '')}
                  </div>
                  <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: 'var(--cream-100)' }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        background: 'var(--green-800)',
                        width: `${Math.min(100, (grandTotal / freeShippingThreshold) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Summary — desktop */}
            <aside className="hidden lg:block lg:sticky lg:top-28">
              <div className="rounded-2xl p-7" style={{ background: 'var(--cream-100)', border: '1px solid var(--cream-400)' }}>
                <div className="text-[11px] uppercase tracking-[0.16em]" style={{ color: 'var(--ink-500)' }}>
                  {c?.orderSummaryEyebrow}
                </div>
                <div className="mt-5 flex flex-col gap-3 text-sm">
                  <div className="flex justify-between gap-4" style={{ color: 'var(--ink-700)' }}>
                    <span>{subtotalLine}</span>
                    <span className="font-medium" style={{ color: 'var(--green-900)' }}>{formatPrice(grandTotal)}</span>
                  </div>
                  <div className="flex justify-between gap-4" style={{ color: 'var(--ink-700)' }}>
                    <span>{d?.shippingLabel}</span>
                    <span style={{ color: grandTotal >= freeShippingThreshold ? 'var(--green-700)' : undefined }}>
                      {grandTotal >= freeShippingThreshold ? (d?.shippingFreeLabel ?? 'Free') : formatPrice(flatShip)}
                    </span>
                  </div>
                  {totalSavings > 0 && (
                    <div className="flex justify-between gap-4" style={{ color: 'var(--green-700)' }}>
                      <span>You save</span>
                      <span>−{formatPrice(totalSavings)}</span>
                    </div>
                  )}
                  {c?.gstLabel ? (
                    <div className="flex justify-between gap-4 text-sm" style={{ color: 'var(--ink-500)' }}>
                      <span>{c.gstLabel}</span>
                      <span>{c.gstDisplayValue ?? '—'}</span>
                    </div>
                  ) : null}
                </div>

                <form
                  className="mt-4"
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (!promoCode.trim()) return
                    setPromoMessage(`"${promoCode.trim()}" isn't a valid code right now.`)
                  }}
                >
                  <div className="flex gap-2">
                    <input
                      value={promoCode}
                      onChange={(e) => {
                        setPromoCode(e.target.value)
                        if (promoMessage) setPromoMessage(null)
                      }}
                      className="flex-1 min-w-0 rounded-lg px-3 py-2.5 text-sm border bg-[var(--cream-200)] focus:outline-none focus:ring-1"
                      style={{ borderColor: 'var(--cream-400)', color: 'var(--ink-700)' }}
                      placeholder={c?.promoCodePlaceholder ?? 'Promo code'}
                      aria-label={c?.promoCodePlaceholder ?? 'Promo code'}
                    />
                    <button
                      type="submit"
                      className="shrink-0 px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors hover:bg-cream-300"
                      style={{ borderColor: 'var(--cream-400)', color: 'var(--green-900)' }}
                    >
                      {c?.promoApplyLabel ?? 'Apply'}
                    </button>
                  </div>
                  {promoMessage && (
                    <p className="mt-2 text-xs" role="status" style={{ color: 'var(--terra-600)' }}>
                      {promoMessage}
                    </p>
                  )}
                </form>

                <hr className="my-5" style={{ borderColor: 'var(--cream-400)' }} />

                <div className="flex justify-between items-baseline gap-4">
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--green-900)' }}>
                    {d?.totalLabel}
                  </span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 34, color: 'var(--green-900)' }}>
                    {formatPrice(shipPaid)}
                  </span>
                </div>

                <Link
                  href={checkoutHref}
                  className="mt-5 flex w-full items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-colors"
                  style={{ background: 'var(--green-800)', color: 'var(--cream-100)' }}
                >
                  {d?.continueCheckoutLabel}
                  <Icons.arrowRight size={16} />
                </Link>

                {c?.securedPaymentLine ? (
                  <div className="mt-3 flex items-center justify-center gap-2 text-[11px]" style={{ color: 'var(--ink-500)' }}>
                    <Icons.lock size={12} />
                    {c.securedPaymentLine}
                  </div>
                ) : null}

                {c?.trustFootnote ? (
                  <p className="mt-4 text-xs text-center leading-relaxed" style={{ color: 'var(--ink-500)' }}>
                    {c.trustFootnote}
                  </p>
                ) : null}

                <Link href={continueHref} className="mt-4 block text-center text-xs hover:opacity-80" style={{ color: 'var(--ink-400)' }}>
                  {d?.continueShoppingLabel}
                </Link>
              </div>
            </aside>
          </div>

          {/* Mobile summary + sticky checkout */}
          <div className="lg:hidden mt-8 space-y-4">
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between" style={{ color: 'var(--ink-700)' }}>
                <span>{subtotalLine}</span>
                <span className="font-medium">{formatPrice(grandTotal)}</span>
              </div>
              <div className="flex justify-between" style={{ color: 'var(--ink-700)' }}>
                <span>{d?.shippingLabel}</span>
                <span>{grandTotal >= freeShippingThreshold ? (d?.shippingFreeLabel ?? 'Free') : formatPrice(flatShip)}</span>
              </div>
              {totalSavings > 0 && (
                <div className="flex justify-between" style={{ color: 'var(--green-700)' }}>
                  <span>You save</span>
                  <span>−{formatPrice(totalSavings)}</span>
                </div>
              )}
            </div>
            <hr style={{ borderColor: 'var(--cream-400)' }} />
            <div className="flex justify-between items-baseline">
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--green-900)' }}>{d?.totalLabel}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 30, color: 'var(--green-900)' }}>{formatPrice(shipPaid)}</span>
            </div>
          </div>

          <div
            className="lg:hidden fixed inset-x-0 bottom-0 z-30 px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] border-t"
            style={{
              background: 'rgba(251,247,236,0.96)',
              backdropFilter: 'blur(12px)',
              borderColor: 'var(--cream-400)',
            }}
          >
            <Link
              href={checkoutHref}
              className="flex w-full items-center justify-center py-3.5 rounded-xl font-semibold text-sm"
              style={{ background: 'var(--green-800)', color: 'var(--cream-100)' }}
            >
              {d?.continueCheckoutLabel} · {formatPrice(shipPaid)}
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
