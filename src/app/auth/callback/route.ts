import { createServerClient } from '@supabase/ssr'
import type { EmailOtpType } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

import { getAuthOrigin } from '@/lib/auth/authUrls'
import { ensureCustomer } from '@/lib/auth/ensureCustomer'
import { getSupabaseAnonKey, getSupabaseUrl } from '@/lib/supabase/env'

const EMAIL_OTP_TYPES = new Set<EmailOtpType>([
  'signup',
  'invite',
  'magiclink',
  'recovery',
  'email_change',
  'email',
])

function parseEmailOtpType(raw: string | null): EmailOtpType | null {
  if (!raw || !EMAIL_OTP_TYPES.has(raw as EmailOtpType)) return null
  return raw as EmailOtpType
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const { searchParams } = requestUrl
  const siteOrigin = getAuthOrigin({ requestOrigin: requestUrl.origin })
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const otpType = parseEmailOtpType(searchParams.get('type'))
  let next = searchParams.get('next') ?? '/account'
  if (!next.startsWith('/')) next = '/account'
  if (otpType === 'recovery') next = '/login/reset-password'

  const hasCode = Boolean(code)
  const hasEmailLink = Boolean(token_hash && otpType)

  if (!hasCode && !hasEmailLink) {
    return NextResponse.redirect(`${siteOrigin}/login?error=auth_callback`)
  }

  const cookieStore = await cookies()
  const redirectResponse = NextResponse.redirect(`${siteOrigin}${next}`)

  const supabase = createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options)
          redirectResponse.cookies.set(name, value, options)
        })
      },
    },
  })

  if (hasEmailLink && token_hash && otpType) {
    const { error } = await supabase.auth.verifyOtp({ type: otpType, token_hash })
    if (error) {
      console.error('[auth/callback] verifyOtp:', error.message)
      return NextResponse.redirect(`${siteOrigin}/login?error=auth_callback`)
    }
  } else if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      console.error('[auth/callback] exchangeCodeForSession:', error.message)
      return NextResponse.redirect(`${siteOrigin}/login?error=auth_callback`)
    }
    // PKCE recovery often arrives as `?code=` only (redirect URL not allow-listed). Session is still valid for password update.
    if (!searchParams.get('next') && !searchParams.get('type')) {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      const recoveryAt = session?.user?.recovery_sent_at
      if (recoveryAt) next = '/login/reset-password'
    }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    const payload = await getPayload({ config })
    await ensureCustomer(payload, user)
  }

  return redirectResponse
}
