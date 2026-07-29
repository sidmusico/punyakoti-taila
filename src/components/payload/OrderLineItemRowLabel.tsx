'use client'

import React from 'react'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

type RowData = {
  productName?: string
  variantSize?: string
  imageUrl?: string
  quantity?: number
}

export const OrderLineItemRowLabel: React.FC<RowLabelProps> = () => {
  const { data, rowNumber } = useRowLabel<RowData>()
  const title = data?.productName
    ? `${data.productName}${data.variantSize ? ` · ${data.variantSize}` : ''}${data.quantity ? ` × ${data.quantity}` : ''}`
    : `Line item ${(rowNumber ?? 0) + 1}`
  const src = data?.imageUrl?.trim()

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
      <div
        style={{
          flexShrink: 0,
          width: 32,
          height: 32,
          borderRadius: 6,
          overflow: 'hidden',
          background: 'var(--theme-elevation-100)',
          border: '1px solid var(--theme-elevation-150)',
        }}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : null}
      </div>
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</span>
    </div>
  )
}
