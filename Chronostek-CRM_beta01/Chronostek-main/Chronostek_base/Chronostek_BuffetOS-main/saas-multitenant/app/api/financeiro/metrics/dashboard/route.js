import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/financeiro/metrics/dashboard
 * Retorna KPIs principais do dashboard financeiro
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')
    const month = searchParams.get('month') // YYYY-MM, se não informar, usa o mês atual

    if (!companyId) {
      return NextResponse.json({ error: 'companyId é obrigatório' }, { status: 400 })
    }

    // Se não informou mês, usar o mês atual
    let currentMonth = month
    if (!currentMonth) {
      const now = new Date()
      currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    }

    const [year, monthStr] = currentMonth.split('-')
    const startDate = new Date(`${year}-${monthStr}-01`)
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1)

    // Total de receitas esperadas
    const expectedRecipes = await prisma.payment.aggregate({
      where: {
        companyId,
        competenceMonth: { gte: startDate, lt: endDate },
      },
      _sum: { value: true },
    })

    // Total de receitas recebidas
    const receivedRecipes = await prisma.payment.aggregate({
      where: {
        companyId,
        competenceMonth: { gte: startDate, lt: endDate },
        status: 'PAID',
      },
      _sum: { value: true },
    })

    // Receitas inadimplentes (atrasadas)
    const overdueRecipes = await prisma.payment.aggregate({
      where: {
        companyId,
        competenceMonth: { gte: startDate, lt: endDate },
        status: 'PENDING',
        expectedDate: { lt: new Date() },
      },
      _sum: { value: true },
    })

    // Total de despesas
    const totalExpenses = await prisma.expense.aggregate({
      where: {
        companyId,
        competenceMonth: { gte: startDate, lt: endDate },
        status: { in: ['APPROVED', 'PAID'] },
      },
      _sum: { value: true },
    })

    // Despesas pendentes de aprovação
    const pendingExpenses = await prisma.expense.aggregate({
      where: {
        companyId,
        competenceMonth: { gte: startDate, lt: endDate },
        status: 'PENDING',
      },
      _sum: { value: true },
    })

    // Quantidade de contratos ativos
    const activeContracts = await prisma.contract.count({
      where: {
        companyId,
        status: 'ACTIVE',
      },
    })

    // Quantidade de clientes
    const totalClients = await prisma.client.count({
      where: {
        companyId,
        status: 'ACTIVE',
      },
    })

    // MRR (Receita Recorrente Mensal)
    const mrrContracts = await prisma.contract.findMany({
      where: {
        companyId,
        isRecurring: true,
        status: 'ACTIVE',
      },
      select: { finalValue: true },
    })

    const mrr = mrrContracts.reduce((acc, c) => acc + c.finalValue, 0)

    // ARR (Receita Recorrente Anual)
    const arr = mrr * 12

    // Inadimplência
    const totalExpectedRecipe = expectedRecipes._sum.value || 0
    const totalReceived = receivedRecipes._sum.value || 0
    const totalOverdue = overdueRecipes._sum.value || 0
    const delinquencyRate = totalExpectedRecipe > 0 ? (totalOverdue / totalExpectedRecipe) * 100 : 0

    // Lucro
    const profit = totalReceived - (totalExpenses._sum.value || 0)
    const profitMargin = totalReceived > 0 ? (profit / totalReceived) * 100 : 0

    return NextResponse.json({
      success: true,
      data: {
        period: currentMonth,
        kpis: {
          // Receitas
          expectedRecipe: {
            label: 'Receita Esperada',
            value: parseFloat((totalExpectedRecipe || 0).toFixed(2)),
            color: '#3B82F6',
          },
          receivedRecipe: {
            label: 'Receita Recebida',
            value: parseFloat((totalReceived || 0).toFixed(2)),
            color: '#10B981',
          },
          overdueRecipe: {
            label: 'Receita Inadimplente',
            value: parseFloat((totalOverdue || 0).toFixed(2)),
            color: '#EF4444',
          },
          pendingRecipe: {
            label: 'Receita Pendente',
            value: parseFloat(((totalExpectedRecipe - totalReceived) || 0).toFixed(2)),
            color: '#F59E0B',
          },

          // Despesas
          totalExpenses: {
            label: 'Despesas Totais',
            value: parseFloat((totalExpenses._sum.value || 0).toFixed(2)),
            color: '#8B5CF6',
          },
          pendingExpenses: {
            label: 'Despesas Pendentes',
            value: parseFloat((pendingExpenses._sum.value || 0).toFixed(2)),
            color: '#EC4899',
          },

          // Lucro
          profit: {
            label: 'Lucro Operacional',
            value: parseFloat(profit.toFixed(2)),
            color: profit > 0 ? '#10B981' : '#EF4444',
          },
          profitMargin: {
            label: 'Margem de Lucro (%)',
            value: parseFloat(profitMargin.toFixed(2)),
            color: '#06B6D4',
          },

          // Recorrência
          mrr: {
            label: 'MRR (Receita Recorrente Mensal)',
            value: parseFloat(mrr.toFixed(2)),
            color: '#14B8A6',
          },
          arr: {
            label: 'ARR (Receita Recorrente Anual)',
            value: parseFloat(arr.toFixed(2)),
            color: '#6366F1',
          },

          // Índices
          delinquencyRate: {
            label: 'Taxa de Inadimplência (%)',
            value: parseFloat(delinquencyRate.toFixed(2)),
            color: delinquencyRate > 10 ? '#EF4444' : '#F59E0B',
          },
          activeContracts: {
            label: 'Contratos Ativos',
            value: activeContracts,
            color: '#3B82F6',
          },
          totalClients: {
            label: 'Clientes Ativos',
            value: totalClients,
            color: '#10B981',
          },
        },
      },
    })
  } catch (error) {
    console.error('❌ Erro ao gerar dashboard:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar dashboard' },
      { status: 500 }
    )
  }
}
