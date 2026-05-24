import type { NextRequest } from 'next/server'

/** Same guard as other seed routes: dev open, prod needs CRON_SECRET. */
export function isSeedApiAuthorized(req: NextRequest): boolean {
  if (process.env.NODE_ENV === 'development') return true
  const auth = req.headers.get('x-cron-secret') ?? req.nextUrl.searchParams.get('secret')
  return auth === process.env.CRON_SECRET
}
