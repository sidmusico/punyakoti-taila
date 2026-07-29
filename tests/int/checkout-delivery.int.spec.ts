import { getPayload, Payload } from 'payload'
import config from '@/payload.config'
import { cartSeedDefaults } from '@/seed/storefrontSeedDefaults'

import { describe, it, beforeAll, expect } from 'vitest'

/**
 * Delivery methods are configured on the Cart global (Checkout tab) and read by
 * the /checkout wizard. This proves the field persists + reads back from the
 * local DB, and (as a side effect) populates the global with the default methods
 * so they are editable in the admin.
 */
describe('checkout delivery methods (Cart global)', () => {
  let payload: Payload

  beforeAll(async () => {
    payload = await getPayload({ config: await config })
  })

  it('persists and reads back the delivery methods', async () => {
    await payload.updateGlobal({
      slug: 'cart',
      data: { checkout: cartSeedDefaults.checkout as never },
      depth: 0,
      // Skip the Next revalidateTag hook — no request context in vitest.
      context: { disableRevalidate: true },
    })

    const cart = await payload.findGlobal({ slug: 'cart', depth: 0 })
    const methods = cart.checkout?.deliveryMethods ?? []

    expect(methods.length).toBeGreaterThanOrEqual(2)

    const standard = methods.find((m) => m.methodId === 'standard')
    expect(standard).toBeTruthy()
    expect(standard!.freeOverThreshold).toBe(true)
    expect(standard!.fee).toBe(99)

    const express = methods.find((m) => m.methodId === 'express')
    expect(express!.freeOverThreshold).toBeFalsy()
    expect(express!.fee).toBe(89)
    expect(express!.noteSuffix).toBe('before 6pm')

    expect(cart.checkout?.deliveryMethodLabel).toBe('Delivery method')
  })
})
