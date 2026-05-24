import type { GlobalConfig } from 'payload'

import { revalidateGlobalSlug } from '@/globals/hooks/revalidateGlobalSlug'
import { cartDrawerFields, cartPageFields } from '@/globals/storefrontFieldGroups/fields'

const SLUG = 'cart'

export const CartSettings: GlobalConfig = {
  slug: SLUG,
  label: 'Cart',
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobalSlug(SLUG)] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        { label: 'Cart drawer', fields: cartDrawerFields },
        { label: 'Cart page', fields: cartPageFields },
      ],
    },
  ],
}
