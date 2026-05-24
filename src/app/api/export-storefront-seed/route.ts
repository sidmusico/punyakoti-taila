import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

function isAuthorized(req: NextRequest): boolean {
  if (process.env.NODE_ENV === 'development') return true
  const auth = req.headers.get('x-cron-secret') ?? req.nextUrl.searchParams.get('secret')
  return auth === process.env.CRON_SECRET
}

const GLOBAL_SLUGS = [
  'shop-listing',
  'product-detail',
  'cart',
  'account',
  'order-success',
  'homepage-settings',
] as const

/**
 * Writes JSON snapshots of storefront-related Payload globals + homepage for version control / prod seeding.
 * Run after editing CMS: GET /api/export-storefront-seed (in development) or with `?secret=` / header matching `CRON_SECRET` in other environments.
 */
export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await getPayload({ config })
  const docs = await Promise.all(
    GLOBAL_SLUGS.map((slug) => payload.findGlobal({ slug, depth: 2 })),
  )

  const dir = path.join(process.cwd(), 'src', 'seed', 'generated')
  await mkdir(dir, { recursive: true })

  const wrote: string[] = []

  for (let i = 0; i < GLOBAL_SLUGS.length; i++) {
    const slug = GLOBAL_SLUGS[i]!
    const filename = `${slug}.json`
    const fp = path.join(dir, filename)
    await writeFile(fp, JSON.stringify(docs[i], null, 2), 'utf8')
    wrote.push(fp.replace(process.cwd(), '.'))
  }

  return NextResponse.json({ ok: true, wrote })
}
