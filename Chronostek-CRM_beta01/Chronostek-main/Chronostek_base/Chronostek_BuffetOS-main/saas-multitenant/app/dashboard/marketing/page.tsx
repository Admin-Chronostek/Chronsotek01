'use client'

import { DashboardLayout } from '@/components/dashboard-layout'

export default function MarketingPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marketing</h1>
          <p className="text-gray-600 mt-1">Campanhas, ROI e attribution</p>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Campanhas Ativas</div>
            <div className="text-3xl font-bold text-gray-900">0</div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Leads Gerados</div>
            <div className="text-3xl font-bold text-blue-600">0</div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">ROI Médio</div>
            <div className="text-3xl font-bold text-green-600">0%</div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">CAC</div>
            <div className="text-3xl font-bold text-purple-600">R$ 0</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 text-center py-16 text-gray-500">
          <p className="text-lg">Módulo em desenvolvimento...</p>
          <p className="text-sm mt-2">Funcionalidades: Campanhas, ROI, Attribution, CAC/LTV</p>
        </div>
      </div>
    </DashboardLayout>
  )
}
