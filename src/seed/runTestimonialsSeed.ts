import type { Payload } from 'payload'

import { resolveImageKitMediaId } from '@/seed/imageKitMediaResolve'
import { TESTIMONIALS_CATALOG } from '@/seed/testimonialsCatalogSeed'

export type TestimonialSeedResult = {
  customerName: string
  status: 'created' | 'updated' | 'skipped' | 'error'
  id?: string | number
  error?: string
}

export interface TestimonialsSeedOptions {
  /** Patch existing rows (matched by customer name) with latest seed copy + photo. */
  force?: boolean
}

export async function runTestimonialsSeed(
  payload: Payload,
  opts: TestimonialsSeedOptions = {},
): Promise<{ results: TestimonialSeedResult[] }> {
  const results: TestimonialSeedResult[] = []
  const force = opts.force === true

  for (const row of TESTIMONIALS_CATALOG) {
    try {
      const existing = await payload.find({
        collection: 'testimonials',
        where: { customerName: { equals: row.customerName } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      })

      const photoId = await resolveImageKitMediaId(payload, row.photoAlt)

      const data = {
        customerName: row.customerName,
        customerLocation: row.customerLocation,
        title: row.title,
        body: row.body,
        rating: row.rating,
        featuredOnHome: row.featuredOnHome,
        status: row.status,
        ...(photoId != null ? { photo: photoId } : {}),
      }

      if (existing.docs[0]) {
        if (!force) {
          results.push({
            customerName: row.customerName,
            status: 'skipped',
            id: existing.docs[0].id,
          })
          continue
        }
        const updated = await payload.update({
          collection: 'testimonials',
          id: existing.docs[0].id,
          data,
          overrideAccess: true,
        })
        results.push({ customerName: row.customerName, status: 'updated', id: updated.id })
        continue
      }

      const created = await payload.create({
        collection: 'testimonials',
        data,
        overrideAccess: true,
      })
      results.push({ customerName: row.customerName, status: 'created', id: created.id })
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      results.push({ customerName: row.customerName, status: 'error', error: message })
    }
  }

  return { results }
}
