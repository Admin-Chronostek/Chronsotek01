'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { LEAD_SOURCES, LEAD_STATUSES } from '@/lib/constants'

interface Lead {
  id: string
  title: string
  email: string
  phone?: string
  company?: string
  source: string
  status: string
  probability: number
  budget?: number
  createdAt: string
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: '1',
      title: 'João Silva',
      email: 'joao@example.com',
      phone: '(11) 98765-4321',
      company: 'Tech Solutions',
      source: 'GOOGLE_ADS',
      status: 'NEW',
      probability: 30,
      budget: 15000,
      createdAt: new Date().toISOString(),
    },
  ])

  const [showForm, setShowForm] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('ALL')

  const filteredLeads = filterStatus === 'ALL' 
    ? leads 
    : leads.filter(lead => lead.status === filterStatus)

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header with Actions */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
            <p className="text-gray-600 mt-1">Gerencie todos os seus leads aqui</p>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + Novo Lead
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Total de Leads</div>
            <div className="text-3xl font-bold text-gray-900">{leads.length}</div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Novos</div>
            <div className="text-3xl font-bold text-blue-600">
              {leads.filter(l => l.status === 'NEW').length}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Em Proposta</div>
            <div className="text-3xl font-bold text-orange-600">
              {leads.filter(l => l.status === 'PROPOSAL').length}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Convertidos</div>
            <div className="text-3xl font-bold text-green-600">
              {leads.filter(l => l.status === 'CONVERTED').length}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex gap-2 flex-wrap">
            <button 
              onClick={() => setFilterStatus('ALL')}
              className={`px-4 py-2 rounded-lg transition ${
                filterStatus === 'ALL'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos
            </button>
            {Object.entries(LEAD_STATUSES).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setFilterStatus(key)}
                className={`px-4 py-2 rounded-lg transition ${
                  filterStatus === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {value.label}
              </button>
            ))}
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nome</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Empresa</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Origem</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Probabilidade</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Orçamento</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="border-t border-gray-200 hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{lead.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{lead.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{lead.company || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {LEAD_SOURCES[lead.source as keyof typeof LEAD_SOURCES] || lead.source}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      LEAD_STATUSES[lead.status as keyof typeof LEAD_STATUSES]?.color
                    }`}>
                      {LEAD_STATUSES[lead.status as keyof typeof LEAD_STATUSES]?.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${lead.probability}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{lead.probability}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    {lead.budget ? `R$ ${(lead.budget / 1000).toFixed(1)}k` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredLeads.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Nenhum lead encontrado
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
