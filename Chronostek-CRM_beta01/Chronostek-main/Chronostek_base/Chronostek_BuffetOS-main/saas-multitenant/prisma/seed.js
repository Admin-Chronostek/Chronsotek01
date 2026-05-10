import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Criar empresa padrão se não existir
  const company = await prisma.company.upsert({
    where: { slug: 'chronostek-default' },
    update: {},
    create: {
      name: 'Chronostek',
      slug: 'chronostek-default',
      email: 'contato@chronostek.com.br',
    },
  })

  console.log('✅ Empresa criada:', company.name)

  // Criar centros de custo
  const costCenters = [
    { code: '1000', name: 'Diretoria Financeira', description: 'Gestão Financeira e Faturamento' },
    { code: '2000', name: 'Diretoria Comercial', description: 'Vendas e Relacionamento' },
    { code: '3000', name: 'Diretoria Marketing', description: 'Marketing e Campanhas' },
    { code: '4000', name: 'Diretoria Inovação/TI', description: 'Desenvolvimento e Infraestrutura' },
  ]

  for (const center of costCenters) {
    const costCenter = await prisma.costCenter.upsert({
      where: { companyId_code: { companyId: company.id, code: center.code } },
      update: {},
      create: { ...center, companyId: company.id },
    })
    console.log(`✅ Centro de Custo criado: ${costCenter.code} - ${costCenter.name}`)
  }

  // Criar categorias de receita
  const recipeCategories = [
    { code: '1.1', name: 'Desenvolvimento', color: '#3B82F6' },
    { code: '1.2', name: 'Mensalidades', color: '#10B981' },
    { code: '1.3', name: 'Consultoria', color: '#F59E0B' },
    { code: '1.4', name: 'Gestão de Tráfego', color: '#8B5CF6' },
    { code: '1.5', name: 'Setup/Implantação', color: '#EC4899' },
    { code: '1.6', name: 'Automação', color: '#06B6D4' },
    { code: '1.7', name: 'Hospedagem', color: '#14B8A6' },
    { code: '1.8', name: 'Suporte', color: '#6366F1' },
  ]

  for (const category of recipeCategories) {
    const recipe = await prisma.recipeCategory.upsert({
      where: { companyId_code: { companyId: company.id, code: category.code } },
      update: {},
      create: { ...category, companyId: company.id },
    })
    console.log(`✅ Categoria de Receita criada: ${recipe.code} - ${recipe.name}`)
  }

  // Criar categorias de despesa
  const expenseCategories = [
    { code: '2.1', name: 'Comissão', color: '#EF4444' },
    { code: '2.2', name: 'VPS/Cloud', color: '#F97316' },
    { code: '2.3', name: 'APIs', color: '#FB923C' },
    { code: '2.4', name: 'Ferramentas', color: '#FBBF24' },
    { code: '2.5', name: 'Domínios', color: '#FCDCA1' },
    { code: '2.6', name: 'Marketing Interno', color: '#FDE047' },
    { code: '2.7', name: 'Contabilidade', color: '#DCFCE7' },
    { code: '2.8', name: 'Jurídico', color: '#CCE5FF' },
    { code: '2.9', name: 'Bancos/Taxas', color: '#DDD6FE' },
    { code: '2.10', name: 'Impostos', color: '#F5D0A9' },
  ]

  for (const category of expenseCategories) {
    const expense = await prisma.expenseCategory.upsert({
      where: { companyId_code: { companyId: company.id, code: category.code } },
      update: {},
      create: { ...category, companyId: company.id },
    })
    console.log(`✅ Categoria de Despesa criada: ${expense.code} - ${expense.name}`)
  }

  console.log('✨ Seed concluído com sucesso!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Erro ao fazer seed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
