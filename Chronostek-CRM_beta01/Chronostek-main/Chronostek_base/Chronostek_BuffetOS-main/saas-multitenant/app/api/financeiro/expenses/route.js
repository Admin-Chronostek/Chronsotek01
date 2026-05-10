import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/financeiro/expenses
 * Lista todas as despesas com filtros
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')
    const status = searchParams.get('status')
    const month = searchParams.get('month') // YYYY-MM
    const costCenterId = searchParams.get('costCenterId')
    const skip = parseInt(searchParams.get('skip')) || 0
    const take = parseInt(searchParams.get('take')) || 10

    if (!companyId) {
      return NextResponse.json({ error: 'companyId é obrigatório' }, { status: 400 })
    }

    const where = { companyId }

    if (status) {
      where.status = status
    }

    if (costCenterId) {
      where.costCenterId = costCenterId
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

    const expenses = await prisma.expense.findMany({
      where,
      include: {
        expenseCategory: { select: { id: true, code: true, name: true, color: true } },
        costCenter: { select: { id: true, code: true, name: true } },
        recordedBy: { select: { id: true, name: true, email: true } },
      },
      skip,
      take,
      orderBy: { date: 'desc' },
    })

    const total = await prisma.expense.count({ where })

    return NextResponse.json({
      success: true,
      data: expenses,
      pagination: { skip, take, total },
    })
  } catch (error) {
    console.error('❌ Erro ao listar despesas:', error)
    return NextResponse.json(
      { error: 'Erro ao listar despesas' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/financeiro/expenses
 * Cria nova despesa
 */
export async function POST(request) {
  try {
    const body = await request.json()

    const {
      companyId,
      costCenterId,
      description,
      value,
      date,
      competenceMonth,
      status,
      method,
      expenseCategoryId,
      notes,
      receipt,
      recordedById,
    } = body

    // Validações
    if (!companyId || !costCenterId || !description || !value) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      )
    }

    const expense = await prisma.expense.create({
      data: {
        description,
        value: parseFloat(value),
        date: new Date(date),
        competenceMonth: new Date(competenceMonth),
        status: status || 'PENDING',
        method,
        notes,
        receipt,
        companyId,
        costCenterId,
        expenseCategoryId: expenseCategoryId || null,
        recordedById,
      },
      include: {
        expenseCategory: true,
        costCenter: true,
        recordedBy: { select: { id: true, name: true, email: true } },
      },
    })

    return NextResponse.json(
      { success: true, data: expense },
      { status: 201 }
    )
  } catch (error) {
    console.error('❌ Erro ao criar despesa:', error)
    return NextResponse.json(
      { error: 'Erro ao criar despesa' },
      { status: 500 }
    )
  }
}
