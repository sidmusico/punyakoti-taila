import { describe, expect, it } from 'vitest'

import { isReservedAppRouteSlug, RESERVED_APP_ROUTE_SLUGS } from '@/lib/reservedAppRoutes'

describe('reservedAppRoutes', () => {
  it('reserves storefront routes that have dedicated App Router pages', () => {
    expect(RESERVED_APP_ROUTE_SLUGS.has('shop')).toBe(true)
    expect(RESERVED_APP_ROUTE_SLUGS.has('cart')).toBe(true)
    expect(RESERVED_APP_ROUTE_SLUGS.has('about')).toBe(false)
  })

  it('isReservedAppRouteSlug matches the set', () => {
    expect(isReservedAppRouteSlug('shop')).toBe(true)
    expect(isReservedAppRouteSlug('journal')).toBe(false)
  })
})
