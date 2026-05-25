import type { GlobalAfterChangeHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateHomepage: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info('Revalidating homepage')
    /** Next.js 16: `'max'` is stale-while-revalidate — editors expect immediate CMS updates. */
    revalidateTag('global_homepage-settings', { expire: 0 })
    revalidatePath('/')
  }
  return doc
}
