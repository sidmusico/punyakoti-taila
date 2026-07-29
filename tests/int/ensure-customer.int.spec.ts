import type { User as SupabaseUser } from '@supabase/supabase-js'
import { getPayload, type Payload } from 'payload'
import config from '@/payload.config'
import { ensureCustomer } from '@/lib/auth/ensureCustomer'

import { describe, it, beforeAll, afterAll, expect } from 'vitest'

function mockUser(over: Partial<SupabaseUser> & { id: string }): SupabaseUser {
  const { id, ...rest } = over
  return {
    id,
    aud: 'authenticated',
    role: 'authenticated',
    email: 'user@example.com',
    app_metadata: { provider: 'email' },
    user_metadata: { full_name: 'Auth Name' },
    created_at: new Date().toISOString(),
    ...rest,
  } as SupabaseUser
}

describe('ensureCustomer profile fields', () => {
  let payload: Payload
  const supabaseUserId = `test-profile-${Date.now()}`

  beforeAll(async () => {
    payload = await getPayload({ config: await config })
  })

  afterAll(async () => {
    const hit = await payload.find({
      collection: 'customers',
      where: { supabaseUserId: { equals: supabaseUserId } },
      limit: 1,
      overrideAccess: true,
    })
    if (hit.docs[0]) {
      await payload.delete({
        collection: 'customers',
        id: hit.docs[0].id,
        overrideAccess: true,
      })
    }
  })

  it('keeps Payload phone when Supabase auth phone differs', async () => {
    const user = mockUser({
      id: supabaseUserId,
      phone: '+919111111111',
      user_metadata: { full_name: 'Auth Name' },
    })

    const created = await ensureCustomer(payload, user)
    await payload.update({
      collection: 'customers',
      id: created.id,
      data: { phone: '+919876543210', name: 'Profile Name' },
      overrideAccess: true,
    })

    const afterSync = await ensureCustomer(payload, user)
    expect(afterSync.phone).toBe('+919876543210')
    expect(afterSync.name).toBe('Profile Name')
  })
})
