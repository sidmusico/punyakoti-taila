import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

import { runImageKitMediaSeed } from '@/seed/runImageKitMediaSeed'
import { isSeedApiAuthorized } from '@/seed/seedApiAuth'

/**
 * Seed Payload `media` from the generated ImageKit catalog
 * (src/seed/imagekitCatalog.generated.ts).
 *
 * Run `pnpm imagekit:list` first to refresh the catalog from your ImageKit
 * account; then hit this endpoint to materialise Payload docs for each file.
 *
 * Idempotent: rows are matched by `alt`. Existing rows are patched with
 * ImageKit metadata; matching rows are skipped.
 *
 * `?force=1` is accepted for API parity with the homepage seed but is
 * currently a no-op here.
 */
export async function GET(req: NextRequest) {
  if (!isSeedApiAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const forceParam = req.nextUrl.searchParams.get('force')
  const force = forceParam === '1' || forceParam === 'true'

  const payload = await getPayload({ config })
  const { results } = await runImageKitMediaSeed(payload)

  const summary = {
    total: results.length,
    created: results.filter((r) => r.status === 'created').length,
    updated: results.filter((r) => r.status === 'updated').length,
    skipped: results.filter((r) => r.status === 'skipped').length,
    errors: results.filter((r) => r.status === 'error').length,
  }

  return NextResponse.json({ summary, results, force }, { status: 200 })
}
