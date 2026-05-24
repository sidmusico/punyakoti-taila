import React from 'react'

import type { StorefrontBundle } from '@/utilities/getStorefrontBundle'

import { HeaderThemeProvider } from './HeaderTheme'
import { StorefrontCopyProvider } from './StorefrontCopyProvider'
import { ThemeProvider } from './Theme'

export const Providers: React.FC<{
  children: React.ReactNode
  storefrontBundle: StorefrontBundle
}> = ({ children, storefrontBundle }) => {
  return (
    <ThemeProvider>
      <HeaderThemeProvider>
        <StorefrontCopyProvider value={storefrontBundle}>{children}</StorefrontCopyProvider>
      </HeaderThemeProvider>
    </ThemeProvider>
  )
}
