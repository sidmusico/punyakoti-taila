import canUseDOM from './canUseDOM'

/** Server-side canonical storefront origin (no trailing slash). */
export const getServerSideURL = (): string => {
  if (process.env.NEXT_PUBLIC_SERVER_URL) {
    return process.env.NEXT_PUBLIC_SERVER_URL.replace(/\/$/, '')
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, '')}`
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.replace(/\/$/, '')}`
  }

  return 'http://localhost:3000'
}

export const getClientSideURL = (): string => {
  if (canUseDOM) {
    return window.location.origin
  }

  return getServerSideURL()
}
