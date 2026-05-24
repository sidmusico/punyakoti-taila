import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

import { runSitePagesSeed } from '@/seed/runSitePagesSeed'
import { isSeedApiAuthorized } from '@/seed/seedApiAuth'

/** Seeds only the `pages` collection (block layouts). Idempotent by slug. */
export async function GET(req: NextRequest) {
  if (!isSeedApiAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await getPayload({ config })
  const { results } = await runSitePagesSeed(payload)

  const summary = {
    total: results.length,
    created: results.filter((r) => r.status === 'created').length,
    skipped: results.filter((r) => r.status === 'skipped').length,
    errors: results.filter((r) => r.status === 'error').length,
  }

  return NextResponse.json({ summary, results }, { status: 200 })
}
