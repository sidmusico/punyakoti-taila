'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/store/cart'
import { Icons } from '@/components/ui/pt/Icons'
import { useStorefrontBundle } from '@/providers/StorefrontCopyProvider'

function formatPrice(n: number) {
  return `₹${n.toLocaleString('en-IN')}`
}

function interpolate(template: string, vars: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`)
}

export function CartDrawer() {
  const { storefront, freeShippingThreshold } = useStorefrontBundle()
  const d = storefront.cartDrawer ?? {}
  const { items, isOpen, closeCart, removeItem, updateQty, total } = useCartStore()
  const grandTotal = total()
  const totalSavings = items.reduce(
    (sum, i) => sum + (i.mrp && i.mrp > i.price ? (i.mrp - i.price) * i.quantity : 0),
    0,
  )
  const checkoutHref = storefront.cartPage?.checkoutHref ?? '/checkout'
  const flatShip =
    typeof d?.flatShippingAmount === 'number' && !Number.isNaN(d.flatShippingAmount)
      ? d.flatShippingAmount
      : 99
  const remaining = Math.max(0, freeShippingThreshold - grandTotal)

  // Close on Escape + lock body scroll while open.
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [isOpen, closeCart])

  return (
    <>
      {/* backdrop */}
      <div
        className="fixed inset-0 z-40 transition-opacity duration-300"
        style={{
          background: 'rgba(15,26,14,0.45)',
          backdropFilter: 'blur(4px)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
        onClick={closeCart}
        aria-hidden
      />

      {/* drawer */}
      <div
        className="fixed inset-y-0 z-50 flex flex-col w-full max-w-sm transition-transform duration-300 ease-out"
        role="dialog"
        aria-modal="true"
        aria-label={d?.title ?? 'Your Basket'}
        aria-hidden={!isOpen}
        inert={!isOpen}
        // `right: var(--site-side-gutter)` keeps the drawer flush with the
        // centered site frame on wide screens (>--site-max-width) instead of
        // hugging the viewport edge. Falls back to 0 on narrow viewports.
        style={{
          right: 'var(--site-side-gutter, 0px)',
          background: 'var(--cream-100)',
          boxShadow: isOpen ? 'var(--sh-xl)' : 'none',
          transform: isOpen ? 'translateX(0)' : 'translateX(calc(100% + var(--site-side-gutter, 0px)))',
          pointerEvents: isOpen ? 'auto' : 'none',
          visibility: isOpen ? 'visible' : undefined,
        }}
      >
        {/* header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid var(--cream-400)' }}
        >
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--green-900)' }}>
            {d?.title ?? 'Your Basket'}
          </div>
          <button
            onClick={closeCart}
            className="w-8 h-8 grid place-items-center rounded-full transition-colors hover:bg-cream-300"
            style={{ color: 'var(--green-900)' }}
            aria-label="Close cart"
          >
            <Icons.close size={18} />
          </button>
        </div>

        {/* free shipping bar */}
        {remaining > 0 && (
          <div className="px-5 py-3" style={{ background: 'var(--mustard-100)', borderBottom: '1px solid var(--cream-400)' }}>
            <p className="text-xs" style={{ color: 'var(--mustard-700)', fontFamily: 'var(--font-body)' }}>
              {interpolate(
                d?.freeShippingProgress ?? 'Add {remaining} more for free shipping',
                { remaining: formatPrice(remaining) },
              )}
            </p>
            <div className="mt-1.5 h-1 rounded-full" style={{ background: 'var(--cream-400)' }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  background: 'var(--mustard-500)',
                  width: `${Math.min(100, (grandTotal / freeShippingThreshold) * 100)}%`,
                }}
              />
            </div>
          </div>
        )}
        {remaining === 0 && items.length > 0 && (
          <div className="px-5 py-2.5 flex items-center gap-2"
            style={{ background: 'var(--green-100)', borderBottom: '1px solid var(--cream-400)' }}>
            <Icons.check size={14} style={{ color: 'var(--green-700)' }} />
            <p className="text-xs font-medium" style={{ color: 'var(--green-800)' }}>
              {d?.freeShippingUnlocked ?? "You've unlocked free shipping!"}
            </p>
          </div>
        )}

        {/* items */}
        <div className="flex-1 overflow-y-auto py-4 px-5 flex flex-col gap-4">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 py-16 text-center">
              <Icons.bag size={40} style={{ color: 'var(--ink-300)' }} />
              <div>
                <p className="font-medium" style={{ color: 'var(--ink-500)' }}>{d?.emptyTitle ?? 'Your basket is empty'}</p>
                <p className="text-sm mt-1" style={{ color: 'var(--ink-400)' }}>
                  {d?.emptySubtitle ?? 'Add some oils to get started'}
                </p>
              </div>
              <button
                onClick={closeCart}
                className="mt-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
                style={{ background: 'var(--green-800)', color: 'var(--cream-100)' }}
              >
                {d?.browseButtonLabel ?? 'Browse Oils'}
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 p-3 rounded-xl"
                style={{ background: 'var(--cream-200)', border: '1px solid var(--cream-400)' }}
              >
                {/* image — links to the product */}
                <Link
                  href={`/shop/${item.slug}`}
                  onClick={closeCart}
                  className="w-16 h-20 rounded-lg shrink-0 overflow-hidden grid place-items-center"
                  style={{ background: 'var(--cream-300)' }}
                  tabIndex={-1}
                  aria-hidden
                >
                  {item.image ? (
                    <Image src={item.image} alt="" width={64} height={80} className="object-cover w-full h-full" />
                  ) : (
                    <Icons.drop size={24} style={{ color: 'var(--wood-500)' }} />
                  )}
                </Link>

                {/* info */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/shop/${item.slug}`}
                    onClick={closeCart}
                    className="font-medium text-sm leading-tight hover:underline"
                    style={{ color: 'var(--ink-900)' }}
                  >
                    {item.name}
                  </Link>
                  <p className="text-xs mt-0.5 flex flex-wrap items-center gap-1.5" style={{ color: 'var(--ink-400)' }}>
                    <span>{item.variantSize}</span>
                    {item.isSubscription && d?.subscribePillLabel ? (
                      <span
                        className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                        style={{ background: 'var(--green-100)', color: 'var(--green-800)' }}
                      >
                        {d.subscribePillLabel}
                      </span>
                    ) : item.isSubscription ? (
                      <span>{d?.subscribeSuffix ?? ' · Subscribe'}</span>
                    ) : null}
                  </p>
                  <div className="flex items-center justify-between gap-3 mt-2">
                    {/* qty stepper — fixed compact size; never grows into the price */}
                    <div
                      className="flex items-center rounded-lg overflow-hidden border"
                      style={{ borderColor: 'var(--cream-400)', flex: '0 0 auto' }}
                    >
                      <button
                        onClick={() => updateQty(item.id, item.quantity - 1)}
                        className="grid place-items-center transition-colors hover:bg-cream-300"
                        style={{ color: 'var(--green-900)', width: 26, height: 26, padding: 0, flex: '0 0 auto' }}
                        aria-label="Decrease quantity"
                      >
                        <Icons.minus size={11} />
                      </button>
                      <span
                        className="text-center text-sm font-medium"
                        style={{ color: 'var(--ink-900)', width: 28, flex: '0 0 auto' }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                        className="grid place-items-center transition-colors hover:bg-cream-300"
                        style={{ color: 'var(--green-900)', width: 26, height: 26, padding: 0, flex: '0 0 auto' }}
                        aria-label="Increase quantity"
                      >
                        <Icons.plus size={11} />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {item.mrp && item.mrp > item.price ? (
                        <span className="text-xs line-through" style={{ color: 'var(--ink-300)' }}>
                          {formatPrice(item.mrp * item.quantity)}
                        </span>
                      ) : null}
                      <span className="text-sm font-semibold" style={{ color: 'var(--green-900)' }}>
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="w-6 h-6 grid place-items-center rounded transition-colors hover:bg-terra-100"
                        style={{ color: 'var(--ink-400)' }}
                        aria-label={`Remove ${item.name}`}
                      >
                        <Icons.close size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* footer / checkout */}
        {items.length > 0 && (
          <div className="px-5 py-4" style={{ borderTop: '1px solid var(--cream-400)' }}>
            {/* order summary */}
            <div className="flex flex-col gap-1.5 mb-4 text-sm">
              <div className="flex justify-between" style={{ color: 'var(--ink-500)' }}>
                <span>{d?.subtotalLabel ?? 'Subtotal'}</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
              {totalSavings > 0 && (
                <div className="flex justify-between" style={{ color: 'var(--green-700)' }}>
                  <span>You save</span>
                  <span>−{formatPrice(totalSavings)}</span>
                </div>
              )}
              <div className="flex justify-between" style={{ color: 'var(--ink-500)' }}>
                <span>{d?.shippingLabel ?? 'Shipping'}</span>
                <span style={{ color: grandTotal >= freeShippingThreshold ? 'var(--green-700)' : 'var(--ink-500)' }}>
                  {grandTotal >= freeShippingThreshold ? (d?.shippingFreeLabel ?? 'Free') : formatPrice(flatShip)}
                </span>
              </div>
              <div className="flex justify-between font-semibold mt-1 pt-2" style={{ color: 'var(--green-900)', borderTop: '1px solid var(--cream-400)' }}>
                <span>{d?.totalLabel ?? 'Total'}</span>
                <span>{formatPrice(grandTotal + (grandTotal >= freeShippingThreshold ? 0 : flatShip))}</span>
              </div>
            </div>

            <Link
              href={checkoutHref}
              onClick={closeCart}
              className="flex w-full items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-colors"
              style={{ background: 'var(--green-800)', color: 'var(--cream-100)' }}
            >
              {d?.continueCheckoutLabel ?? 'Continue to Checkout'}
              <Icons.arrowRight size={16} />
            </Link>

            <button
              onClick={closeCart}
              className="w-full mt-2.5 text-xs text-center transition-opacity hover:opacity-70"
              style={{ color: 'var(--ink-400)' }}
            >
              {d?.continueShoppingLabel ?? 'Continue shopping'}
            </button>
          </div>
        )}
      </div>
    </>
  )
}
