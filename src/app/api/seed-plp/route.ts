import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

import { runPlpCatalogSeed } from '@/seed/runPlpCatalogSeed'
import { isSeedApiAuthorized } from '@/seed/seedApiAuth'

/**
 * Seed the PLP-specific catalog: 5 chip categories + Karnataka-district products.
 * Idempotent — existing slugs are skipped.
 *
 * Pass `?force=1` (or `?force=true`) to **patch** existing products in place
 * with the latest values from `PLP_PRODUCTS` (description, tag, tagline,
 * useCases, …). Variants and images are left untouched so admin edits and
 * uploaded media survive.
 */
export async function GET(req: NextRequest) {
  if (!isSeedApiAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const forceParam = req.nextUrl.searchParams.get('force')
  const force = forceParam === '1' || forceParam === 'true'

  const payload = await getPayload({ config })
  const { results } = await runPlpCatalogSeed(payload, { force })

  const summary = {
    total: results.length,
    created: results.filter((r) => r.status === 'created').length,
    updated: results.filter((r) => r.status === 'updated').length,
    skipped: results.filter((r) => r.status === 'skipped').length,
    errors: results.filter((r) => r.status === 'error').length,
  }

  return NextResponse.json({ summary, results, force }, { status: 200 })
}
