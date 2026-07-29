'use client'

import { useEffect } from 'react'

import { clearCheckoutDraft } from '@/lib/checkout/checkoutDraft'
import { useCartStore } from '@/store/cart'

/** Clears persisted cart + checkout draft once the shopper reaches order confirmation. */
export function OrderSuccessCleanup() {
  const clearCart = useCartStore((s) => s.clearCart)

  useEffect(() => {
    clearCheckoutDraft()
    clearCart()
  }, [clearCart])

  return null
}
