import type { Payload } from 'payload'

import { SERVICE_LOCATIONS_CATALOG } from '@/seed/serviceLocationsCatalogSeed'
import { seedWriteContext } from '@/seed/seedContext'

export type ServiceLocationSeedResult = {
  cityName: string
  status: 'created' | 'skipped' | 'error'
  id?: string | number
  error?: string
}

export async function runServiceLocationsSeed(
  payload: Payload,
): Promise<{ results: ServiceLocationSeedResult[] }> {
  const results: ServiceLocationSeedResult[] = []

  for (const row of SERVICE_LOCATIONS_CATALOG) {
    try {
      const existing = await payload.find({
        collection: 'service-locations',
        where: { cityName: { equals: row.cityName } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      })

      if (existing.docs[0]) {
        results.push({
          cityName: row.cityName,
          status: 'skipped',
          id: existing.docs[0].id,
        })
        continue
      }

      const created = await payload.create({
        collection: 'service-locations',
        overrideAccess: true,
        context: seedWriteContext,
        data: {
          cityName: row.cityName,
          state: row.state,
          displayOrder: row.displayOrder,
          enabled: true,
        },
      })

      results.push({ cityName: row.cityName, status: 'created', id: created.id })
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      results.push({ cityName: row.cityName, status: 'error', error: message })
    }
  }

  return { results }
}
