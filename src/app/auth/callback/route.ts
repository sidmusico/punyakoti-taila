import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

import { getAuthOrigin } from '@/lib/auth/authUrls'
import { ensureCustomer } from '@/lib/auth/ensureCustomer'
import { getSupabaseAnonKey, getSupabaseUrl } from '@/lib/supabase/env'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const { searchParams } = requestUrl
  const siteOrigin = getAuthOrigin({ requestOrigin: requestUrl.origin })
  const code = searchParams.get('code')
  let next = searchParams.get('next') ?? '/account'
  if (!next.startsWith('/')) next = '/account'

  if (!code) {
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

  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    console.error('[auth/callback] exchangeCodeForSession:', error.message)
    return NextResponse.redirect(`${siteOrigin}/login?error=auth_callback`)
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
