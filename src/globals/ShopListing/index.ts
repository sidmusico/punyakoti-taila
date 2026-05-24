import type { GlobalConfig } from 'payload'

import { revalidateGlobalSlug } from '@/globals/hooks/revalidateGlobalSlug'
import { plpFields } from '@/globals/storefrontFieldGroups/fields'

const SLUG = 'shop-listing'

export const ShopListing: GlobalConfig = {
  slug: SLUG,
  label: 'Shop listing',
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobalSlug(SLUG)] },
  /** Inner tabs live on the `plp` group (see storefrontFieldGroups/fields). */
  fields: plpFields,
}
