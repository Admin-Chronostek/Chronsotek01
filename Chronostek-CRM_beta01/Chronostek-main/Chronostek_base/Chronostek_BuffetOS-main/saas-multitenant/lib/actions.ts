'use server'

import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

// ============ LEADS ============

export async function createLead(data: {
  title: string
  email: string
  phone?: string
  company?: string
  budget?: number
  source: string
  campaign?: string
  channel?: string
  origin?: string
  status: string
  probability: number
  companyId: string
  createdById: string
  responsibleId?: string
  notes?: string
}) {
  try {
    const lead = await prisma.lead.create({
      data,
    })
    return { success: true, data: lead }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao criar lead'
    return { success: false, error: message }
  }
}

export async function getLeads(companyId: string, filters?: {
  status?: string
  source?: string
  search?: string
}) {
  try {
    const where: Prisma.LeadWhereInput = {
      companyId,
    }

    if (filters?.status && filters.status !== 'ALL') {
      where.status = filters.status
    }

    if (filters?.source) {
      where.source = filters.source
    }

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
        { company: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    const leads = await prisma.lead.findMany({
      where,
      include: {
        createdBy: true,
        responsible: true,
        client: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return { success: true, data: leads }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao buscar leads'
    return { success: false, error: message }
  }
}

export async function updateLead(id: string, data: Partial<{
  title: string
  email: string
  phone?: string
  company?: string
  budget?: number
  source: string
  campaign?: string
  channel?: string
  origin?: string
  status: string
  probability: number
  responsibleId?: string
  clientId?: string
  notes?: string
}>) {
  try {
    const lead = await prisma.lead.update({
      where: { id },
      data,
      include: {
        createdBy: true,
        responsible: true,
        client: true,
      },
    })
    return { success: true, data: lead }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao atualizar lead'
    return { success: false, error: message }
  }
}

export async function deleteLead(id: string) {
  try {
    await prisma.lead.delete({
      where: { id },
    })
    return { success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao deletar lead'
    return { success: false, error: message }
  }
}

// ============ CLIENTES ============

export async function createClient(data: {
  name: string
  email: string
  phone?: string
  cnpj?: string
  cpf?: string
  website?: string
  address?: string
  city?: string
  state?: string
  zip?: string
  status: string
  companyId: string
  notes?: string
}) {
  try {
    const client = await prisma.client.create({
      data,
    })
    return { success: true, data: client }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao criar cliente'
    return { success: false, error: message }
  }
}

export async function getClients(companyId: string, filters?: {
  status?: string
  search?: string
}) {
  try {
    const where: Prisma.ClientWhereInput = {
      companyId,
    }

    if (filters?.status) {
      where.status = filters.status
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    const clients = await prisma.client.findMany({
      where,
      include: {
        contracts: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return { success: true, data: clients }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao buscar clientes'
    return { success: false, error: message }
  }
}

export async function updateClient(id: string, data: Partial<{
  name: string
  email: string
  phone?: string
  cnpj?: string
  cpf?: string
  website?: string
  address?: string
  city?: string
  state?: string
  zip?: string
  status: string
  healthScore: number
  notes?: string
}>) {
  try {
    const client = await prisma.client.update({
      where: { id },
      data,
    })
    return { success: true, data: client }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao atualizar cliente'
    return { success: false, error: message }
  }
}

// ============ CONTRATOS ============

export async function createContract(data: {
  number: string
  title: string
  description?: string
  value: number
  discountPercent?: number
  discountValue?: number
  finalValue: number
  startDate: Date
  endDate?: Date
  competenceStart: Date
  competenceEnd?: Date
  isRecurring: boolean
  recurringType?: string
  status: string
  paymentStatus: string
  companyId: string
  clientId: string
  createdById: string
}) {
  try {
    const contract = await prisma.contract.create({
      data,
      include: {
        client: true,
        createdBy: true,
      },
    })
    return { success: true, data: contract }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao criar contrato'
    return { success: false, error: message }
  }
}

export async function getContracts(companyId: string, filters?: {
  status?: string
  clientId?: string
}) {
  try {
    const where: Prisma.ContractWhereInput = {
      companyId,
    }

    if (filters?.status) {
      where.status = filters.status
    }

    if (filters?.clientId) {
      where.clientId = filters.clientId
    }

    const contracts = await prisma.contract.findMany({
      where,
      include: {
        client: true,
        createdBy: true,
        projects: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return { success: true, data: contracts }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao buscar contratos'
    return { success: false, error: message }
  }
}

// ============ MÉTRICAS ============

export async function getDashboardMetrics(companyId: string) {
  try {
    // Leads
    const totalLeads = await prisma.lead.count({
      where: { companyId },
    })

    const newLeads = await prisma.lead.count({
      where: { companyId, status: 'NEW' },
    })

    const convertedLeads = await prisma.lead.count({
      where: { companyId, status: 'CONVERTED' },
    })

    // Clientes
    const totalClients = await prisma.client.count({
      where: { companyId },
    })

    const activeClients = await prisma.client.count({
      where: { companyId, status: 'ACTIVE' },
    })

    // Contratos
    const totalContracts = await prisma.contract.count({
      where: { companyId },
    })

    const activeContracts = await prisma.contract.count({
      where: { companyId, status: 'ACTIVE' },
    })

    // Receita
    const totalRevenue = await prisma.contract.aggregate({
      where: { companyId, status: 'ACTIVE' },
      _sum: { finalValue: true },
    })

    // Receita recorrente
    const mrrContracts = await prisma.contract.aggregate({
      where: {
        companyId,
        status: 'ACTIVE',
        isRecurring: true,
      },
      _sum: { finalValue: true },
    })

    return {
      success: true,
      data: {
        leads: {
          total: totalLeads,
          new: newLeads,
          converted: convertedLeads,
        },
        clients: {
          total: totalClients,
          active: activeClients,
        },
        contracts: {
          total: totalContracts,
          active: activeContracts,
        },
        revenue: {
          total: totalRevenue._sum.finalValue || 0,
          mrr: mrrContracts._sum.finalValue || 0,
        },
      },
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao buscar métricas'
    return { success: false, error: message }
  }
}
