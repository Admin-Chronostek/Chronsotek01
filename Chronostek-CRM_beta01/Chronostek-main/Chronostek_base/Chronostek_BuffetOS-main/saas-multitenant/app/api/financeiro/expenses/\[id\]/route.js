import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/financeiro/expenses/[id]
 * Busca uma despesa específica
 */
export async function GET(request, { params }) {
  try {
    const { id } = params

    const expense = await prisma.expense.findUnique({
      where: { id },
      include: {
        expenseCategory: true,
        costCenter: true,
        recordedBy: { select: { id: true, name: true, email: true } },
      },
    })

    if (!expense) {
      return NextResponse.json(
        { error: 'Despesa não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: expense })
  } catch (error) {
    console.error('❌ Erro ao buscar despesa:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar despesa' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/financeiro/expenses/[id]
 * Atualiza uma despesa
 */
export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()

    const {
      description,
      value,
      date,
      competenceMonth,
      status,
      method,
      expenseCategoryId,
      notes,
      receipt,
    } = body

    const updateData = {}

    if (description !== undefined) updateData.description = description
    if (value !== undefined) updateData.value = parseFloat(value)
    if (date !== undefined) updateData.date = new Date(date)
    if (competenceMonth !== undefined) updateData.competenceMonth = new Date(competenceMonth)
    if (status !== undefined) updateData.status = status
    if (method !== undefined) updateData.method = method
    if (expenseCategoryId !== undefined) updateData.expenseCategoryId = expenseCategoryId
    if (notes !== undefined) updateData.notes = notes
    if (receipt !== undefined) updateData.receipt = receipt

    const expense = await prisma.expense.update({
      where: { id },
      data: updateData,
      include: {
        expenseCategory: true,
        costCenter: true,
        recordedBy: { select: { id: true, name: true, email: true } },
      },
    })

    return NextResponse.json({ success: true, data: expense })
  } catch (error) {
    console.error('❌ Erro ao atualizar despesa:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar despesa' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/financeiro/expenses/[id]
 * Deleta uma despesa
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = params

    await prisma.expense.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Despesa deletada com sucesso',
    })
  } catch (error) {
    console.error('❌ Erro ao deletar despesa:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar despesa' },
      { status: 500 }
    )
  }
}
