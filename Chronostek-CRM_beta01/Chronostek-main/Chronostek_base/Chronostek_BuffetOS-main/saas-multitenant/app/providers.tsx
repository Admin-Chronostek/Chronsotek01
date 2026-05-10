'use client'

import { ReactNode } from 'react'

interface ProviderProps {
  children: ReactNode
}

export function Providers({ children }: ProviderProps) {
  return <>{children}</>
}
