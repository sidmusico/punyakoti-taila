import type { GlobalConfig } from 'payload'

import { revalidateGlobalSlug } from '@/globals/hooks/revalidateGlobalSlug'
import { orderSuccessFields } from '@/globals/storefrontFieldGroups/fields'

const SLUG = 'order-success'

export const OrderSuccessSettings: GlobalConfig = {
  slug: SLUG,
  label: 'Order confirmation',
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobalSlug(SLUG)] },
  fields: orderSuccessFields,
}
