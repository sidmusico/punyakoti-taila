import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

import { getSupabaseAnonKey, getSupabaseUrl } from './env'

/**
 * Supabase may return OAuth codes on Site URL root (`/?code=`) when callback
 * path is not allow-listed. Forward to `/auth/callback` on the same host.
 */
/** Forward Supabase auth query params (`code` or email `token_hash`) to `/auth/callback`. */
function redirectAuthParamsToCallback(request: NextRequest): NextResponse | null {
  if (request.nextUrl.pathname === '/auth/callback') return null

  const code = request.nextUrl.searchParams.get('code')
  const token_hash = request.nextUrl.searchParams.get('token_hash')
  const type = request.nextUrl.searchParams.get('type')
  const hasEmailLink = Boolean(token_hash && type)
  if (!code && !hasEmailLink) return null

  const callback = request.nextUrl.clone()
  callback.pathname = '/auth/callback'
  return NextResponse.redirect(callback)
}

export async function updateSession(request: NextRequest) {
  const authRedirect = redirectAuthParamsToCallback(request)
  if (authRedirect) return authRedirect

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

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname
  const isAccountRoute = path === '/account' || path.startsWith('/account/')
  if (isAccountRoute && !user) {
    const login = request.nextUrl.clone()
    login.pathname = '/login'
    login.searchParams.set('next', `${request.nextUrl.pathname}${request.nextUrl.search}`)
    return NextResponse.redirect(login)
  }

  return supabaseResponse
}
