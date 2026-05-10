'use client'

import { DashboardLayout } from '@/components/dashboard-layout'

export default function InovacaoPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inovação / TI</h1>
          <p className="text-gray-600 mt-1">Gestão de projetos, timesheet e alocação de recursos</p>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Projetos Ativos</div>
            <div className="text-3xl font-bold text-gray-900">0</div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Margem Média</div>
            <div className="text-3xl font-bold text-green-600">0%</div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Horas Alocadas</div>
            <div className="text-3xl font-bold text-blue-600">0h</div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Produtividade</div>
            <div className="text-3xl font-bold text-purple-600">0%</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 text-center py-16 text-gray-500">
          <p className="text-lg">Módulo em desenvolvimento...</p>
          <p className="text-sm mt-2">Funcionalidades: Projetos, Timesheet, Alocação, Margem por Projeto</p>
        </div>
      </div>
    </DashboardLayout>
  )
}
