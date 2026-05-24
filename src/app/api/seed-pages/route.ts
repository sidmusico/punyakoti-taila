import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

import { isSeedApiAuthorized } from '@/seed/seedApiAuth'
import { runSitePagesSeed } from '@/seed/runSitePagesSeed'
import { runStorefrontGlobalsSeed } from '@/seed/runStorefrontGlobalsSeed'

/**
 * Seeds **pages** (full block layouts) + **storefront / homepage globals** when empty.
 * For pages-only use GET /api/seed-site-pages; for globals-only use GET /api/seed-storefront-globals.
 */
export async function GET(req: NextRequest) {
  if (!isSeedApiAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await getPayload({ config })

  const { results: pageResults } = await runSitePagesSeed(payload)
  const { results: globalResults } = await runStorefrontGlobalsSeed(payload)

  const results = [
    ...pageResults.map((r) => ({
      title: r.title,
      slug: r.slug,
      status: r.status,
      id: r.id,
      error: r.error,
      group: 'pages' as const,
    })),
    ...globalResults.map((r) => ({
      title: r.title,
      slug: r.slug,
      status: r.status,
      id: r.id,
      error: r.error,
      group: 'globals' as const,
    })),
  ]

  const summary = {
    total: results.length,
    created: results.filter((r) => r.status === 'created').length,
    skipped: results.filter((r) => r.status === 'skipped').length,
    errors: results.filter((r) => r.status === 'error').length,
  }

  return NextResponse.json({ summary, results }, { status: 200 })
}
