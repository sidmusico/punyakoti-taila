import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import type { Account, Cart, OrderSuccess, ProductDetail, ShopListing } from '@/payload-types'

/** Shape the Next app expects (matches the former single `storefront-pages` global). */
export type StorefrontMerged = {
  plp: ShopListing['plp']
  pdp: ProductDetail['pdp']
  cartDrawer: Cart['cartDrawer']
  cartPage: Cart['cartPage']
  checkout: Cart['checkout']
  account: Account['account']
  orderSuccess: OrderSuccess['orderSuccess']
}

export type StorefrontBundle = {
  storefront: StorefrontMerged
  freeShippingThreshold: number
}

const CACHE_TAGS = [
  'global_shop-listing',
  'global_product-detail',
  'global_cart',
  'global_account',
  'global_order-success',
  'global_site-settings',
] as const

export const getStorefrontBundle = unstable_cache(
  async (): Promise<StorefrontBundle> => {
    const payload = await getPayload({ config })
    const [shopListing, productDetail, cart, account, orderSuccess, site] = await Promise.all([
      payload.findGlobal({ slug: 'shop-listing', depth: 2 }),
      payload.findGlobal({ slug: 'product-detail', depth: 2 }),
      payload.findGlobal({ slug: 'cart', depth: 2 }),
      payload.findGlobal({ slug: 'account', depth: 2 }),
      payload.findGlobal({ slug: 'order-success', depth: 2 }),
      payload.findGlobal({ slug: 'site-settings', depth: 0 }),
    ])

    const threshold =
      typeof site.freeShippingThreshold === 'number' ? site.freeShippingThreshold : 999

    const storefront: StorefrontMerged = {
      plp: shopListing.plp,
      pdp: productDetail.pdp,
      cartDrawer: cart.cartDrawer,
      cartPage: cart.cartPage,
      checkout: cart.checkout,
      account: account.account,
      orderSuccess: orderSuccess.orderSuccess,
    }

    return { storefront, freeShippingThreshold: threshold }
  },
  ['storefront-bundle-v3'],
  { tags: [...CACHE_TAGS], revalidate: 3600 },
)
