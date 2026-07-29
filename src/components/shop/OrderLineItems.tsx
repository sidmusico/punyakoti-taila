import Image from 'next/image'
import React from 'react'

import type { Order, Product } from '@/payload-types'

import { firstProductPhoto } from '@/lib/product-media'

const rupee = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`

export type OrderLineItemRow = {
  productName: string
  variantSize: string
  quantity: number
  lineTotal: number
  unitPrice?: number
  imageUrl?: string | null
  isSubscription?: boolean | null
}

export function orderDocToLineRows(order: Order): OrderLineItemRow[] {
  return (order.items ?? []).map((i) => {
    let imageUrl = (i as { imageUrl?: string | null }).imageUrl ?? null
    if (!imageUrl && typeof i.product === 'object' && i.product) {
      imageUrl = firstProductPhoto(i.product as Product)?.src ?? null
    }
    return {
      productName: i.productName,
      variantSize: i.variantSize,
      quantity: i.quantity,
      lineTotal: i.lineTotal,
      unitPrice: i.unitPrice,
      imageUrl,
      isSubscription: i.isSubscription,
    }
  })
}

export function OrderLineItems({
  items,
  compact = false,
}: {
  items: OrderLineItemRow[]
  compact?: boolean
}) {
  if (!items.length) {
    return <p className="text-sm" style={{ color: 'var(--ink-400)' }}>No line items recorded.</p>
  }

  return (
    <ul className={compact ? 'flex flex-col gap-3' : 'flex flex-col gap-4'}>
      {items.map((item, idx) => (
        <li key={`${item.productName}-${item.variantSize}-${idx}`} className="flex gap-3">
          <div
            className="relative shrink-0 overflow-hidden rounded-lg grid place-items-center"
            style={{
              width: compact ? 48 : 56,
              height: compact ? 56 : 64,
              background: 'var(--cream-200)',
              border: '1px solid var(--cream-400)',
            }}
          >
            {item.imageUrl ? (
              <Image
                src={item.imageUrl}
                alt=""
                width={56}
                height={64}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-[10px] uppercase tracking-wider px-1 text-center" style={{ color: 'var(--ink-300)' }}>
                No img
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium leading-snug" style={{ color: 'var(--ink-900)' }}>
              {item.productName}
              {item.isSubscription ? (
                <span className="text-xs font-normal" style={{ color: 'var(--mustard-700)' }}> · Subscribe</span>
              ) : null}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--ink-400)' }}>
              {item.variantSize} · Qty {item.quantity}
            </p>
          </div>
          <div className="shrink-0 text-sm font-semibold" style={{ color: 'var(--green-900)' }}>
            {rupee(item.lineTotal)}
          </div>
        </li>
      ))}
    </ul>
  )
}
