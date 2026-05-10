import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard - Chronostek',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
