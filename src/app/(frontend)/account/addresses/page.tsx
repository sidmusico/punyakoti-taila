import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { AddressBook } from '@/components/shop/AddressBook'
import { resolveAddressCopy } from '@/components/shop/AddressCopy'
import { getStorefrontSession } from '@/lib/auth/getStorefrontSession'
import { getStorefrontBundle } from '@/utilities/getStorefrontBundle'

export const metadata: Metadata = {
  title: 'Your addresses',
}

export default async function AccountAddressesPage() {
  const session = await getStorefrontSession()
  if (!session) redirect('/login')

  const { customer } = session
  const { storefront } = await getStorefrontBundle()
  const copy = resolveAddressCopy(storefront.account)

  return (
    <div className="pt-page-container py-8 max-w-3xl">
      <Link href="/account" className="text-sm mb-6 inline-block" style={{ color: 'var(--green-700)' }}>
        ← Back to account
      </Link>
      <h1
        className="mb-2"
        style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', color: 'var(--green-900)' }}
      >
        {copy.title}
      </h1>
      <p className="text-sm mb-8" style={{ color: 'var(--ink-500)' }}>
        {copy.subtitle}
      </p>

      <AddressBook initialAddresses={customer.addresses ?? []} copy={copy} />
    </div>
  )
}
