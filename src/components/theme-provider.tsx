"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const pathname = usePathname()
  const isPublicPage = ['/', '/login', '/signup', '/pending-verification'].includes(pathname)

  return <NextThemesProvider {...props} forcedTheme={isPublicPage ? 'light' : undefined}>{children}</NextThemesProvider>
}
