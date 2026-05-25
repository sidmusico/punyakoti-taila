import { revalidatePath, revalidateTag } from 'next/cache'

/** Invalidate Next caches for `/` and homepage global after CMS or seed updates. */
export function revalidateHomepageCaches(): void {
  try {
    revalidateTag('global_homepage-settings', { expire: 0 })
    revalidatePath('/')
  } catch {
    /* next/cache only in App Router server */
  }
}
