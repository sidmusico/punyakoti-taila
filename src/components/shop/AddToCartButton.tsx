'use client'

import React, { useState } from 'react'
import { useCartStore } from '@/store/cart'
import { Icons } from '@/components/ui/pt/Icons'
import { cn } from '@/utilities/ui'

interface AddToCartButtonProps {
  productId: string
  slug: string
  name: string
  variantSize: string
  sku: string
  price: number
  mrp?: number
  image?: string
  isSubscription?: boolean
  className?: string
}

export function AddToCartButton({
  productId,
  slug,
  name,
  variantSize,
  sku,
  price,
  mrp,
  image,
  isSubscription = false,
  className,
}: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem)
  const [added, setAdded] = useState(false)

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({ productId, slug, name, variantSize, sku, price, mrp, image, isSubscription })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <button
      onClick={handleAdd}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded-lg text-sm font-medium transition-all',
        'px-4 py-2 border',
        added
          ? 'border-transparent'
          : 'hover:border-wood-500',
        className,
      )}
      style={
        added
          ? { background: 'var(--green-100)', color: 'var(--green-800)', borderColor: 'var(--green-300)' }
          : { background: 'transparent', color: 'var(--green-900)', borderColor: 'var(--wood-300)' }
      }
      aria-label={added ? 'Added to basket' : 'Add to basket'}
    >
      {added ? (
        <>
          <Icons.check size={14} />
          Added
        </>
      ) : (
        <>
          <Icons.plus size={14} />
          Add
        </>
      )}
    </button>
  )
}
