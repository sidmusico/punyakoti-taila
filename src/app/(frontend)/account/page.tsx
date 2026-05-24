import type { Metadata } from 'next'
import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Icons } from '@/components/ui/pt/Icons'
import { LogoutButton } from '@/components/shop/LogoutButton'
import { getStorefrontBundle } from '@/utilities/getStorefrontBundle'

export async function generateMetadata(): Promise<Metadata> {
  const { storefront } = await getStorefrontBundle()
  return { title: storefront.account?.metaTitle ?? 'My Account' }
}

async function getCurrentUser() {
  try {
    const payload = await getPayload({ config: configPromise })
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')?.value
    if (!token) return null

    const { user } = await payload.auth({ headers: new Headers({ Authorization: `JWT ${token}` }) })
    return user
  } catch {
    return null
  }
}

function NavIcon({ icon }: { icon?: string | null }) {
  switch (icon) {
    case 'package':
      return <Icons.package size={16} />
    case 'heart':
      return <Icons.heart size={16} />
    case 'refresh':
      return <Icons.refresh size={16} />
    default:
      return <Icons.user size={16} />
  }
}

export default async function AccountPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const { storefront } = await getStorefrontBundle()
  const a = storefront.account
  const navItems = a?.navItems?.filter((n) => n.href && n.label) ?? []

  return (
    <div className="max-w-[1240px] mx-auto px-8 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--green-900)', margin: 0 }}>
            {a?.pageTitle ?? 'My Account'}
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--ink-400)' }}>{user.email}</p>
        </div>
        <LogoutButton />
      </div>

      <div className="grid md:grid-cols-[220px_1fr] gap-8">
        <nav className="flex flex-col gap-1">
          {navItems.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors hover:bg-cream-300"
              style={{ color: 'var(--ink-700)' }}
            >
              <span style={{ color: 'var(--green-700)' }}><NavIcon icon={icon} /></span>
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-6">
          <div className="rounded-2xl p-6" style={{ background: 'var(--cream-100)', border: '1px solid var(--cream-400)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--green-900)', marginBottom: 16 }}>
              {a?.profileCardTitle ?? 'Profile'}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { label: a?.labelName ?? 'Name', value: (user as { name?: string }).name || '—' },
                { label: a?.labelEmail ?? 'Email', value: user.email || '—' },
              ].map(({ label, value }) => (
                <div key={label} className="p-4 rounded-xl" style={{ background: 'var(--cream-200)' }}>
                  <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--ink-400)' }}>{label}</div>
                  <div className="text-sm font-medium" style={{ color: 'var(--ink-900)' }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-6" style={{ background: 'var(--cream-100)', border: '1px solid var(--cream-400)' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--green-900)' }}>
                {a?.ordersCardTitle ?? 'Recent orders'}
              </h2>
              <Link href="/account/orders" className="text-xs font-medium" style={{ color: 'var(--green-700)' }}>
                {a?.viewAllOrdersLabel ?? 'View all →'}
              </Link>
            </div>
            <div className="flex flex-col items-center py-10 gap-3 text-center">
              <Icons.package size={32} style={{ color: 'var(--ink-200)' }} />
              <p className="text-sm" style={{ color: 'var(--ink-400)' }}>{a?.emptyOrdersMessage}</p>
              <Link href="/shop" className="mt-1 px-5 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{ background: 'var(--green-800)', color: 'var(--cream-100)' }}>
                {a?.shopNowLabel ?? 'Shop now'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
