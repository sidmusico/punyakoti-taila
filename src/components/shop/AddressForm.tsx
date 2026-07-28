'use client'

import React, { useState } from 'react'
import { z } from 'zod'

import type { AddressCopy } from '@/components/shop/AddressCopy'
import type { Customer } from '@/payload-types'

export type CustomerAddress = NonNullable<Customer['addresses']>[number]

/** Payload shape sent to /api/account/addresses. */
export type AddressPayload = {
  id?: string
  label?: string | null
  fullName: string
  phone?: string | null
  line1: string
  line2?: string | null
  landmark?: string | null
  city: string
  state: string
  pincode: string
  country?: string | null
  isDefaultShipping?: boolean
  isDefaultBilling?: boolean
}

const schema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  line1: z.string().min(3, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^\d{6}$/, '6-digit pincode required'),
})

type FieldErrors = Partial<Record<'fullName' | 'line1' | 'city' | 'state' | 'pincode', string>>

const inputStyle: React.CSSProperties = {
  background: 'var(--cream-100)',
  borderColor: 'var(--cream-400)',
  color: 'var(--ink-900)',
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--ink-400)' }}>
      {children}
    </span>
  )
}

export function AddressForm({
  initial,
  copy,
  onSubmit,
  onCancel,
}: {
  initial: CustomerAddress | null
  copy: AddressCopy
  /** Should perform the API write and throw an Error(message) on failure. */
  onSubmit: (values: AddressPayload) => Promise<void>
  onCancel: () => void
}) {
  const [label, setLabel] = useState(initial?.label ?? '')
  const [fullName, setFullName] = useState(initial?.fullName ?? '')
  const [phone, setPhone] = useState(initial?.phone ?? '')
  const [line1, setLine1] = useState(initial?.line1 ?? '')
  const [line2, setLine2] = useState(initial?.line2 ?? '')
  const [landmark, setLandmark] = useState(initial?.landmark ?? '')
  const [city, setCity] = useState(initial?.city ?? '')
  const [state, setState] = useState(initial?.state ?? '')
  const [pincode, setPincode] = useState(initial?.pincode ?? '')
  const [country, setCountry] = useState(initial?.country ?? 'India')
  const [isDefaultShipping, setIsDefaultShipping] = useState(Boolean(initial?.isDefaultShipping))
  // "Billing same as shipping" — when a saved address has matching default flags
  // (or it's brand new) we treat billing as identical to shipping.
  const [billingSame, setBillingSame] = useState(
    initial ? Boolean(initial.isDefaultBilling) === Boolean(initial.isDefaultShipping) : true,
  )
  const [isDefaultBilling, setIsDefaultBilling] = useState(Boolean(initial?.isDefaultBilling))

  const [errors, setErrors] = useState<FieldErrors>({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const result = schema.safeParse({ fullName, line1, city, state, pincode })
    if (!result.success) {
      const fe: FieldErrors = {}
      result.error.issues.forEach((i) => {
        fe[i.path[0] as keyof FieldErrors] = i.message
      })
      setErrors(fe)
      return
    }
    setErrors({})
    setLoading(true)
    try {
      await onSubmit({
        ...(initial?.id ? { id: initial.id } : {}),
        label: label || null,
        fullName,
        phone: phone || null,
        line1,
        line2: line2 || null,
        landmark: landmark || null,
        city,
        state,
        pincode,
        country: country || 'India',
        isDefaultShipping,
        // When billing == shipping, this address serves both; otherwise use the
        // explicit billing toggle.
        isDefaultBilling: billingSame ? isDefaultShipping : isDefaultBilling,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save address')
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl p-6"
      style={{ background: 'var(--cream-100)', border: '1px solid var(--cream-400)' }}
    >
      <h3 className="mb-5" style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--green-900)', margin: '0 0 20px' }}>
        {initial ? copy.editFormTitle : copy.newFormTitle}
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 sm:col-span-1">
          <Label>{copy.fields.nickname}</Label>
          <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Home" className="w-full rounded-xl px-4 py-3 text-sm border outline-none" style={inputStyle} />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <Label>{copy.fields.country}</Label>
          <input value={country} onChange={(e) => setCountry(e.target.value)} className="w-full rounded-xl px-4 py-3 text-sm border outline-none" style={inputStyle} />
        </div>

        <div className="col-span-2 sm:col-span-1">
          <Label>{copy.fields.fullName}</Label>
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} aria-invalid={Boolean(errors.fullName)} className="w-full rounded-xl px-4 py-3 text-sm border outline-none" style={{ ...inputStyle, borderColor: errors.fullName ? 'var(--terra-600)' : 'var(--cream-400)' }} />
          {errors.fullName && <p className="mt-1 text-xs" style={{ color: 'var(--terra-600)' }}>{errors.fullName}</p>}
        </div>
        <div className="col-span-2 sm:col-span-1">
          <Label>{copy.fields.phone}</Label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="9876543210" className="w-full rounded-xl px-4 py-3 text-sm border outline-none" style={inputStyle} />
        </div>

        <div className="col-span-2">
          <Label>{copy.fields.line1}</Label>
          <input value={line1} onChange={(e) => setLine1(e.target.value)} aria-invalid={Boolean(errors.line1)} placeholder="House / flat / street" className="w-full rounded-xl px-4 py-3 text-sm border outline-none" style={{ ...inputStyle, borderColor: errors.line1 ? 'var(--terra-600)' : 'var(--cream-400)' }} />
          {errors.line1 && <p className="mt-1 text-xs" style={{ color: 'var(--terra-600)' }}>{errors.line1}</p>}
        </div>
        <div className="col-span-2 sm:col-span-1">
          <Label>{copy.fields.line2}</Label>
          <input value={line2} onChange={(e) => setLine2(e.target.value)} placeholder="Area" className="w-full rounded-xl px-4 py-3 text-sm border outline-none" style={inputStyle} />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <Label>{copy.fields.landmark}</Label>
          <input value={landmark} onChange={(e) => setLandmark(e.target.value)} placeholder="Nearby landmark" className="w-full rounded-xl px-4 py-3 text-sm border outline-none" style={inputStyle} />
        </div>

        <div className="col-span-2 sm:col-span-1">
          <Label>{copy.fields.city}</Label>
          <input value={city} onChange={(e) => setCity(e.target.value)} aria-invalid={Boolean(errors.city)} placeholder="Bangalore" className="w-full rounded-xl px-4 py-3 text-sm border outline-none" style={{ ...inputStyle, borderColor: errors.city ? 'var(--terra-600)' : 'var(--cream-400)' }} />
          {errors.city && <p className="mt-1 text-xs" style={{ color: 'var(--terra-600)' }}>{errors.city}</p>}
        </div>
        <div className="col-span-2 sm:col-span-1">
          <Label>{copy.fields.state}</Label>
          <input value={state} onChange={(e) => setState(e.target.value)} aria-invalid={Boolean(errors.state)} placeholder="Karnataka" className="w-full rounded-xl px-4 py-3 text-sm border outline-none" style={{ ...inputStyle, borderColor: errors.state ? 'var(--terra-600)' : 'var(--cream-400)' }} />
          {errors.state && <p className="mt-1 text-xs" style={{ color: 'var(--terra-600)' }}>{errors.state}</p>}
        </div>
        <div className="col-span-2 sm:col-span-1">
          <Label>{copy.fields.pincode}</Label>
          <input value={pincode} onChange={(e) => setPincode(e.target.value)} inputMode="numeric" aria-invalid={Boolean(errors.pincode)} placeholder="560001" className="w-full rounded-xl px-4 py-3 text-sm border outline-none" style={{ ...inputStyle, borderColor: errors.pincode ? 'var(--terra-600)' : 'var(--cream-400)' }} />
          {errors.pincode && <p className="mt-1 text-xs" style={{ color: 'var(--terra-600)' }}>{errors.pincode}</p>}
        </div>
      </div>

      {/* Defaults + billing-same-as-shipping */}
      <div className="mt-5 flex flex-col gap-3">
        <label className="flex items-center gap-2.5 text-sm cursor-pointer" style={{ color: 'var(--ink-700)' }}>
          <input type="checkbox" checked={isDefaultShipping} onChange={(e) => setIsDefaultShipping(e.target.checked)} className="h-4 w-4 rounded accent-[var(--green-800)]" />
          {copy.setDefaultShippingLabel}
        </label>
        <label className="flex items-center gap-2.5 text-sm cursor-pointer" style={{ color: 'var(--ink-700)' }}>
          <input type="checkbox" checked={billingSame} onChange={(e) => setBillingSame(e.target.checked)} className="h-4 w-4 rounded accent-[var(--green-800)]" />
          {copy.billingSameLabel}
        </label>
        {!billingSame && (
          <label className="flex items-center gap-2.5 text-sm cursor-pointer pl-6" style={{ color: 'var(--ink-700)' }}>
            <input type="checkbox" checked={isDefaultBilling} onChange={(e) => setIsDefaultBilling(e.target.checked)} className="h-4 w-4 rounded accent-[var(--green-800)]" />
            {copy.setDefaultBillingLabel}
          </label>
        )}
      </div>

      {error && <p className="mt-4 text-sm" style={{ color: 'var(--terra-600)' }}>{error}</p>}

      <div className="mt-6 flex items-center gap-3">
        <button type="submit" disabled={loading} className="px-6 py-3 rounded-xl text-sm font-semibold disabled:opacity-60" style={{ background: 'var(--green-800)', color: 'var(--cream-100)' }}>
          {loading ? 'Saving…' : copy.saveLabel}
        </button>
        <button type="button" onClick={onCancel} disabled={loading} className="px-5 py-3 rounded-xl text-sm font-medium disabled:opacity-60" style={{ color: 'var(--ink-600)' }}>
          {copy.cancelLabel}
        </button>
      </div>
    </form>
  )
}
