import { getPayload } from 'payload'
import config from '@payload-config'

import { ensureCustomer } from '@/lib/auth/ensureCustomer'
import { createClient } from '@/lib/supabase/server'
import type { Customer } from '@/payload-types'

export async function getStorefrontSession(): Promise<{
  supabaseUserId: string
  email: string | null
  phone: string | null
  customer: Customer
} | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const payload = await getPayload({ config })
  const customer = await ensureCustomer(payload, user)

  return {
    supabaseUserId: user.id,
    email: user.email ?? null,
    phone: user.phone ?? null,
    customer,
  }
}
