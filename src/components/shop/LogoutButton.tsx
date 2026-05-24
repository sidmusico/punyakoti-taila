'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Icons } from '@/components/ui/pt/Icons'

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/users/logout', { method: 'POST', credentials: 'include' })
    router.push('/')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-cream-300"
      style={{ borderColor: 'var(--cream-400)', color: 'var(--ink-500)' }}
    >
      <Icons.arrowRight size={14} style={{ transform: 'rotate(180deg)' }} />
      Sign out
    </button>
  )
}
