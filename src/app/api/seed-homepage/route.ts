import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

import { revalidateHomepageCaches } from '@/lib/revalidateHomepageCaches'
import { runHomepageTabSeed } from '@/seed/runHomepageTabSeed'
import { isSeedApiAuthorized } from '@/seed/seedApiAuth'

/**
 * Seeds Globals → Homepage with tab-based defaults (all homepage bands).
 * Optional: `?force=1` to overwrite existing content.
 */
export async function GET(req: NextRequest) {
  if (!isSeedApiAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const force = req.nextUrl.searchParams.get('force') === '1' || req.nextUrl.searchParams.get('force') === 'true'

  const payload = await getPayload({ config })
  const result = await runHomepageTabSeed(payload, { force })

  if (result.status === 'created') {
    revalidateHomepageCaches()
  }

  return NextResponse.json({ result, force }, { status: 200 })
}
