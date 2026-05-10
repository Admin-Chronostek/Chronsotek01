import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/comercial/pipeline
 * Retorna o pipeline comercial com forecast de receita
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')
    const months = parseInt(searchParams.get('months')) || 12 // Próximos 12 meses

    if (!companyId) {
      return NextResponse.json({ error: 'companyId é obrigatório' }, { status: 400 })
    }

    // Contratos ativos com datas de competência futura
    const now = new Date()
    const futureDate = new Date(now.getFullYear(), now.getMonth() + months, 1)

    const contracts = await prisma.contract.findMany({
      where: {
        companyId,
        status: 'ACTIVE',
        competenceStart: {
          lt: futureDate,
        },
      },
      include: {
        client: { select: { id: true, name: true, healthScore: true } },
        projects: { select: { id: true, name: true, status: true } },
      },
    })

    // Leads qualificados (com alta probabilidade)
    const leads = await prisma.lead.findMany({
      where: {
        companyId,
        status: { in: ['PROPOSAL', 'QUALIFIED'] },
        probability: { gte: 50 },
      },
      include: {
        responsible: { select: { id: true, name: true } },
      },
    })

    // Agrupar contratos por mês
    const monthlyForecast = {}
    for (let i = 0; i < months; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() + i, 1)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      monthlyForecast[monthKey] = {
        month: monthKey,
        recurring: 0,
        oneTime: 0,
        total: 0,
        contracts: [],
      }
    }

    // Calcular receita prevista por mês
    contracts.forEach((contract) => {
      const competenceStart = new Date(contract.competenceStart)
      for (let m = 0; m < months; m++) {
        const date = new Date(now.getFullYear(), now.getMonth() + m, 1)
        if (date >= competenceStart && (!contract.competenceEnd || date <= contract.competenceEnd)) {
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

          if (contract.isRecurring) {
            monthlyForecast[monthKey].recurring += contract.finalValue
          } else {
            monthlyForecast[monthKey].oneTime += contract.finalValue
          }
          monthlyForecast[monthKey].total += contract.finalValue
          monthlyForecast[monthKey].contracts.push({
            id: contract.id,
            number: contract.number,
            title: contract.title,
            value: contract.finalValue,
            isRecurring: contract.isRecurring,
            clientName: contract.client.name,
          })
        }
      }
    })

    // Calcular lead forecast (leads qualificados com probabilidade)
    const leadsValue = leads.reduce((acc, lead) => {
      return acc + ((lead.budget || 0) * (lead.probability / 100))
    }, 0)

    // Calcular total
    const totalForecast = Object.values(monthlyForecast).reduce(
      (acc, month) => acc + month.total,
      0
    ) + leadsValue

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalForecast,
          recurringForecast: Object.values(monthlyForecast).reduce(
            (acc, month) => acc + month.recurring,
            0
          ),
          oneTimeForecast: Object.values(monthlyForecast).reduce(
            (acc, month) => acc + month.oneTime,
            0
          ),
          leadsForecast: leadsValue,
          activeContracts: contracts.length,
          qualifiedLeads: leads.length,
        },
        monthlyForecast: Object.values(monthlyForecast),
        leads: leads.map((lead) => ({
          id: lead.id,
          title: lead.title,
          company: lead.company,
          budget: lead.budget,
          probability: lead.probability,
          status: lead.status,
          expectedValue: (lead.budget || 0) * (lead.probability / 100),
          responsible: lead.responsible ? lead.responsible.name : 'Não atribuído',
        })),
      },
    })
  } catch (error) {
    console.error('❌ Erro ao gerar pipeline:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar pipeline' },
      { status: 500 }
    )
  }
}
