import { getPayload, Payload } from 'payload'
import config from '@/payload.config'
import { normalizeDefaults, type CustomerAddress } from '@/lib/account/normalizeAddresses'

import { describe, it, beforeAll, afterAll, expect } from 'vitest'

const addr = (over: Partial<CustomerAddress> = {}): CustomerAddress => ({
  fullName: 'Test User',
  line1: '1 Test Street',
  city: 'Bangalore',
  state: 'Karnataka',
  pincode: '560001',
  country: 'India',
  ...over,
})

describe('normalizeDefaults', () => {
  it('makes the first address the default shipping + billing', () => {
    const list = normalizeDefaults([addr()], 0)
    expect(list[0]!.isDefaultShipping).toBe(true)
    expect(list[0]!.isDefaultBilling).toBe(true)
  })

  it('keeps exactly one default shipping (the just-edited row wins)', () => {
    const list = normalizeDefaults(
      [addr({ isDefaultShipping: true }), addr({ isDefaultShipping: true })],
      1,
    )
    expect(list.filter((a) => a.isDefaultShipping)).toHaveLength(1)
    expect(list[1]!.isDefaultShipping).toBe(true)
  })

  it('promotes a remaining address to default after the default is removed', () => {
    // Two addresses, first is default for both; simulate deleting index 0.
    const remaining = [addr({ label: 'Work' })]
    const list = normalizeDefaults(remaining, null)
    expect(list[0]!.isDefaultShipping).toBe(true)
    expect(list[0]!.isDefaultBilling).toBe(true)
  })

  it('supports separate default shipping and billing rows', () => {
    // Non-default flags may be undefined (falsy); the DB coerces them to false.
    const list = normalizeDefaults(
      [addr({ isDefaultShipping: true }), addr({ isDefaultBilling: true })],
      1,
    )
    expect(list[0]!.isDefaultShipping).toBe(true)
    expect(list[0]!.isDefaultBilling).toBeFalsy()
    expect(list[1]!.isDefaultBilling).toBe(true)
    expect(list[1]!.isDefaultShipping).toBeFalsy()
  })
})

describe('customer address book (local DB round-trip)', () => {
  let payload: Payload
  let customerId: number | string
  const supabaseUserId = `test-addr-${Date.now()}`

  beforeAll(async () => {
    payload = await getPayload({ config: await config })
    const created = await payload.create({
      collection: 'customers',
      data: { supabaseUserId, name: 'Address Test', email: `${supabaseUserId}@example.com` },
      overrideAccess: true,
    })
    customerId = created.id
  })

  afterAll(async () => {
    if (customerId) {
      await payload.delete({ collection: 'customers', id: customerId, overrideAccess: true }).catch(() => {})
    }
  })

  it('persists a normalized address book and reads it back', async () => {
    const list = normalizeDefaults(
      [addr({ label: 'Home' }), addr({ label: 'Work', landmark: 'Near park' })],
      0,
    )
    const updated = await payload.update({
      collection: 'customers',
      id: customerId,
      data: { addresses: list },
      overrideAccess: true,
      depth: 0,
    })

    const saved = updated.addresses ?? []
    expect(saved).toHaveLength(2)
    // Exactly one default of each kind survived the DB round-trip.
    expect(saved.filter((a) => a.isDefaultShipping)).toHaveLength(1)
    expect(saved.filter((a) => a.isDefaultBilling)).toHaveLength(1)
    // The landmark (new field) persisted.
    expect(saved.find((a) => a.label === 'Work')?.landmark).toBe('Near park')
    // Rows received ids (used by the CRUD route to target updates/deletes).
    expect(saved[0]!.id).toBeTruthy()
  })
})
