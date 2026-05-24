import type { Metadata } from 'next'
import React from 'react'
import { CheckoutClient } from '@/components/shop/CheckoutClient'

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Complete your Punyakoti Taila order',
}

export default function CheckoutPage() {
  return <CheckoutClient />
}
