import type { GlobalConfig } from 'payload'

import { revalidateGlobalSlug } from '@/globals/hooks/revalidateGlobalSlug'
import { pdpFields } from '@/globals/storefrontFieldGroups/fields'

const SLUG = 'product-detail'

export const ProductDetail: GlobalConfig = {
  slug: SLUG,
  label: 'Product detail',
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobalSlug(SLUG)] },
  fields: pdpFields,
}
