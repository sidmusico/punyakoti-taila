import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

import { runFullSiteSeed } from '@/seed/runFullSiteSeed'
import { isSeedApiAuthorized } from '@/seed/seedApiAuth'

/**
 * One-shot idempotent seed for a fresh DB: media → products (incl. categories) → pages → globals.
 * Does not reset Postgres. Run `pnpm cms:sync` first if schema changed.
 */
export async function GET(req: NextRequest) {
  if (!isSeedApiAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await getPayload({ config })
  const { steps } = await runFullSiteSeed(payload)

  const summary = {
    steps: steps.length,
    created: steps.reduce((n, s) => n + s.summary.created, 0),
    skipped: steps.reduce((n, s) => n + s.summary.skipped, 0),
    errors: steps.reduce((n, s) => n + s.summary.errors, 0),
  }

  return NextResponse.json({ summary, steps }, { status: 200 })
}
