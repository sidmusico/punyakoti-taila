import type { Metadata } from 'next'
import React from 'react'
import { LoginClient } from '@/components/shop/LoginClient'

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to your Punyakoti Taila account',
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <LoginClient />
    </div>
  )
}
