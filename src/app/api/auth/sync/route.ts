import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

import { ensureCustomer } from '@/lib/auth/ensureCustomer'
import { createClient } from '@/lib/supabase/server'

/** Ensure a Payload customer exists after client-side sign-in (OTP / email). */
export async function POST() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await getPayload({ config })
  const customer = await ensureCustomer(payload, user)

  return NextResponse.json({ customerId: customer.id })
}
