'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  
  const modules = [
    { name: 'Leads', href: '/dashboard/leads', icon: '👥' },
    { name: 'Comercial', href: '/dashboard/comercial', icon: '📈' },
    { name: 'Financeiro', href: '/dashboard/financeiro', icon: '💰' },
    { name: 'Inovação', href: '/dashboard/inovacao', icon: '🚀' },
    { name: 'Marketing', href: '/dashboard/marketing', icon: '📣' },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed left-0 top-0 bottom-0">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-blue-600">Chronostek</h1>
        </div>
        
        <nav className="p-4">
          {modules.map((module) => {
            const isActive = pathname.startsWith(module.href)
            return (
              <Link
                key={module.href}
                href={module.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${
                  isActive
                    ? 'bg-blue-100 text-blue-600 font-semibold'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>{module.icon}</span>
                <span>{module.name}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-8 py-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              {modules.find(m => pathname.startsWith(m.href))?.name}
            </h2>
            <div className="flex items-center gap-4">
              <button className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                U
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
