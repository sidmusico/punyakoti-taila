import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

import { runStorefrontGlobalsSeed } from '@/seed/runStorefrontGlobalsSeed'
import { isSeedApiAuthorized } from '@/seed/seedApiAuth'

/**
 * Seeds storefront globals + homepage-settings (JSON export or tab defaults).
 * Homepage-only overwrite: GET /api/seed-homepage (?force=1).
 * Does not touch `pages` or `products`.
 */
export async function GET(req: NextRequest) {
  if (!isSeedApiAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await getPayload({ config })
  const { results } = await runStorefrontGlobalsSeed(payload)

  const summary = {
    total: results.length,
    created: results.filter((r) => r.status === 'created').length,
    skipped: results.filter((r) => r.status === 'skipped').length,
    errors: results.filter((r) => r.status === 'error').length,
  }

  return NextResponse.json({ summary, results }, { status: 200 })
}
