import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

import { revalidateHomepageCaches } from '@/lib/revalidateHomepageCaches'
import { runHomepageTabSeed } from '@/seed/runHomepageTabSeed'
import { isSeedApiAuthorized } from '@/seed/seedApiAuth'

/**
 * Seeds Globals → Homepage with tab-based defaults (all homepage bands).
 *
 * Behaviour:
 *   - Default (no query):  **incremental** — only newly added / empty fields
 *     get filled. Edits the admin made in the CMS survive untouched.
 *   - `?force=1`:          overwrite the entire global with the defaults
 *     document. Destructive — use when you want to reset homepage content.
 *
 * Response includes `filledPaths` so callers know exactly which fields were
 * written by this run.
 */
export async function GET(req: NextRequest) {
  if (!isSeedApiAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const forceParam = req.nextUrl.searchParams.get('force')
  const force = forceParam === '1' || forceParam === 'true'

  const payload = await getPayload({ config })
  const result = await runHomepageTabSeed(payload, { force })

  if (result.status === 'created' || result.status === 'updated' || result.status === 'forced') {
    revalidateHomepageCaches()
  }

  return NextResponse.json({ result, force }, { status: 200 })
}
