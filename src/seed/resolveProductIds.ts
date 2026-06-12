import type { Payload } from 'payload'

/** Resolve product slugs to Payload IDs, preserving input order. */
export async function productIdsBySlugs(
  payload: Payload,
  slugs: readonly string[],
): Promise<Array<string | number>> {
  const ids: Array<string | number> = []
  for (const slug of slugs) {
    const hit = await payload.find({
      collection: 'products',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    if (hit.docs[0]) ids.push(hit.docs[0].id)
  }
  return ids
}
