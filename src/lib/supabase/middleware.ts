import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

import { getSupabaseAnonKey, getSupabaseUrl } from './env'

/**
 * Supabase may return OAuth codes on Site URL root (`/?code=`) when callback
 * path is not allow-listed. Forward to `/auth/callback` on the same host.
 */
function redirectOAuthCodeToCallback(request: NextRequest): NextResponse | null {
  const code = request.nextUrl.searchParams.get('code')
  if (!code || request.nextUrl.pathname === '/auth/callback') return null

  const callback = request.nextUrl.clone()
  callback.pathname = '/auth/callback'
  return NextResponse.redirect(callback)
}

export async function updateSession(request: NextRequest) {
  const oauthRedirect = redirectOAuthCodeToCallback(request)
  if (oauthRedirect) return oauthRedirect

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        )
      },
    },
  })

  await supabase.auth.getUser()

  return supabaseResponse
}
