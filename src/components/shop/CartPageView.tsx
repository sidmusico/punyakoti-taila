'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/store/cart'
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
  const { items, removeItem, updateQty, total, itemCount } = useCartStore()
  const grandTotal = total()
  const count = itemCount()
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
    <div className="max-w-[1440px] mx-auto px-5 sm:px-8 md:px-16 lg:px-20 pb-28 lg:pb-16">
      {/* Breadcrumb */}
      <nav className="pt-8 text-xs" style={{ color: 'var(--ink-500)' }} aria-label="Breadcrumb">
        <Link href={c?.breadcrumbHomeHref ?? '/'} className="hover:opacity-80">
          {c?.breadcrumbHomeLabel ?? 'Home'}
        </Link>
        <span className="mx-1.5 opacity-40">/</span>
        <span style={{ color: 'var(--green-900)' }}>{c?.breadcrumbCurrentLabel ?? 'Basket'}</span>
      </nav>

      {heroImageUrl ? (
        <div className="mt-6 relative w-full max-h-[220px] overflow-hidden rounded-2xl">
          <Image
            src={heroImageUrl}
            alt=""
            width={1440}
            height={400}
            className="w-full h-[180px] md:h-[220px] object-cover"
            sizes="100vw"
          />
        </div>
      ) : null}

      {items.length === 0 ? (
        <div className="mt-12 rounded-2xl p-12 text-center max-w-lg mx-auto" style={{ background: 'var(--cream-100)', border: '1px solid var(--cream-400)' }}>
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
          <div className="mt-8 lg:mt-10 grid lg:grid-cols-[1fr_min(380px,34vw)] gap-10 lg:gap-14 items-start">
            <div>
              <div className="text-[11px] uppercase tracking-[0.18em]" style={{ color: 'var(--ink-500)' }}>
                {c?.listingEyebrow}
              </div>
              <h1
                className="mt-3"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 400,
                  fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
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

              <div className="mt-8 flex flex-col">
                {items.map((item, idx) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[72px_1fr_auto] sm:grid-cols-[100px_1fr_auto] gap-4 sm:gap-6 py-6 items-center border-b border-[var(--cream-400)]"
                    style={idx === 0 ? { borderTop: '1px solid var(--cream-400)' } : undefined}
                  >
                    <div
                      className="rounded-xl grid place-items-center aspect-[5/6] max-h-[120px]"
                      style={{ background: 'var(--cream-100)' }}
                    >
                      {item.image ? (
                        <Image src={item.image} alt={item.name} width={100} height={120} className="object-cover w-full h-full rounded-xl" />
                      ) : (
                        <Icons.drop size={28} style={{ color: 'var(--wood-500)' }} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium leading-snug" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1rem, 2.5vw, 1.35rem)', color: 'var(--green-900)' }}>
                        {item.name}
                      </div>
                      <div className="mt-1.5 text-[13px] flex flex-wrap items-center gap-2" style={{ color: 'var(--ink-500)' }}>
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
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-[13px]" style={{ color: 'var(--ink-500)' }}>
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
                        style={{ borderColor: 'var(--cream-400)', background: 'var(--cream-100)' }}
                      >
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                          className="w-8 h-8 sm:w-9 sm:h-9 grid place-items-center bg-transparent border-0 cursor-pointer"
                          style={{ color: 'var(--green-900)' }}
                          aria-label="Decrease quantity"
                        >
                          <Icons.minus size={12} />
                        </button>
                        <span className="w-7 sm:w-8 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          className="w-8 h-8 sm:w-9 sm:h-9 grid place-items-center bg-transparent border-0 cursor-pointer"
                          style={{ color: 'var(--green-900)' }}
                          aria-label="Increase quantity"
                        >
                          <Icons.plus size={12} />
                        </button>
                      </div>
                      <div className="mt-3 text-lg font-semibold" style={{ color: 'var(--green-900)' }}>
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Free shipping progress (matches design cart-checkout.jsx) */}
              <div
                className="mt-8 rounded-xl px-4 py-4 flex gap-3 items-start"
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
                  {c?.gstLabel ? (
                    <div className="flex justify-between gap-4 text-sm" style={{ color: 'var(--ink-500)' }}>
                      <span>{c.gstLabel}</span>
                      <span>{c.gstDisplayValue ?? '—'}</span>
                    </div>
                  ) : null}
                </div>

                <div className="mt-4 flex gap-2">
                  <input
                    readOnly
                    className="flex-1 rounded-lg px-3 py-2.5 text-sm border bg-[var(--cream-200)]"
                    style={{ borderColor: 'var(--cream-400)', color: 'var(--ink-500)' }}
                    placeholder={c?.promoCodePlaceholder ?? ''}
                    aria-label={c?.promoCodePlaceholder ?? 'Promo code'}
                  />
                  <span
                    className="shrink-0 px-4 py-2.5 rounded-lg text-sm font-medium border"
                    style={{ borderColor: 'var(--cream-400)', color: 'var(--ink-500)' }}
                  >
                    {c?.promoApplyLabel}
                  </span>
                </div>

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
