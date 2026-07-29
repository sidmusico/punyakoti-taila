import type { Payload } from 'payload'

import type { Cart, Product } from '@/payload-types'

import { formatDeliveryEta } from '@/lib/orders/formatDeliveryEta'
import { firstProductPhoto } from '@/lib/product-media'

/* ────────────────────────────────────────────────────────────────────────────
   Authoritative, server-side order pricing.

   Never trust client-sent prices/totals. Line prices are re-derived from the
   Payload product variant (with the same subscribe-&-save rule the PDP uses);
   shipping + promo are recomputed from CMS config. The client `unitPrice` is
   only a fallback when a product can't be found (e.g. removed from the catalog).
──────────────────────────────────────────────────────────────────────────── */

export type CheckoutItemInput = {
  productId?: string | number | null
  slug?: string | null
  sku?: string | null
  name: string
  variantSize: string
  quantity: number
  isSubscription?: boolean
  /** Client hint — used only when the product/variant can't be resolved. */
  unitPrice?: number | null
}

export type PricedLine = {
  product: number | null
  productName: string
  variantSize: string
  sku?: string
  quantity: number
  unitPrice: number
  lineTotal: number
  isSubscription: boolean
  imageUrl?: string
}

export type DeliverySnapshot = {
  methodId: string
  label: string
  badge?: string
  catalogFee: number
  freeOverThreshold: boolean
  etaMinDays: number
  etaMaxDays: number
  noteSuffix?: string
  etaLabel: string
  leaveAtDoor?: boolean
}

export type OrderPricing = {
  lineItems: PricedLine[]
  subtotal: number
  discount: number
  couponCode?: string
  shippingFee: number
  deliveryMethod?: string
  deliveryDetails?: DeliverySnapshot
  total: number
}

/** Demo promo table — swap for a coupons collection when that lands. */
const PROMOS: Record<string, number> = { WELCOME15: 15 }

const DEFAULT_BELOW_THRESHOLD_FEE = 99

/** PDP rule: variant.subscribePrice ?? product.subscribePrice ?? round(price × 0.85). */
function subscribePriceFor(product: Product | null, variant: NonNullable<Product['variants']>[number]): number {
  const productSub = (product as { subscribePrice?: number | null } | null)?.subscribePrice
  return variant.subscribePrice ?? productSub ?? Math.round(variant.price * 0.85)
}

async function resolveProduct(payload: Payload, item: CheckoutItemInput): Promise<Product | null> {
  const idNum = Number(item.productId)
  if (Number.isFinite(idNum) && idNum > 0) {
    const byId = await payload.findByID({ collection: 'products', id: idNum, depth: 1 }).catch(() => null)
    if (byId) return byId as Product
  }
  if (item.slug) {
    const res = await payload
      .find({ collection: 'products', where: { slug: { equals: item.slug } }, limit: 1, depth: 1 })
      .catch(() => null)
    if (res?.docs?.[0]) return res.docs[0] as Product
  }
  return null
}

export async function computeOrderPricing(
  payload: Payload,
  input: {
    items: CheckoutItemInput[]
    deliveryMethodId?: string | null
    leaveAtDoor?: boolean
    promoCode?: string | null
    checkout?: Cart['checkout']
    freeShippingThreshold: number
  },
): Promise<OrderPricing> {
  const lineItems: PricedLine[] = []

  for (const item of input.items) {
    const qty = Math.max(1, Math.round(item.quantity || 1))
    const isSubscription = Boolean(item.isSubscription)
    const product = await resolveProduct(payload, item)
    const variant = product?.variants?.find((v) => v.size === item.variantSize) ?? null

    let unitPrice: number
    let sku: string | undefined
    let productName: string
    if (variant) {
      unitPrice = isSubscription ? subscribePriceFor(product, variant) : variant.price
      sku = variant.sku
      productName = (product as { title?: string } | null)?.title ?? item.name
    } else {
      // Product/variant not resolvable — fall back to the client hint.
      unitPrice = Math.max(0, Math.round(item.unitPrice ?? 0))
      sku = item.sku ?? undefined
      productName = item.name
    }

    lineItems.push({
      product: product?.id ?? null,
      productName,
      variantSize: item.variantSize,
      sku,
      quantity: qty,
      unitPrice,
      lineTotal: unitPrice * qty,
      isSubscription,
      imageUrl: product ? firstProductPhoto(product)?.src : undefined,
    })
  }

  const subtotal = lineItems.reduce((sum, l) => sum + l.lineTotal, 0)

  const code = (input.promoCode ?? '').trim().toUpperCase()
  const pct = PROMOS[code]
  const discount = pct ? Math.round((subtotal * pct) / 100) : 0
  const couponCode = pct ? code : undefined
  const afterDiscount = Math.max(0, subtotal - discount)

  const methods = input.checkout?.deliveryMethods ?? []
  const chosen = methods.find((m) => m.methodId === input.deliveryMethodId) ?? methods[0] ?? null

  let shippingFee: number
  let deliveryMethod: string | undefined
  let deliveryDetails: DeliverySnapshot | undefined
  if (chosen) {
    deliveryMethod = chosen.label
    shippingFee = chosen.freeOverThreshold
      ? afterDiscount >= input.freeShippingThreshold
        ? 0
        : chosen.fee ?? 0
      : chosen.fee ?? 0
    const etaMin = chosen.etaMinDays ?? 0
    const etaMax = chosen.etaMaxDays ?? etaMin
    deliveryDetails = {
      methodId: chosen.methodId,
      label: chosen.label,
      badge: chosen.badge ?? undefined,
      catalogFee: chosen.fee ?? 0,
      freeOverThreshold: Boolean(chosen.freeOverThreshold),
      etaMinDays: etaMin,
      etaMaxDays: etaMax,
      noteSuffix: chosen.noteSuffix ?? undefined,
      etaLabel: formatDeliveryEta(etaMin, etaMax, chosen.noteSuffix),
      ...(input.leaveAtDoor ? { leaveAtDoor: true } : {}),
    }
  } else {
    // No CMS methods configured — mirror the checkout fallback.
    shippingFee = afterDiscount >= input.freeShippingThreshold ? 0 : DEFAULT_BELOW_THRESHOLD_FEE
  }

  const total = afterDiscount + shippingFee
  return { lineItems, subtotal, discount, couponCode, shippingFee, deliveryMethod, deliveryDetails, total }
}
