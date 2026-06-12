import { getServerSideURL } from '@/utilities/getURL'

function stripTrailingSlash(url: string): string {
  return url.replace(/\/$/, '')
}

function isLocalOrigin(origin: string): boolean {
  return /localhost|127\.0\.0\.1/i.test(origin)
}

/**
 * Canonical site origin for Supabase auth redirects (no trailing slash).
 *
 * - **Browser on prod/preview:** uses `window.location.origin` (custom domains, Vercel previews).
 * - **Browser on localhost:** uses `NEXT_PUBLIC_SERVER_URL` when set (matches `supabase/config.toml`).
 * - **Server:** request `Origin` / URL origin, else `NEXT_PUBLIC_SERVER_URL`, else Vercel helpers.
 */
export function getAuthOrigin(opts?: {
  requestOrigin?: string
  browserOrigin?: string
}): string {
  const envOrigin = process.env.NEXT_PUBLIC_SERVER_URL
    ? stripTrailingSlash(process.env.NEXT_PUBLIC_SERVER_URL)
    : undefined

  if (opts?.browserOrigin) {
    const browser = stripTrailingSlash(opts.browserOrigin)
    if (!isLocalOrigin(browser)) return browser
    return envOrigin ?? browser
  }

  if (opts?.requestOrigin) {
    return stripTrailingSlash(opts.requestOrigin)
  }

  return envOrigin ?? stripTrailingSlash(getServerSideURL())
}

/** Full OAuth / email confirmation callback URL for Supabase `redirectTo`. */
export function getAuthCallbackUrl(opts?: {
  requestOrigin?: string
  browserOrigin?: string
}): string {
  return `${getAuthOrigin(opts)}/auth/callback`
}
