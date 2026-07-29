import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import { sendAuthTemplateEmail } from '@/lib/email/sendOrderEmails'
import { getAuthOrigin } from '@/lib/auth/authUrls'

/**
 * Supabase Auth "Send Email" hook — sends branded OTP / signup emails via Resend
 * using Payload → Globals → Email templates.
 *
 * Dashboard: Authentication → Hooks → Send email → HTTPS → this URL
 * Header: Authorization: Bearer <SUPABASE_AUTH_HOOK_SECRET>
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SUPABASE_AUTH_HOOK_SECRET?.trim()
  if (secret) {
    const auth = req.headers.get('authorization') ?? ''
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  let body: {
    user?: { email?: string }
    email_data?: {
      token?: string
      token_hash?: string
      redirect_to?: string
      email_action_type?: string
    }
  }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const email = body.user?.email?.trim()
  const data = body.email_data
  if (!email || !data) {
    return NextResponse.json({ error: 'Missing user or email_data' }, { status: 400 })
  }

  const origin = getAuthOrigin({ requestOrigin: req.headers.get('origin') ?? undefined })
  const callback = `${origin}/auth/callback`
  let confirmationUrl = data.token_hash
    ? `${callback}?token_hash=${encodeURIComponent(data.token_hash)}&type=${encodeURIComponent(data.email_action_type ?? 'signup')}`
    : (data.redirect_to ?? callback)
  if (data.email_action_type === 'recovery') {
    confirmationUrl += `&next=${encodeURIComponent('/login/reset-password')}`
  }

  const otp = data.token ?? ''

  const payload = await getPayload({ config: configPromise })

  const action = data.email_action_type ?? 'magiclink'
  const template =
    action === 'signup' || action === 'email_change' || action === 'recovery'
      ? 'signupConfirmation'
      : 'otpEmail'

  const result = await sendAuthTemplateEmail({
    template,
    to: email,
    ctx: {
      email,
      otp,
      confirmationUrl,
    },
    payload,
  })

  if (!result.sent && !result.skipped) {
    const err = 'error' in result ? result.error : 'unknown'
    console.error('[auth-hook] send failed', err)
    return NextResponse.json({ error: 'Send failed' }, { status: 500 })
  }

  return NextResponse.json({})
}
