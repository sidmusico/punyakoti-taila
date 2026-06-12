import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { ProfileForm } from '@/components/shop/ProfileForm'
import { getStorefrontSession } from '@/lib/auth/getStorefrontSession'

export const metadata: Metadata = {
  title: 'Edit profile',
}

export default async function AccountProfilePage() {
  const session = await getStorefrontSession()
  if (!session) redirect('/login')

  const { customer } = session

  return (
    <div className="pt-page-container py-8 max-w-2xl">
      <Link href="/account" className="text-sm mb-6 inline-block" style={{ color: 'var(--green-700)' }}>
        ← Back to account
      </Link>
      <h1
        className="mb-2"
        style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', color: 'var(--green-900)' }}
      >
        Edit profile
      </h1>
      <p className="text-sm mb-8" style={{ color: 'var(--ink-500)' }}>
        Update your name and contact details. Sign-in method (Google, phone, or email) is managed by your login.
      </p>
      <ProfileForm initialName={customer.name ?? ''} initialPhone={customer.phone ?? ''} />
    </div>
  )
}
