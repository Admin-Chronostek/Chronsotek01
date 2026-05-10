import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/financeiro/payments
 * Lista todos os pagamentos com filtros
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')
    const status = searchParams.get('status')
    const month = searchParams.get('month') // YYYY-MM
    const skip = parseInt(searchParams.get('skip')) || 0
    const take = parseInt(searchParams.get('take')) || 10

    if (!companyId) {
      return NextResponse.json({ error: 'companyId é obrigatório' }, { status: 400 })
    }

    const where = { companyId }

    if (status) {
      where.status = status
    }

    if (month) {
      const [year, monthStr] = month.split('-')
      const startDate = new Date(`${year}-${monthStr}-01`)
      const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1)

      where.competenceMonth = {
        gte: startDate,
        lt: endDate,
      }
    }

    const payments = await prisma.payment.findMany({
      where,
      include: {
        client: { select: { id: true, name: true, email: true } },
        contract: { select: { id: true, number: true, title: true } },
        recipeCategory: { select: { id: true, code: true, name: true } },
        recordedBy: { select: { id: true, name: true, email: true } },
      },
      skip,
      take,
      orderBy: { expectedDate: 'desc' },
    })

    const total = await prisma.payment.count({ where })

    return NextResponse.json({
      success: true,
      data: payments,
      pagination: { skip, take, total },
    })
  } catch (error) {
    console.error('❌ Erro ao listar pagamentos:', error)
    return NextResponse.json(
      { error: 'Erro ao listar pagamentos' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/financeiro/payments
 * Cria novo pagamento
 */
export async function POST(request) {
  try {
    const body = await request.json()

    const {
      companyId,
      contractId,
      clientId,
      number,
      value,
      expectedDate,
      paidDate,
      competenceMonth,
      status,
      method,
      recipeCategoryId,
      description,
      notes,
      recordedById,
    } = body

    // Validações
    if (!companyId || !contractId || !clientId || !number || !value) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      )
    }

    // Verificar se pagamento com mesmo número já existe
    const existing = await prisma.payment.findFirst({
      where: { companyId, number },
    })

    if (existing) {
      return NextResponse.json(
        { error: `Pagamento com número ${number} já existe` },
        { status: 409 }
      )
    }

    const payment = await prisma.payment.create({
      data: {
        number,
        value: parseFloat(value),
        expectedDate: new Date(expectedDate),
        paidDate: paidDate ? new Date(paidDate) : null,
        competenceMonth: new Date(competenceMonth),
        status: status || 'PENDING',
        method,
        description,
        notes,
        companyId,
        contractId,
        clientId,
        recipeCategoryId: recipeCategoryId || null,
        recordedById,
      },
      include: {
        client: true,
        contract: true,
        recipeCategory: true,
        recordedBy: { select: { id: true, name: true, email: true } },
      },
    })

    return NextResponse.json(
      { success: true, data: payment },
      { status: 201 }
    )
  } catch (error) {
    console.error('❌ Erro ao criar pagamento:', error)
    return NextResponse.json(
      { error: 'Erro ao criar pagamento' },
      { status: 500 }
    )
  }
}
