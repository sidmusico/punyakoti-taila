'use client'

import React, { useState } from 'react'
import { useCartStore } from '@/store/cart'
import { Icons } from '@/components/ui/pt/Icons'
import type { OilVariant } from '@/components/ui/pt/Bottle'

interface Size {
  label: string
  price: number
  sku: string
  mrp?: number
  subscribePrice?: number
}

interface PDPActionsProps {
  product: {
    id: string
    slug: string
    name: string
    v: OilVariant
    sizes: Size[]
    price: number
    mrp?: number
    subscribePrice?: number
    /** First gallery image — shown on cart rows. */
    image?: string
  }
}

export function PDPActions({ product }: PDPActionsProps) {
  /** Server sends default variant first; avoid hardcoding a size label. */
  const defaultSize = product.sizes[0]!
  const [selectedSize, setSelectedSize] = useState<Size>(defaultSize)
  const [isSubscription, setIsSubscription] = useState(false)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)

  // Per-size pricing: each size carries its own mrp / subscribe price.
  const mrp = selectedSize.mrp ?? product.mrp
  const subscribePrice =
    selectedSize.subscribePrice ?? product.subscribePrice ?? Math.round(selectedSize.price * 0.85)
  const activePrice = isSubscription ? subscribePrice : selectedSize.price
  const saving = isSubscription ? Math.round(selectedSize.price - subscribePrice) : 0
  const mrpSavingPct =
    !isSubscription && mrp && mrp > selectedSize.price
      ? Math.round(((mrp - selectedSize.price) / mrp) * 100)
      : 0

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      variantSize: selectedSize.label,
      sku: selectedSize.sku,
      price: activePrice,
      mrp,
      image: product.image,
      isSubscription,
      quantity: qty,
    })
    setAdded(true)
    setTimeout(() => {
      setAdded(false)
      openCart()
    }, 800)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Price */}
      <div className="flex items-baseline gap-3 flex-wrap">
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: 'var(--green-900)', lineHeight: 1 }}>
          ₹{activePrice}
        </span>
        {mrp && mrp > activePrice && (
          <span className="text-base line-through" style={{ color: 'var(--ink-300)' }}>₹{mrp}</span>
        )}
        {saving > 0 && (
          <span className="text-sm font-medium px-2 py-0.5 rounded-full" style={{ background: 'var(--green-100)', color: 'var(--green-800)' }}>
            Save ₹{saving} every order
          </span>
        )}
        {mrpSavingPct > 0 && (
          <span className="text-sm font-medium px-2 py-0.5 rounded-full" style={{ background: 'var(--mustard-100)', color: 'var(--mustard-700)' }}>
            {mrpSavingPct}% off
          </span>
        )}
      </div>

      {/* Size picker */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-2.5" style={{ color: 'var(--ink-400)' }}>
          Size
        </label>
        <div className="flex gap-2 flex-wrap">
          {product.sizes.map((size) => {
            const isOn = selectedSize.sku === size.sku
            return (
              <button
                key={size.sku}
                onClick={() => setSelectedSize(size)}
                aria-pressed={isOn}
                className="px-4 py-2 rounded-lg text-sm font-medium border transition-all"
                style={
                  isOn
                    ? {
                        background: 'var(--green-900)',
                        color: 'var(--cream-100)',
                        borderColor: 'var(--green-900)',
                        boxShadow: '0 6px 16px rgba(15, 42, 22, 0.22)',
                      }
                    : { background: 'transparent', color: 'var(--green-900)', borderColor: 'var(--cream-400)' }
                }
              >
                {size.label}
                <span className="ml-1.5 text-xs" style={{ opacity: 0.7 }}>₹{size.price}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* One-time vs subscribe */}
      <div className="flex gap-2">
        {[
          { label: 'One-time', sub: null as string | null, value: false },
          { label: 'Subscribe & save', sub: `₹${subscribePrice} · 15% off every order`, value: true },
        ].map(({ label, sub, value }) => (
          <button
            key={label}
            onClick={() => setIsSubscription(value)}
            aria-pressed={isSubscription === value}
            className="flex-1 rounded-xl p-3.5 text-left border-2 transition-all"
            style={
              isSubscription === value
                ? { borderColor: 'var(--green-700)', background: 'var(--green-50)' }
                : { borderColor: 'var(--cream-400)', background: 'var(--cream-100)' }
            }
          >
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full border-2 grid place-items-center shrink-0"
                style={{ borderColor: isSubscription === value ? 'var(--green-700)' : 'var(--ink-300)' }}
              >
                {isSubscription === value && (
                  <div className="w-2 h-2 rounded-full" style={{ background: 'var(--green-700)' }} />
                )}
              </div>
              <span className="text-sm font-medium" style={{ color: 'var(--green-900)' }}>{label}</span>
            </div>
            {sub && (
              <div className="mt-1 text-xs ml-6" style={{ color: 'var(--mustard-600)' }}>{sub}</div>
            )}
          </button>
        ))}
      </div>

      {/* Quantity + CTA — one action row */}
      <div className="flex items-stretch gap-3 flex-wrap">
        <div
          className="flex items-center self-stretch rounded-xl border shrink-0 overflow-hidden"
          style={{ borderColor: 'var(--cream-400)', background: 'var(--cream-100)', maxWidth: 132 }}
          role="group"
          aria-label="Quantity"
        >
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-11 grid place-items-center self-stretch transition-colors hover:bg-cream-300"
            style={{ color: 'var(--green-900)' }}
            aria-label="Decrease quantity"
          >
            <Icons.minus size={14} />
          </button>
          <span
            className="w-10 text-center font-semibold text-sm"
            style={{ color: 'var(--ink-900)' }}
            aria-live="polite"
          >
            {qty}
          </span>
          <button
            onClick={() => setQty((q) => q + 1)}
            className="w-11 grid place-items-center self-stretch transition-colors hover:bg-cream-300"
            style={{ color: 'var(--green-900)' }}
            aria-label="Increase quantity"
          >
            <Icons.plus size={14} />
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          className="flex-1 min-w-[200px] py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0"
          style={
            added
              ? { background: 'var(--green-700)', color: 'var(--cream-100)' }
              : {
                  background: 'var(--green-800)',
                  color: 'var(--cream-100)',
                  boxShadow: '0 10px 24px rgba(15, 42, 22, 0.25)',
                }
          }
        >
          {added ? (
            <><Icons.check size={18} /> Added to basket</>
          ) : (
            <><Icons.bag size={18} /> Add to basket · ₹{activePrice * qty}</>
          )}
        </button>
      </div>
    </div>
  )
}
