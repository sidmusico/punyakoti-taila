import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

import { runCategoriesSeed } from '@/seed/runCategoriesSeed'
import { isSeedApiAuthorized } from '@/seed/seedApiAuth'

/**
 * Seeds taxonomy categories. Idempotent: existing rows (matched by slug) are
 * left alone.
 *
 * `?force=1` is accepted for API parity with the homepage seed but is
 * currently a no-op here — categories are append-only. To wipe and reseed,
 * delete the rows in the admin first.
 */
export async function GET(req: NextRequest) {
  if (!isSeedApiAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const forceParam = req.nextUrl.searchParams.get('force')
  const force = forceParam === '1' || forceParam === 'true'

  const payload = await getPayload({ config })
  const { results } = await runCategoriesSeed(payload)

  const summary = {
    total: results.length,
    created: results.filter((r) => r.status === 'created').length,
    skipped: results.filter((r) => r.status === 'skipped').length,
    errors: results.filter((r) => r.status === 'error').length,
  }

  return NextResponse.json({ summary, results, force }, { status: 200 })
}
