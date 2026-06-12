import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

import { runTestimonialsSeed } from '@/seed/runTestimonialsSeed'
import { isSeedApiAuthorized } from '@/seed/seedApiAuth'

/** Seed homepage testimonials with portraits from ImageKit `people/` assets. */
export async function GET(req: NextRequest) {
  if (!isSeedApiAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const forceParam = req.nextUrl.searchParams.get('force')
  const force = forceParam === '1' || forceParam === 'true'

  const payload = await getPayload({ config })
  const { results } = await runTestimonialsSeed(payload, { force })

  const summary = {
    total: results.length,
    created: results.filter((r) => r.status === 'created').length,
    updated: results.filter((r) => r.status === 'updated').length,
    skipped: results.filter((r) => r.status === 'skipped').length,
    errors: results.filter((r) => r.status === 'error').length,
  }

  return NextResponse.json({ summary, results, force }, { status: 200 })
}
