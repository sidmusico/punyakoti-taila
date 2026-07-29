'use client'

import React from 'react'
import type { TextFieldClientProps } from 'payload'
import { FieldLabel, TextInput, useField } from '@payloadcms/ui'

export const OrderLineItemImageField: React.FC<TextFieldClientProps> = ({ field, path, readOnly }) => {
  const { value, setValue } = useField<string>({ path })
  const src = (value ?? '').trim()

  return (
    <div className="field-type text">
      <FieldLabel label={field.label} path={path} required={field.required} />
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginTop: 8 }}>
        <div
          style={{
            flexShrink: 0,
            width: 88,
            height: 88,
            borderRadius: 8,
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
        <div style={{ flex: 1, minWidth: 0 }}>
          <TextInput path={path} value={value} onChange={setValue} readOnly={Boolean(readOnly)} />
        </div>
      </div>
    </div>
  )
}
