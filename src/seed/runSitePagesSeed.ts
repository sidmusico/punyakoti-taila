import type { Payload } from 'payload'

import { seedWriteContext } from '@/seed/seedContext'
import { SITE_PAGES_SEED } from '@/seed/sitePagesSeed'
import { isReservedAppRouteSlug } from '@/lib/reservedAppRoutes'

export type PageSeedResult = {
  kind: 'page'
  title: string
  slug: string
  status: 'created' | 'skipped' | 'error'
  id?: string | number
  error?: string
}

/** Idempotent `pages` collection entries (slug match). Full block layout per page. */
export async function runSitePagesSeed(payload: Payload): Promise<{ results: PageSeedResult[] }> {
  const results: PageSeedResult[] = []

  for (const page of SITE_PAGES_SEED) {
    if (isReservedAppRouteSlug(page.slug)) {
      results.push({
        kind: 'page',
        title: page.title,
        slug: page.slug,
        status: 'skipped',
        error: 'reserved app route — use dedicated Next.js page',
      })
      continue
    }

    try {
      const existing = await payload.find({
        collection: 'pages',
        where: { slug: { equals: page.slug } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      })

      if (existing.docs.length > 0) {
        results.push({
          kind: 'page',
          title: page.title,
          slug: page.slug,
          status: 'skipped',
          id: existing.docs[0]!.id,
        })
        continue
      }

      const created = await payload.create({
        collection: 'pages',
        overrideAccess: true,
        context: seedWriteContext,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: {
          title: page.title,
          slug: page.slug,
          layout: page.layout as any,
          _status: 'published',
          publishedAt: new Date().toISOString(),
        } as any,
      })

      results.push({
        kind: 'page',
        title: page.title,
        slug: page.slug,
        status: 'created',
        id: created.id,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      results.push({
        kind: 'page',
        title: page.title,
        slug: page.slug,
        status: 'error',
        error: message,
      })
    }
  }

  return { results }
}
