'use client'

import React, { createContext, useContext } from 'react'
import type { StorefrontBundle } from '@/utilities/getStorefrontBundle'

const StorefrontBundleContext = createContext<StorefrontBundle | null>(null)

export function StorefrontCopyProvider({
  value,
  children,
}: {
  value: StorefrontBundle
  children: React.ReactNode
}) {
  return <StorefrontBundleContext.Provider value={value}>{children}</StorefrontBundleContext.Provider>
}

export function useStorefrontBundle(): StorefrontBundle {
  const ctx = useContext(StorefrontBundleContext)
  if (!ctx) {
    throw new Error('useStorefrontBundle must be used within StorefrontCopyProvider')
  }
  return ctx
}
