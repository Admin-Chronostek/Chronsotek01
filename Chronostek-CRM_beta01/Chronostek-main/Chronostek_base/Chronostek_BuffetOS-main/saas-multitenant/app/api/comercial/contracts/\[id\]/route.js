import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/comercial/contracts/[id]
 * Busca contrato específico
 */
export async function GET(request, { params }) {
  try {
    const { id } = params

    const contract = await prisma.contract.findUnique({
      where: { id },
      include: {
        client: true,
        createdBy: { select: { id: true, name: true, email: true } },
        projects: { include: { owner: { select: { id: true, name: true } } } },
        payments: {
          include: {
            client: { select: { id: true, name: true } },
            recipeCategory: { select: { id: true, code: true, name: true } },
          },
        },
      },
    })

    if (!contract) {
      return NextResponse.json(
        { error: 'Contrato não encontrado' },
        { status: 404 }
      )
    }

    // Calcular métricas
    const totalPaid = contract.payments
      .filter((p) => p.status === 'PAID')
      .reduce((acc, p) => acc + p.value, 0)

    return NextResponse.json({
      success: true,
      data: {
        ...contract,
        totalPaid,
        totalPending: contract.finalValue - totalPaid,
        paymentPercentage: (totalPaid / contract.finalValue) * 100,
      },
    })
  } catch (error) {
    console.error('❌ Erro ao buscar contrato:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar contrato' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/comercial/contracts/[id]
 * Atualiza contrato
 */
export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()

    const {
      title,
      description,
      value,
      discountValue,
      endDate,
      competenceEnd,
      status,
      paymentStatus,
    } = body

    const updateData = {}

    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (value !== undefined) {
      const parsedValue = parseFloat(value)
      updateData.value = parsedValue
      if (discountValue !== undefined) {
        updateData.finalValue = parsedValue - parseFloat(discountValue)
      }
    }
    if (discountValue !== undefined) {
      updateData.discountValue = parseFloat(discountValue)
      if (!updateData.value) {
        const current = await prisma.contract.findUnique({ where: { id }, select: { value: true } })
        updateData.finalValue = current.value - parseFloat(discountValue)
      }
    }
    if (endDate !== undefined) updateData.endDate = endDate ? new Date(endDate) : null
    if (competenceEnd !== undefined) updateData.competenceEnd = competenceEnd ? new Date(competenceEnd) : null
    if (status !== undefined) updateData.status = status
    if (paymentStatus !== undefined) updateData.paymentStatus = paymentStatus

    const contract = await prisma.contract.update({
      where: { id },
      data: updateData,
      include: {
        client: true,
        createdBy: { select: { id: true, name: true } },
        payments: true,
      },
    })

    return NextResponse.json({ success: true, data: contract })
  } catch (error) {
    console.error('❌ Erro ao atualizar contrato:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar contrato' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/comercial/contracts/[id]
 * Desativa contrato
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = params

    const contract = await prisma.contract.update({
      where: { id },
      data: { status: 'CANCELLED' },
    })

    return NextResponse.json({
      success: true,
      message: 'Contrato cancelado com sucesso',
      data: contract,
    })
  } catch (error) {
    console.error('❌ Erro ao deletar contrato:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar contrato' },
      { status: 500 }
    )
  }
}
