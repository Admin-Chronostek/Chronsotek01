import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/financeiro/categories
 * Lista todas as categorias (receita e despesa)
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')
    const type = searchParams.get('type') // 'recipe', 'expense' ou undefined para ambos

    if (!companyId) {
      return NextResponse.json({ error: 'companyId é obrigatório' }, { status: 400 })
    }

    let recipeCategories = []
    let expenseCategories = []

    if (type === 'recipe' || !type) {
      recipeCategories = await prisma.recipeCategory.findMany({
        where: { companyId, isActive: true },
        orderBy: { code: 'asc' },
      })
    }

    if (type === 'expense' || !type) {
      expenseCategories = await prisma.expenseCategory.findMany({
        where: { companyId, isActive: true },
        orderBy: { code: 'asc' },
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        recipe: recipeCategories,
        expense: expenseCategories,
      },
    })
  } catch (error) {
    console.error('❌ Erro ao listar categorias:', error)
    return NextResponse.json(
      { error: 'Erro ao listar categorias' },
      { status: 500 }
    )
  }
}
