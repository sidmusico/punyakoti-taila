import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { z } from 'zod'

import { createClient } from '@/lib/supabase/server'
import { normalizeDefaults } from '@/lib/account/normalizeAddresses'
import type { Customer } from '@/payload-types'

/* ────────────────────────────────────────────────────────────────────────────
   Address book CRUD for the signed-in storefront customer.

   Writes go through here (not the public Payload API) so we can enforce
   ownership (via Supabase auth) and keep exactly one default shipping and one
   default billing address per customer.
──────────────────────────────────────────────────────────────────────────── */

type Address = NonNullable<Customer['addresses']>[number]

const addressSchema = z.object({
  label: z.string().max(60).optional().nullable(),
  fullName: z.string().min(2, 'Name is required').max(120),
  phone: z.string().max(20).optional().nullable(),
  line1: z.string().min(3, 'Address is required').max(200),
  line2: z.string().max(200).optional().nullable(),
  landmark: z.string().max(120).optional().nullable(),
  city: z.string().min(2, 'City is required').max(80),
  state: z.string().min(2, 'State is required').max(80),
  pincode: z.string().regex(/^\d{6}$/, '6-digit pincode required'),
  country: z.string().max(80).optional().nullable(),
  isDefaultShipping: z.boolean().optional(),
  isDefaultBilling: z.boolean().optional(),
})

const createSchema = addressSchema
const updateSchema = addressSchema.extend({ id: z.string().min(1) })

/** Resolve the authenticated customer doc, or return a JSON error response. */
async function requireCustomer() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }

  const payload = await getPayload({ config })
  const hit = await payload.find({
    collection: 'customers',
    where: { supabaseUserId: { equals: user.id } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  const doc = hit.docs[0]
  if (!doc) {
    return { error: NextResponse.json({ error: 'Customer not found' }, { status: 404 }) }
  }

  return { payload, doc }
}

async function saveAddresses(
  payload: Awaited<ReturnType<typeof getPayload>>,
  customerId: number | string,
  addresses: Address[],
) {
  const updated = await payload.update({
    collection: 'customers',
    id: customerId,
    data: { addresses },
    overrideAccess: true,
    depth: 0,
  })
  return (updated as Customer).addresses ?? []
}

/* ── POST — add an address ──────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  const ctx = await requireCustomer()
  if ('error' in ctx) return ctx.error
  const { payload, doc } = ctx

  const parsed = createSchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
  }

  const list: Address[] = [...(doc.addresses ?? [])]
  list.push({ ...parsed.data, country: parsed.data.country || 'India' } as Address)
  const normalized = normalizeDefaults(list, list.length - 1)

  const addresses = await saveAddresses(payload, doc.id, normalized)
  return NextResponse.json({ addresses })
}

/* ── PATCH — update an address by row id ────────────────────────────────── */
export async function PATCH(req: NextRequest) {
  const ctx = await requireCustomer()
  if ('error' in ctx) return ctx.error
  const { payload, doc } = ctx

  const parsed = updateSchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
  }

  const { id, ...data } = parsed.data
  const list: Address[] = [...(doc.addresses ?? [])]
  const idx = list.findIndex((a) => a.id === id)
  if (idx === -1) {
    return NextResponse.json({ error: 'Address not found' }, { status: 404 })
  }

  list[idx] = { ...list[idx], ...data, country: data.country || 'India', id } as Address
  const normalized = normalizeDefaults(list, idx)

  const addresses = await saveAddresses(payload, doc.id, normalized)
  return NextResponse.json({ addresses })
}

/* ── DELETE — remove an address by ?id= ─────────────────────────────────── */
export async function DELETE(req: NextRequest) {
  const ctx = await requireCustomer()
  if ('error' in ctx) return ctx.error
  const { payload, doc } = ctx

  const id = req.nextUrl.searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'Missing address id' }, { status: 400 })
  }

  const list: Address[] = (doc.addresses ?? []).filter((a) => a.id !== id)
  const normalized = normalizeDefaults(list, null)

  const addresses = await saveAddresses(payload, doc.id, normalized)
  return NextResponse.json({ addresses })
}
