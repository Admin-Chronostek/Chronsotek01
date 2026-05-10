import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/financeiro/payments/[id]
 * Busca um pagamento específico
 */
export async function GET(request, { params }) {
  try {
    const { id } = params

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        client: true,
        contract: true,
        recipeCategory: true,
        recordedBy: { select: { id: true, name: true, email: true } },
      },
    })

    if (!payment) {
      return NextResponse.json(
        { error: 'Pagamento não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: payment })
  } catch (error) {
    console.error('❌ Erro ao buscar pagamento:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar pagamento' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/financeiro/payments/[id]
 * Atualiza um pagamento
 */
export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()

    const {
      value,
      expectedDate,
      paidDate,
      competenceMonth,
      status,
      method,
      recipeCategoryId,
      description,
      notes,
    } = body

    const updateData = {}

    if (value !== undefined) updateData.value = parseFloat(value)
    if (expectedDate !== undefined) updateData.expectedDate = new Date(expectedDate)
    if (paidDate !== undefined) updateData.paidDate = paidDate ? new Date(paidDate) : null
    if (competenceMonth !== undefined) updateData.competenceMonth = new Date(competenceMonth)
    if (status !== undefined) updateData.status = status
    if (method !== undefined) updateData.method = method
    if (recipeCategoryId !== undefined) updateData.recipeCategoryId = recipeCategoryId
    if (description !== undefined) updateData.description = description
    if (notes !== undefined) updateData.notes = notes

    const payment = await prisma.payment.update({
      where: { id },
      data: updateData,
      include: {
        client: true,
        contract: true,
        recipeCategory: true,
        recordedBy: { select: { id: true, name: true, email: true } },
      },
    })

    return NextResponse.json({ success: true, data: payment })
  } catch (error) {
    console.error('❌ Erro ao atualizar pagamento:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar pagamento' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/financeiro/payments/[id]
 * Deleta um pagamento
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = params

    await prisma.payment.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Pagamento deletado com sucesso',
    })
  } catch (error) {
    console.error('❌ Erro ao deletar pagamento:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar pagamento' },
      { status: 500 }
    )
  }
}
