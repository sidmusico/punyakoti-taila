import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

import { runMediaCatalogSeed } from '@/seed/runMediaCatalogSeed'
import { isSeedApiAuthorized } from '@/seed/seedApiAuth'

/**
 * Seed Payload `media` rows from the static catalog. Idempotent.
 *
 * `?force=1` is accepted for API parity but is currently a no-op here.
 */
export async function GET(req: NextRequest) {
  if (!isSeedApiAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const forceParam = req.nextUrl.searchParams.get('force')
  const force = forceParam === '1' || forceParam === 'true'

  const payload = await getPayload({ config })
  const { results } = await runMediaCatalogSeed(payload)

  const summary = {
    total: results.length,
    created: results.filter((r) => r.status === 'created').length,
    skipped: results.filter((r) => r.status === 'skipped').length,
    errors: results.filter((r) => r.status === 'error').length,
  }

  return NextResponse.json({ summary, results, force }, { status: 200 })
}
