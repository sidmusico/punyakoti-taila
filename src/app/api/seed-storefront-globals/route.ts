import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

import { runStorefrontGlobalsSeed } from '@/seed/runStorefrontGlobalsSeed'
import { isSeedApiAuthorized } from '@/seed/seedApiAuth'

/**
 * Seeds storefront globals + homepage-settings (JSON export or tab defaults).
 * Homepage-only incremental + force: GET /api/seed-homepage (?force=1).
 * Does not touch `pages` or `products`.
 *
 * `?force=1` is accepted for API parity but is currently a no-op here.
 * Use `/api/seed-homepage?force=1` to reset the homepage global.
 */
export async function GET(req: NextRequest) {
  if (!isSeedApiAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const forceParam = req.nextUrl.searchParams.get('force')
  const force = forceParam === '1' || forceParam === 'true'

  const payload = await getPayload({ config })
  const { results } = await runStorefrontGlobalsSeed(payload)

  const summary = {
    total: results.length,
    created: results.filter((r) => r.status === 'created').length,
    skipped: results.filter((r) => r.status === 'skipped').length,
    errors: results.filter((r) => r.status === 'error').length,
  }

  return NextResponse.json({ summary, results, force }, { status: 200 })
}
