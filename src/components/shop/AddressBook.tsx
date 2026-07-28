'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

import { AddressForm, type AddressPayload, type CustomerAddress } from '@/components/shop/AddressForm'
import type { AddressCopy } from '@/components/shop/AddressCopy'
import { Icons } from '@/components/ui/pt/Icons'

const API = '/api/account/addresses'

function Badge({ children, tone }: { children: React.ReactNode; tone: 'green' | 'mustard' }) {
  const style =
    tone === 'green'
      ? { background: 'var(--green-100)', color: 'var(--green-800)' }
      : { background: 'var(--mustard-100)', color: 'var(--mustard-700)' }
  return (
    <span className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider" style={style}>
      {children}
    </span>
  )
}

function formatLines(a: CustomerAddress): string {
  return [a.line1, a.line2, a.landmark, `${a.city}, ${a.state} ${a.pincode}`, a.country]
    .filter(Boolean)
    .join(' · ')
}

export function AddressBook({
  initialAddresses,
  copy,
}: {
  initialAddresses: CustomerAddress[]
  copy: AddressCopy
}) {
  const router = useRouter()
  const [addresses, setAddresses] = useState<CustomerAddress[]>(initialAddresses)
  const [editing, setEditing] = useState<'new' | string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState('')

  const commit = (next: CustomerAddress[]) => {
    setAddresses(next)
    router.refresh() // keep server components (dashboard card, checkout) in sync
  }

  /** POST or PATCH via the form; throws Error(message) so the form shows it. */
  const handleSubmit = async (values: AddressPayload) => {
    const res = await fetch(API, {
      method: values.id ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      throw new Error(data.error ?? 'Could not save address')
    }
    const data = (await res.json()) as { addresses: CustomerAddress[] }
    commit(data.addresses ?? [])
    setEditing(null)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm(copy.deleteConfirm)) return
    setBusyId(id)
    setError('')
    const res = await fetch(`${API}?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
    setBusyId(null)
    if (!res.ok) {
      setError('Could not delete address')
      return
    }
    const data = (await res.json()) as { addresses: CustomerAddress[] }
    commit(data.addresses ?? [])
  }

  const handleSetDefault = async (a: CustomerAddress, key: 'isDefaultShipping' | 'isDefaultBilling') => {
    if (!a.id) return
    setBusyId(a.id)
    setError('')
    const res = await fetch(API, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: a.id,
        label: a.label ?? null,
        fullName: a.fullName,
        phone: a.phone ?? null,
        line1: a.line1,
        line2: a.line2 ?? null,
        landmark: a.landmark ?? null,
        city: a.city,
        state: a.state,
        pincode: a.pincode,
        country: a.country ?? 'India',
        isDefaultShipping: key === 'isDefaultShipping' ? true : Boolean(a.isDefaultShipping),
        isDefaultBilling: key === 'isDefaultBilling' ? true : Boolean(a.isDefaultBilling),
      }),
    })
    setBusyId(null)
    if (!res.ok) {
      setError('Could not update address')
      return
    }
    const data = (await res.json()) as { addresses: CustomerAddress[] }
    commit(data.addresses ?? [])
  }

  const editingAddress =
    editing && editing !== 'new' ? addresses.find((a) => a.id === editing) ?? null : null

  return (
    <div className="flex flex-col gap-5">
      {error && <p className="text-sm" style={{ color: 'var(--terra-600)' }}>{error}</p>}

      {editing ? (
        <AddressForm
          initial={editing === 'new' ? null : editingAddress}
          copy={copy}
          onSubmit={handleSubmit}
          onCancel={() => setEditing(null)}
        />
      ) : (
        <>
          {addresses.length === 0 ? (
            <div
              className="flex flex-col items-center gap-3 rounded-2xl py-14 text-center"
              style={{ background: 'var(--cream-100)', border: '1px solid var(--cream-400)' }}
            >
              <span style={{ color: 'var(--ink-200)' }}><Icons.pin size={32} /></span>
              <p className="text-sm" style={{ color: 'var(--ink-400)' }}>{copy.emptyMessage}</p>
              <button
                onClick={() => setEditing('new')}
                className="mt-1 rounded-lg px-5 py-2.5 text-sm font-medium"
                style={{ background: 'var(--green-800)', color: 'var(--cream-100)' }}
              >
                {copy.addFirstLabel}
              </button>
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                {addresses.map((a) => {
                  const busy = busyId === a.id
                  return (
                    <div
                      key={a.id}
                      className="flex flex-col rounded-2xl p-5"
                      style={{ background: 'var(--cream-100)', border: '1px solid var(--cream-400)', opacity: busy ? 0.6 : 1 }}
                    >
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="font-medium" style={{ color: 'var(--green-900)' }}>
                          {a.label || a.fullName}
                        </span>
                        {a.isDefaultShipping && <Badge tone="green">{copy.defaultShippingBadge}</Badge>}
                        {a.isDefaultBilling && <Badge tone="mustard">{copy.defaultBillingBadge}</Badge>}
                      </div>
                      <div className="text-sm font-medium" style={{ color: 'var(--ink-900)' }}>{a.fullName}</div>
                      <div className="mt-1 text-[13px] leading-relaxed" style={{ color: 'var(--ink-500)' }}>
                        {formatLines(a)}
                      </div>
                      {a.phone && (
                        <div className="mt-1 text-[13px]" style={{ color: 'var(--ink-400)' }}>{a.phone}</div>
                      )}

                      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                        <button onClick={() => setEditing(a.id!)} disabled={busy} className="font-medium underline underline-offset-4" style={{ color: 'var(--green-700)' }}>
                          {copy.editLabel}
                        </button>
                        <button onClick={() => handleDelete(a.id!)} disabled={busy} className="font-medium underline underline-offset-4" style={{ color: 'var(--terra-600)' }}>
                          {copy.deleteLabel}
                        </button>
                        {!a.isDefaultShipping && (
                          <button onClick={() => handleSetDefault(a, 'isDefaultShipping')} disabled={busy} className="underline underline-offset-4" style={{ color: 'var(--ink-500)' }}>
                            {copy.setDefaultShippingLabel}
                          </button>
                        )}
                        {!a.isDefaultBilling && (
                          <button onClick={() => handleSetDefault(a, 'isDefaultBilling')} disabled={busy} className="underline underline-offset-4" style={{ color: 'var(--ink-500)' }}>
                            {copy.setDefaultBillingLabel}
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              <button
                onClick={() => setEditing('new')}
                className="self-start flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold"
                style={{ background: 'var(--green-800)', color: 'var(--cream-100)' }}
              >
                <Icons.pin size={15} /> {copy.addLabel}
              </button>
            </>
          )}
        </>
      )}
    </div>
  )
}
