import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/comercial/clients
 * Lista todos os clientes com filtros e detalhes
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')
    const status = searchParams.get('status')
    const search = searchParams.get('search') // Busca por nome ou email
    const skip = parseInt(searchParams.get('skip')) || 0
    const take = parseInt(searchParams.get('take')) || 10

    if (!companyId) {
      return NextResponse.json({ error: 'companyId é obrigatório' }, { status: 400 })
    }

    const where = { companyId }

    if (status) {
      where.status = status
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }

    const clients = await prisma.client.findMany({
      where,
      include: {
        contracts: {
          select: {
            id: true,
            number: true,
            title: true,
            finalValue: true,
            status: true,
            isRecurring: true,
          },
        },
        projects: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
        _count: {
          select: { leads: true, payments: true },
        },
      },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    })

    // Calcular valor total por cliente
    const clientsWithTotals = clients.map((client) => ({
      ...client,
      totalContractValue: client.contracts.reduce((acc, c) => acc + c.finalValue, 0),
      activeContracts: client.contracts.filter((c) => c.status === 'ACTIVE').length,
    }))

    const total = await prisma.client.count({ where })

    return NextResponse.json({
      success: true,
      data: clientsWithTotals,
      pagination: { skip, take, total },
    })
  } catch (error) {
    console.error('❌ Erro ao listar clientes:', error)
    return NextResponse.json(
      { error: 'Erro ao listar clientes' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/comercial/clients
 * Cria novo cliente
 */
export async function POST(request) {
  try {
    const body = await request.json()

    const {
      companyId,
      name,
      email,
      phone,
      cnpj,
      cpf,
      website,
      address,
      city,
      state,
      zip,
      notes,
    } = body

    if (!companyId || !name || !email) {
      return NextResponse.json(
        { error: 'companyId, name e email são obrigatórios' },
        { status: 400 }
      )
    }

    const client = await prisma.client.create({
      data: {
        companyId,
        name,
        email,
        phone,
        cnpj,
        cpf,
        website,
        address,
        city,
        state,
        zip,
        notes,
        status: 'ACTIVE',
        healthScore: 100,
      },
      include: {
        contracts: true,
        projects: true,
      },
    })

    return NextResponse.json(
      { success: true, data: client },
      { status: 201 }
    )
  } catch (error) {
    console.error('❌ Erro ao criar cliente:', error)
    return NextResponse.json(
      { error: 'Erro ao criar cliente' },
      { status: 500 }
    )
  }
}
