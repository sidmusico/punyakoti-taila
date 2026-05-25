import type { GlobalAfterChangeHook } from 'payload'
import { revalidateTag } from 'next/cache'

/** Revalidate Next cache tag `global_<slug>` after a global document changes. */
export function revalidateGlobalSlug(slug: string): GlobalAfterChangeHook {
  return ({ doc, req: { payload, context } }) => {
    if (!context.disableRevalidate) {
      payload.logger.info(`Revalidating global: ${slug}`)
      revalidateTag(`global_${slug}`, { expire: 0 })
    }
    return doc
  }
}
