import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/comercial/contracts
 * Lista todos os contratos
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')
    const status = searchParams.get('status')
    const clientId = searchParams.get('clientId')
    const isRecurring = searchParams.get('isRecurring')
    const skip = parseInt(searchParams.get('skip')) || 0
    const take = parseInt(searchParams.get('take')) || 10

    if (!companyId) {
      return NextResponse.json({ error: 'companyId é obrigatório' }, { status: 400 })
    }

    const where = { companyId }

    if (status) {
      where.status = status
    }

    if (clientId) {
      where.clientId = clientId
    }

    if (isRecurring === 'true') {
      where.isRecurring = true
    }

    const contracts = await prisma.contract.findMany({
      where,
      include: {
        client: { select: { id: true, name: true, email: true } },
        createdBy: { select: { id: true, name: true, email: true } },
        projects: { select: { id: true, name: true, status: true } },
        payments: { select: { id: true, value: true, status: true } },
      },
      skip,
      take,
      orderBy: { startDate: 'desc' },
    })

    // Calcular métricas por contrato
    const contractsWithMetrics = contracts.map((contract) => {
      const totalPaid = contract.payments
        .filter((p) => p.status === 'PAID')
        .reduce((acc, p) => acc + p.value, 0)

      return {
        ...contract,
        totalPaid,
        totalPending: contract.finalValue - totalPaid,
        paymentPercentage: (totalPaid / contract.finalValue) * 100,
      }
    })

    const total = await prisma.contract.count({ where })

    return NextResponse.json({
      success: true,
      data: contractsWithMetrics,
      pagination: { skip, take, total },
    })
  } catch (error) {
    console.error('❌ Erro ao listar contratos:', error)
    return NextResponse.json(
      { error: 'Erro ao listar contratos' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/comercial/contracts
 * Cria novo contrato
 */
export async function POST(request) {
  try {
    const body = await request.json()

    const {
      companyId,
      clientId,
      createdById,
      number,
      title,
      description,
      value,
      discountPercent,
      discountValue,
      startDate,
      endDate,
      competenceStart,
      competenceEnd,
      isRecurring,
      recurringType,
    } = body

    if (!companyId || !clientId || !createdById || !number || !title || !value) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      )
    }

    // Calcular valor final
    const parsedValue = parseFloat(value)
    const parsedDiscount = parseFloat(discountValue) || 0
    const finalValue = parsedValue - parsedDiscount

    const contract = await prisma.contract.create({
      data: {
        companyId,
        clientId,
        createdById,
        number,
        title,
        description,
        value: parsedValue,
        discountPercent: parseFloat(discountPercent) || 0,
        discountValue: parsedDiscount,
        finalValue,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        competenceStart: new Date(competenceStart),
        competenceEnd: competenceEnd ? new Date(competenceEnd) : null,
        isRecurring: isRecurring === 'true' || isRecurring === true,
        recurringType: recurringType || null,
        status: 'ACTIVE',
        paymentStatus: 'PENDING',
      },
      include: {
        client: true,
        createdBy: { select: { id: true, name: true, email: true } },
      },
    })

    return NextResponse.json(
      { success: true, data: contract },
      { status: 201 }
    )
  } catch (error) {
    console.error('❌ Erro ao criar contrato:', error)
    return NextResponse.json(
      { error: 'Erro ao criar contrato' },
      { status: 500 }
    )
  }
}
