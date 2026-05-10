'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { DashboardLayout } from '@/components/dashboard-layout'

export default function FinanceiroPage() {
  const [kpis, setKpis] = useState(null)
  const [dre, setDre] = useState(null)
  const [loading, setLoading] = useState(true)
  const [month, setMonth] = useState(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const companyId = 'default' // TODO: Get from session

        // Carregar KPIs
        const kpiRes = await fetch(
          `/api/financeiro/metrics/dashboard?companyId=${companyId}&month=${month}`
        )
        const kpiData = await kpiRes.json()
        setKpis(kpiData.data)

        // Carregar DRE
        const dreRes = await fetch(
          `/api/financeiro/metrics/dre?companyId=${companyId}&month=${month}`
        )
        const dreData = await dreRes.json()
        setDre(dreData.data)
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [month])

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
            <h1 className="text-3xl font-bold text-gray-900">Financeiro</h1>
            <p className="text-gray-600 mt-1">Carregando dados...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Financeiro</h1>
            <p className="text-gray-600 mt-1">DRE, fluxo de caixa e análise de lucratividade</p>
          </div>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* KPIs Principais */}
        <div className="grid md:grid-cols-5 gap-4">
          {kpis?.kpis && (
            <>
              <KPICard
                label={kpis.kpis.receivedRecipe.label}
                value={formatCurrency(kpis.kpis.receivedRecipe.value)}
                color={kpis.kpis.receivedRecipe.color}
              />
              <KPICard
                label={kpis.kpis.overdueRecipe.label}
                value={formatCurrency(kpis.kpis.overdueRecipe.value)}
                color={kpis.kpis.overdueRecipe.color}
              />
              <KPICard
                label={kpis.kpis.totalExpenses.label}
                value={formatCurrency(kpis.kpis.totalExpenses.value)}
                color={kpis.kpis.totalExpenses.color}
              />
              <KPICard
                label={kpis.kpis.profit.label}
                value={formatCurrency(kpis.kpis.profit.value)}
                color={kpis.kpis.profit.color}
              />
              <KPICard
                label={kpis.kpis.profitMargin.label}
                value={`${kpis.kpis.profitMargin.value}%`}
                color={kpis.kpis.profitMargin.color}
              />
            </>
          )}
        </div>

        {/* DRE Summary */}
        <div className="grid md:grid-cols-3 gap-6">
          {dre && (
            <>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Receitas por Categoria</h3>
                <div className="space-y-3">
                  {dre.recipe.detail.map((cat) => (
                    <div key={cat.categoryId} className="flex justify-between text-sm">
                      <span className="text-gray-600">{cat.categoryName}</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(cat.value)}
                      </span>
                    </div>
                  ))}
                  <div className="border-t pt-3 flex justify-between font-semibold">
                    <span>Total Receitas</span>
                    <span className="text-green-600">{formatCurrency(dre.recipe.total)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Despesas por Categoria</h3>
                <div className="space-y-3">
                  {dre.expenses.detail.slice(0, 5).map((cat) => (
                    <div key={cat.categoryId} className="flex justify-between text-sm">
                      <span className="text-gray-600">{cat.categoryName}</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(cat.value)}
                      </span>
                    </div>
                  ))}
                  {dre.expenses.detail.length > 5 && (
                    <div className="text-sm text-gray-500 italic">
                      +{dre.expenses.detail.length - 5} categorias
                    </div>
                  )}
                  <div className="border-t pt-3 flex justify-between font-semibold">
                    <span>Total Despesas</span>
                    <span className="text-red-600">{formatCurrency(dre.expenses.total)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Resumo DRE</h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Receita Total</span>
                    <span className="font-medium text-green-600">
                      {formatCurrency(dre.summary.totalRecipe)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Despesas Totais</span>
                    <span className="font-medium text-red-600">
                      {formatCurrency(dre.summary.totalExpenses)}
                    </span>
                  </div>
                  <div className="border-t pt-4 flex justify-between">
                    <span className="font-semibold">Lucro Operacional</span>
                    <span
                      className={`font-bold text-lg ${
                        dre.summary.operationalProfit >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {formatCurrency(dre.summary.operationalProfit)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm pt-2">
                    <span className="text-gray-600">Margem Bruta</span>
                    <span className="font-medium">
                      {dre.summary.grossMarginPercent.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Ações Rápidas */}
        <div className="grid md:grid-cols-4 gap-4">
          <Link
            href="#"
            className="bg-blue-50 p-6 rounded-lg border border-blue-200 hover:border-blue-400 transition"
          >
            <div className="text-sm font-semibold text-blue-900">+ Registrar Receita</div>
            <p className="text-xs text-blue-700 mt-1">Novo pagamento recebido</p>
          </Link>
          <Link
            href="#"
            className="bg-orange-50 p-6 rounded-lg border border-orange-200 hover:border-orange-400 transition"
          >
            <div className="text-sm font-semibold text-orange-900">+ Registrar Despesa</div>
            <p className="text-xs text-orange-700 mt-1">Nova despesa</p>
          </Link>
          <Link
            href="#"
            className="bg-purple-50 p-6 rounded-lg border border-purple-200 hover:border-purple-400 transition"
          >
            <div className="text-sm font-semibold text-purple-900">📊 Relatórios</div>
            <p className="text-xs text-purple-700 mt-1">Ver relatórios detalhados</p>
          </Link>
          <Link
            href="#"
            className="bg-green-50 p-6 rounded-lg border border-green-200 hover:border-green-400 transition"
          >
            <div className="text-sm font-semibold text-green-900">📥 Exportar</div>
            <p className="text-xs text-green-700 mt-1">Baixar dados em Excel</p>
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
        {value}
      </div>
    </div>
  )
}
