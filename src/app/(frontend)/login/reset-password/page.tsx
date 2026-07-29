import type { Metadata } from 'next'
import React, { Suspense } from 'react'

import { ResetPasswordClient } from '@/components/shop/ResetPasswordClient'

export const metadata: Metadata = {
  title: 'Reset password',
  description: 'Set a new password for your Punyakoti Taila account',
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Suspense fallback={null}>
        <ResetPasswordClient />
      </Suspense>
    </div>
  )
}
