import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/comercial/clients/[id]
 * Busca cliente específico com detalhes completos
 */
export async function GET(request, { params }) {
  try {
    const { id } = params

    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        contracts: {
          include: {
            projects: true,
            payments: { select: { id: true, value: true, status: true, paidDate: true } },
          },
        },
        projects: true,
        leads: {
          select: { id: true, title: true, status: true, probability: true },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        payments: {
          select: { id: true, value: true, status: true, paidDate: true },
          orderBy: { paidDate: 'desc' },
          take: 10,
        },
      },
    })

    if (!client) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: client })
  } catch (error) {
    console.error('❌ Erro ao buscar cliente:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar cliente' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/comercial/clients/[id]
 * Atualiza cliente
 */
export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()

    const {
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
      status,
      healthScore,
    } = body

    const updateData = {}

    if (name !== undefined) updateData.name = name
    if (email !== undefined) updateData.email = email
    if (phone !== undefined) updateData.phone = phone
    if (cnpj !== undefined) updateData.cnpj = cnpj
    if (cpf !== undefined) updateData.cpf = cpf
    if (website !== undefined) updateData.website = website
    if (address !== undefined) updateData.address = address
    if (city !== undefined) updateData.city = city
    if (state !== undefined) updateData.state = state
    if (zip !== undefined) updateData.zip = zip
    if (notes !== undefined) updateData.notes = notes
    if (status !== undefined) updateData.status = status
    if (healthScore !== undefined) updateData.healthScore = parseInt(healthScore)

    const client = await prisma.client.update({
      where: { id },
      data: updateData,
      include: {
        contracts: true,
        projects: true,
      },
    })

    return NextResponse.json({ success: true, data: client })
  } catch (error) {
    console.error('❌ Erro ao atualizar cliente:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar cliente' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/comercial/clients/[id]
 * Deleta cliente (soft delete)
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = params

    const client = await prisma.client.update({
      where: { id },
      data: { status: 'INACTIVE' },
    })

    return NextResponse.json({
      success: true,
      message: 'Cliente inativado com sucesso',
      data: client,
    })
  } catch (error) {
    console.error('❌ Erro ao deletar cliente:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar cliente' },
      { status: 500 }
    )
  }
}
