import type { User as SupabaseUser } from '@supabase/supabase-js'
import type { Payload } from 'payload'

import type { Customer } from '@/payload-types'

export type AuthProvider = 'phone' | 'google' | 'email'

function inferProvider(user: SupabaseUser): AuthProvider {
  const provider = user.app_metadata?.provider as string | undefined
  if (provider === 'google') return 'google'
  if (user.phone) return 'phone'
  return 'email'
}

function displayName(user: SupabaseUser): string {
  const meta = user.user_metadata ?? {}
  const fromMeta =
    (typeof meta.full_name === 'string' && meta.full_name) ||
    (typeof meta.name === 'string' && meta.name) ||
    ''
  if (fromMeta) return fromMeta
  if (user.email) return user.email.split('@')[0] ?? ''
  if (user.phone) return user.phone
  return 'Customer'
}

function avatarUrl(user: SupabaseUser): string | undefined {
  const url = user.user_metadata?.avatar_url
  return typeof url === 'string' ? url : undefined
}

/** Upsert a Payload `customers` row for the signed-in Supabase user. */
export async function ensureCustomer(
  payload: Payload,
  user: SupabaseUser,
): Promise<Customer> {
  const supabaseUserId = user.id
  const existing = await payload.find({
    collection: 'customers',
    where: { supabaseUserId: { equals: supabaseUserId } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  const patch = {
    supabaseUserId,
    email: user.email ?? undefined,
    phone: user.phone ?? undefined,
    name: displayName(user),
    avatarUrl: avatarUrl(user),
    authProvider: inferProvider(user),
    lastSignInAt: new Date().toISOString(),
  }

  if (existing.docs[0]) {
    const prev = existing.docs[0] as Customer
    const updated = await payload.update({
      collection: 'customers',
      id: prev.id,
      data: {
        supabaseUserId,
        email: user.email ?? prev.email ?? undefined,
        // Profile-saved phone/name win over Supabase auth on every request.
        phone: prev.phone?.trim() || user.phone || undefined,
        name: prev.name?.trim() || patch.name || prev.name,
        avatarUrl: patch.avatarUrl ?? prev.avatarUrl,
        authProvider: patch.authProvider,
        lastSignInAt: patch.lastSignInAt,
      },
      overrideAccess: true,
    })
    return updated as Customer
  }

  const created = await payload.create({
    collection: 'customers',
    data: patch,
    overrideAccess: true,
  })
  return created as Customer
}
