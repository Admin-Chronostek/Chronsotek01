'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { DashboardLayout } from '@/components/dashboard-layout'

export default function ComercialPage() {
  const [pipeline, setPipeline] = useState(null)
  const [loading, setLoading] = useState(true)
  const [months, setMonths] = useState(12)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const companyId = 'default' // TODO: Get from session

        const pipelineRes = await fetch(
          `/api/comercial/pipeline?companyId=${companyId}&months=${months}`
        )
        const pipelineData = await pipelineRes.json()
        setPipeline(pipelineData.data)
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [months])

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value || 0)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Comercial</h1>
            <p className="text-gray-600 mt-1">Carregando dados do pipeline...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Comercial</h1>
            <p className="text-gray-600 mt-1">Gestão de contratos, clientes e pipeline</p>
          </div>
          <select
            value={months}
            onChange={(e) => setMonths(parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value={6}>Próximos 6 meses</option>
            <option value={12}>Próximos 12 meses</option>
            <option value={24}>Próximos 24 meses</option>
          </select>
        </div>

        {/* KPIs Principais */}
        {pipeline?.summary && (
          <div className="grid md:grid-cols-5 gap-4">
            <KPICard
              label="Receita Prevista"
              value={formatCurrency(pipeline.summary.totalForecast)}
              color="#3B82F6"
            />
            <KPICard
              label="Receita Recorrente"
              value={formatCurrency(pipeline.summary.recurringForecast)}
              color="#10B981"
            />
            <KPICard
              label="Receita Pontual"
              value={formatCurrency(pipeline.summary.oneTimeForecast)}
              color="#F59E0B"
            />
            <KPICard
              label="Contatos Ativos"
              value={pipeline.summary.activeContracts}
              color="#8B5CF6"
            />
            <KPICard
              label="Leads Qualificados"
              value={pipeline.summary.qualifiedLeads}
              color="#EC4899"
            />
          </div>
        )}

        {/* Pipeline por Mês e Leads */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Forecast Mensal */}
          <div className="md:col-span-2 bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Forecast Mensal</h3>
            <div className="space-y-3">
              {pipeline?.monthlyForecast?.slice(0, 12).map((month) => {
                const maxValue = Math.max(
                  ...pipeline.monthlyForecast.map((m) => m.total)
                )
                const percentage = (month.total / maxValue) * 100
                return (
                  <div key={month.month}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{month.month}</span>
                      <span className="font-medium">{formatCurrency(month.total)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Recorr: {formatCurrency(month.recurring)}</span>
                      <span>Pontual: {formatCurrency(month.oneTime)}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Leads Qualificados */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Leads em Negociação</h3>
            <div className="space-y-3">
              {pipeline?.leads?.slice(0, 5).map((lead) => (
                <div
                  key={lead.id}
                  className="p-3 bg-gray-50 rounded border border-gray-200"
                >
                  <div className="text-sm font-medium text-gray-900">{lead.title}</div>
                  <div className="text-xs text-gray-600 mt-1">{lead.company}</div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-xs">
                      <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {lead.probability}%
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-green-600">
                      {formatCurrency(lead.expectedValue)}
                    </div>
                  </div>
                </div>
              ))}
              {pipeline?.leads && pipeline.leads.length > 5 && (
                <div className="text-sm text-gray-500 text-center py-2">
                  +{pipeline.leads.length - 5} leads em negociação
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="grid md:grid-cols-4 gap-4">
          <Link
            href="#"
            className="bg-blue-50 p-6 rounded-lg border border-blue-200 hover:border-blue-400 transition"
          >
            <div className="text-sm font-semibold text-blue-900">+ Novo Cliente</div>
            <p className="text-xs text-blue-700 mt-1">Cadastrar cliente</p>
          </Link>
          <Link
            href="#"
            className="bg-purple-50 p-6 rounded-lg border border-purple-200 hover:border-purple-400 transition"
          >
            <div className="text-sm font-semibold text-purple-900">+ Novo Contrato</div>
            <p className="text-xs text-purple-700 mt-1">Criar contrato</p>
          </Link>
          <Link
            href="#"
            className="bg-green-50 p-6 rounded-lg border border-green-200 hover:border-green-400 transition"
          >
            <div className="text-sm font-semibold text-green-900">📊 Clientes</div>
            <p className="text-xs text-green-700 mt-1">Gerenciar clientes</p>
          </Link>
          <Link
            href="#"
            className="bg-orange-50 p-6 rounded-lg border border-orange-200 hover:border-orange-400 transition"
          >
            <div className="text-sm font-semibold text-orange-900">📈 Contratos</div>
            <p className="text-xs text-orange-700 mt-1">Ver contratos</p>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  )
}

// Componente KPI Card
function KPICard({ label, value, color }) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="text-sm text-gray-600 mb-2">{label}</div>
      <div className="text-2xl font-bold" style={{ color }}>
        {typeof value === 'number' && value > 1000 ? value : value}
      </div>
    </div>
  )
}
