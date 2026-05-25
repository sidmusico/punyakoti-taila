import type { Payload } from 'payload'

import { homepageTabDefaults, isHomepageGlobalUnset } from '@/seed/homepageTabDefaults'

export type HomepageTabSeedResult = {
  slug: 'homepage-settings'
  status: 'created' | 'skipped'
}

/**
 * Writes tab-based homepage defaults into Globals → Homepage.
 * Skips when the global already looks configured unless `force` is true.
 */
export async function runHomepageTabSeed(
  payload: Payload,
  opts?: { force?: boolean },
): Promise<HomepageTabSeedResult> {
  const existing = await payload.findGlobal({
    slug: 'homepage-settings',
    depth: 0,
    overrideAccess: true,
  })

  if (!opts?.force && !isHomepageGlobalUnset(existing)) {
    return { slug: 'homepage-settings', status: 'skipped' }
  }

  await payload.updateGlobal({
    slug: 'homepage-settings',
    overrideAccess: true,
    context: { disableRevalidate: true },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: JSON.parse(JSON.stringify(homepageTabDefaults)) as any,
  })

  return { slug: 'homepage-settings', status: 'created' }
}
