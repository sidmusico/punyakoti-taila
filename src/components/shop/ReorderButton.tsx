'use client'

import React, { useState } from 'react'

import { Icons } from '@/components/ui/pt/Icons'
import { useCartStore } from '@/store/cart'

export type ReorderItem = {
  productId: string
  slug: string
  name: string
  variantSize: string
  sku: string
  price: number
  isSubscription?: boolean
  quantity: number
}

/** Adds every line of a past order back into the basket and opens the drawer. */
export function ReorderButton({ items }: { items: ReorderItem[] }) {
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)
  const [added, setAdded] = useState(false)

  const handleReorder = () => {
    items.forEach((i) =>
      addItem({
        productId: i.productId,
        slug: i.slug,
        name: i.name,
        variantSize: i.variantSize,
        sku: i.sku,
        price: i.price,
        isSubscription: i.isSubscription ?? false,
        quantity: i.quantity,
      }),
    )
    setAdded(true)
    setTimeout(() => {
      setAdded(false)
      openCart()
    }, 600)
  }

  return (
    <button
      type="button"
      onClick={handleReorder}
      className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
      style={
        added
          ? { background: 'var(--green-100)', color: 'var(--green-800)' }
          : { background: 'var(--green-800)', color: 'var(--cream-100)' }
      }
    >
      {added ? (
        <><Icons.check size={13} /> Added</>
      ) : (
        <><Icons.refresh size={13} /> Reorder</>
      )}
    </button>
  )
}
