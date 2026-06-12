import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { z } from 'zod'

import { createClient } from '@/lib/supabase/server'

const bodySchema = z.object({
  name: z.string().min(1).max(120),
  phone: z.string().max(20).optional().nullable(),
})

export async function PATCH(req: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const parsed = bodySchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const { name, phone } = parsed.data

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
    return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
  }

  const updated = await payload.update({
    collection: 'customers',
    id: doc.id,
    data: {
      name,
      phone: phone || undefined,
    },
    overrideAccess: true,
  })

  await supabase.auth.updateUser({
    data: { full_name: name, name },
  })

  return NextResponse.json({ customer: updated })
}
