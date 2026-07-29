/**
 * URL path segments that have dedicated App Router routes under `src/app/(frontend)/`.
 * Must not be used as Payload `pages` collection slugs or as `[slug]` SSG paths —
 * otherwise `generateStaticParams` can prerender `/shop` (etc.) from the CMS catch-all
 * and shadow the real storefront routes at build time.
 */
export const RESERVED_APP_ROUTE_SLUGS = new Set([
  'home',
  'shop',
  'cart',
  'checkout',
  'account',
  'login',
  'posts',
  'search',
  'order',
])

export function isReservedAppRouteSlug(slug: string): boolean {
  return RESERVED_APP_ROUTE_SLUGS.has(slug)
}
