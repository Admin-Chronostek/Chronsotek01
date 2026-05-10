import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/financeiro/metrics/dre
 * Retorna a DRE (Demonstração de Resultado) mensal
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')
    const month = searchParams.get('month') // YYYY-MM

    if (!companyId || !month) {
      return NextResponse.json(
        { error: 'companyId e month são obrigatórios' },
        { status: 400 }
      )
    }

    // Parseado data do mês
    const [year, monthStr] = month.split('-')
    const startDate = new Date(`${year}-${monthStr}-01`)
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1)

    // Receitas agrupadas por categoria
    const recipeByCategory = await prisma.payment.groupBy({
      by: ['recipeCategoryId', 'status'],
      where: {
        companyId,
        competenceMonth: {
          gte: startDate,
          lt: endDate,
        },
        status: { in: ['PENDING', 'PARTIAL', 'PAID'] },
      },
      _sum: { value: true },
    })

    // Obter categorias de receita para mapear IDs
    const recipeCategories = await prisma.recipeCategory.findMany({
      where: { companyId },
    })

    // Calcular total de receitas
    let totalRecipe = 0
    const recipeDetail = recipeCategories.map((cat) => {
      const categoryPayments = recipeByCategory.filter(
        (p) => p.recipeCategoryId === cat.id
      )
      const sum = categoryPayments.reduce((acc, curr) => acc + (curr._sum.value || 0), 0)
      totalRecipe += sum
      return {
        categoryId: cat.id,
        categoryCode: cat.code,
        categoryName: cat.name,
        value: sum,
      }
    })

    // Despesas agrupadas por categoria
    const expenseByCategory = await prisma.expense.groupBy({
      by: ['expenseCategoryId', 'status'],
      where: {
        companyId,
        competenceMonth: {
          gte: startDate,
          lt: endDate,
        },
        status: { in: ['PENDING', 'APPROVED', 'PAID'] },
      },
      _sum: { value: true },
    })

    // Obter categorias de despesa
    const expenseCategories = await prisma.expenseCategory.findMany({
      where: { companyId },
    })

    // Calcular total de despesas
    let totalExpense = 0
    const expenseDetail = expenseCategories.map((cat) => {
      const categoryExpenses = expenseByCategory.filter(
        (e) => e.expenseCategoryId === cat.id
      )
      const sum = categoryExpenses.reduce((acc, curr) => acc + (curr._sum.value || 0), 0)
      totalExpense += sum
      return {
        categoryId: cat.id,
        categoryCode: cat.code,
        categoryName: cat.name,
        value: sum,
      }
    })

    // Calcular lucro operacional
    const operationalProfit = totalRecipe - totalExpense

    // Calcular margens
    const grossMargin = totalRecipe > 0 ? ((totalRecipe - totalExpense) / totalRecipe) * 100 : 0

    return NextResponse.json({
      success: true,
      data: {
        period: month,
        startDate,
        endDate,
        recipe: {
          total: totalRecipe,
          detail: recipeDetail,
        },
        expenses: {
          total: totalExpense,
          detail: expenseDetail,
        },
        summary: {
          totalRecipe,
          totalExpenses: totalExpense,
          operationalProfit,
          grossMarginPercent: parseFloat(grossMargin.toFixed(2)),
          netMarginPercent: 0, // Será preenchido com impostos
        },
      },
    })
  } catch (error) {
    console.error('❌ Erro ao gerar DRE:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar DRE' },
      { status: 500 }
    )
  }
}
