import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Chronostek CRM - Plataforma de Gestão",
  description: "Sistema integrado para gestão financeira, comercial e de leads",
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-600 to-brand-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-4">
              Chronostek CRM
            </h1>
            <p className="text-xl text-brand-100">
              Gestão integrada: Financeiro, Comercial, Leads e Inovação
            </p>
          </div>

          {/* Modules Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Leads Module */}
            <Link href="/dashboard/leads" className="group">
              <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition transform hover:scale-105">
                <div className="mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 15H9m6 0a6 6 0 11-12 0 6 6 0 0112 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Leads
                  </h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Gerenciamento completo de leads com rastreamento de origem, campanhas e status de conversão
                </p>
                <div className="text-blue-600 font-semibold group-hover:translate-x-2 transition">
                  Acessar →
                </div>
              </div>
            </Link>

            {/* Commercial Module */}
            <Link href="/dashboard/comercial" className="group">
              <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition transform hover:scale-105">
                <div className="mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Comercial
                  </h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Pipeline de vendas, gestão de contratos, clientes e previsão de receita
                </p>
                <div className="text-green-600 font-semibold group-hover:translate-x-2 transition">
                  Acessar →
                </div>
              </div>
            </Link>

            {/* Financial Module */}
            <Link href="/dashboard/financeiro" className="group">
              <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition transform hover:scale-105">
                <div className="mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Financeiro
                  </h3>
                </div>
                <p className="text-gray-600 mb-4">
                  DRE, fluxo de caixa, receitas, despesas e análise de lucratividade por centro de custo
                </p>
                <div className="text-purple-600 font-semibold group-hover:translate-x-2 transition">
                  Acessar →
                </div>
              </div>
            </Link>

            {/* Innovation/TI Module */}
            <Link href="/dashboard/inovacao" className="group">
              <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition transform hover:scale-105">
                <div className="mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5.36-5.36l-.707.707M5.36 19.36l-.707-.707" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Inovação/TI
                  </h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Gestão de projetos, timesheet, alocação de recursos e margem por projeto
                </p>
                <div className="text-red-600 font-semibold group-hover:translate-x-2 transition">
                  Acessar →
                </div>
              </div>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Funcionalidades Principais
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="font-bold text-brand-600 mb-2">📊 Dashboard</div>
                <p className="text-gray-600">Visão completa de todas as métricas em tempo real</p>
              </div>
              <div>
                <div className="font-bold text-brand-600 mb-2">💰 Previsão de Caixa</div>
                <p className="text-gray-600">Forecast automático com competência financeira</p>
              </div>
              <div>
                <div className="font-bold text-brand-600 mb-2">👥 Gestão de Usuários</div>
                <p className="text-gray-600">Controle de acesso por diretoria e permissões</p>
              </div>
              <div>
                <div className="font-bold text-brand-600 mb-2">📈 Relatórios</div>
                <p className="text-gray-600">DRE, margem por projeto e análise por centro de custo</p>
              </div>
              <div>
                <div className="font-bold text-brand-600 mb-2">🎯 Health Score</div>
                <p className="text-gray-600">Scoring automático de clientes para retenção</p>
              </div>
              <div>
                <div className="font-bold text-brand-600 mb-2">⏱️ Timesheet</div>
                <p className="text-gray-600">Controle de horas por projeto e pessoa</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link href="/login" className="inline-block bg-white text-brand-600 font-bold py-3 px-8 rounded-lg hover:shadow-lg transition">
              Fazer Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
