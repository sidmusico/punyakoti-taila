'use client'

import React, { useState } from 'react'
import { useCartStore } from '@/store/cart'
import { Icons } from '@/components/ui/pt/Icons'
import type { OilVariant } from '@/components/ui/pt/Bottle'

interface Size { label: string; price: number; sku: string }

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

  const subscribePrice = product.subscribePrice ?? Math.round(selectedSize.price * 0.85)
  const activePrice = isSubscription ? subscribePrice : selectedSize.price
  const saving = isSubscription ? Math.round(selectedSize.price - subscribePrice) : 0

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      variantSize: selectedSize.label,
      sku: selectedSize.sku,
      price: activePrice,
      mrp: product.mrp,
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
    <div className="flex flex-col gap-5">
      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: 'var(--green-900)', lineHeight: 1 }}>
          ₹{activePrice}
        </span>
        {product.mrp && product.mrp > selectedSize.price && (
          <span className="text-base line-through" style={{ color: 'var(--ink-300)' }}>₹{product.mrp}</span>
        )}
        {saving > 0 && (
          <span className="text-sm font-medium px-2 py-0.5 rounded-full" style={{ background: 'var(--green-100)', color: 'var(--green-800)' }}>
            Save ₹{saving}
          </span>
        )}
      </div>

      {/* Size picker */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-2.5" style={{ color: 'var(--ink-400)' }}>
          Size
        </label>
        <div className="flex gap-2 flex-wrap">
          {product.sizes.map((size) => (
            <button
              key={size.sku}
              onClick={() => setSelectedSize(size)}
              className="px-4 py-2 rounded-lg text-sm font-medium border transition-all"
              style={
                selectedSize.sku === size.sku
                  ? { background: 'var(--green-900)', color: 'var(--cream-100)', borderColor: 'var(--green-900)' }
                  : { background: 'transparent', color: 'var(--green-900)', borderColor: 'var(--cream-400)' }
              }
            >
              {size.label}
              <span className="ml-1.5 text-xs" style={{ opacity: 0.7 }}>₹{size.price}</span>
            </button>
          ))}
        </div>
      </div>

      {/* One-time vs subscribe */}
      <div className="flex gap-2">
        {[
          { label: 'One-time', sub: null, value: false },
          { label: 'Subscribe & save', sub: '15% off every order', value: true },
        ].map(({ label, sub, value }) => (
          <button
            key={label}
            onClick={() => setIsSubscription(value)}
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

      {/* Quantity */}
      <div className="flex items-center gap-4">
        <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ink-400)' }}>
          Qty
        </label>
        <div className="flex items-center rounded-xl border overflow-hidden" style={{ borderColor: 'var(--cream-400)' }}>
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-10 h-10 grid place-items-center transition-colors hover:bg-cream-300"
            style={{ color: 'var(--green-900)' }}
            aria-label="Decrease"
          >
            <Icons.minus size={14} />
          </button>
          <span className="w-10 text-center font-semibold text-sm" style={{ color: 'var(--ink-900)' }}>
            {qty}
          </span>
          <button
            onClick={() => setQty((q) => q + 1)}
            className="w-10 h-10 grid place-items-center transition-colors hover:bg-cream-300"
            style={{ color: 'var(--green-900)' }}
            aria-label="Increase"
          >
            <Icons.plus size={14} />
          </button>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={handleAddToCart}
        className="w-full py-4 rounded-xl font-semibold text-base transition-all flex items-center justify-center gap-2"
        style={
          added
            ? { background: 'var(--green-700)', color: 'var(--cream-100)' }
            : { background: 'var(--green-800)', color: 'var(--cream-100)' }
        }
      >
        {added ? (
          <><Icons.check size={18} /> Added to basket</>
        ) : (
          <><Icons.bag size={18} /> Add to basket · ₹{activePrice * qty}</>
        )}
      </button>
    </div>
  )
}
