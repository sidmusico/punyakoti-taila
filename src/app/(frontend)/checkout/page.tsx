import type { Metadata } from 'next'
import React from 'react'
import { CheckoutClient } from '@/components/shop/CheckoutClient'
import { resolveAddressCopy } from '@/components/shop/AddressCopy'
import { getStorefrontSession } from '@/lib/auth/getStorefrontSession'
import { getStorefrontBundle } from '@/utilities/getStorefrontBundle'

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Complete your Punyakoti Taila order',
}

export default async function CheckoutPage() {
  // Logged-in shoppers get their saved addresses + contact prefilled; guests
  // see the blank form (session is null).
  const session = await getStorefrontSession()
  const { storefront, freeShippingThreshold } = await getStorefrontBundle()
  const addressCopy = resolveAddressCopy(storefront.account)
  const checkout = storefront.checkout

  return (
    <CheckoutClient
      savedAddresses={session?.customer.addresses ?? []}
      contact={{
        email: session?.customer.email ?? session?.email ?? null,
        phone: session?.customer.phone ?? session?.phone ?? null,
      }}
      copy={{
        useSaved: addressCopy.checkoutUseSavedLabel,
        useNew: addressCopy.checkoutUseNewLabel,
        billingSame: addressCopy.billingSameLabel,
      }}
      deliveryMethods={checkout?.deliveryMethods}
      deliveryMethodLabel={checkout?.deliveryMethodLabel}
      leaveAtDoorLabel={checkout?.leaveAtDoorLabel}
      freeShippingThreshold={freeShippingThreshold}
    />
  )
}
