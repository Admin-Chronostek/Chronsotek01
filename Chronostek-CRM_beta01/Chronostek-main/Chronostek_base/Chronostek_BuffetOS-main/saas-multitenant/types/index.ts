// ============ AUTENTICAÇÃO ============
export type User = {
  id: string
  email: string
  name: string
  avatar?: string
  phone?: string
  roleId: string
  companyId?: string
  costCenterId?: string
  createdAt: Date
  updatedAt: Date
}

export type UserRole = 'admin' | 'financeiro' | 'comercial' | 'ti' | 'marketing' | 'bdr'

export type AuthUser = User & {
  role: UserRole
  permissions: string[]
}

// ============ EMPRESA ============
export type Company = {
  id: string
  name: string
  slug: string
  email: string
  phone?: string
  logo?: string
  website?: string
  cnpj?: string
  createdAt: Date
  updatedAt: Date
}

export type CostCenter = {
  id: string
  code: string
  name: string
  description?: string
  companyId: string
  createdAt: Date
  updatedAt: Date
}

// ============ CLIENTES ============
export enum ClientStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PROSPECT = 'PROSPECT'
}

export type Client = {
  id: string
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
  notes?: string
  status: ClientStatus
  healthScore: number
  companyId: string
  createdAt: Date
  updatedAt: Date
}

// ============ LEADS ============
export enum LeadSource {
  GOOGLE_ADS = 'GOOGLE_ADS',
  GOOGLE_ORGANIC = 'GOOGLE_ORGANIC',
  INSTAGRAM = 'INSTAGRAM',
  FACEBOOK = 'FACEBOOK',
  LINKEDIN = 'LINKEDIN',
  INDICACAO = 'INDICACAO',
  COLD_CALL = 'COLD_CALL',
  EMAIL = 'EMAIL',
  EVENTO = 'EVENTO',
  WHATSAPP = 'WHATSAPP',
  WEBSITE = 'WEBSITE',
  OUTRO = 'OUTRO'
}

export enum LeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  QUALIFIED = 'QUALIFIED',
  PROPOSAL = 'PROPOSAL',
  LOST = 'LOST',
  CONVERTED = 'CONVERTED'
}

export type Lead = {
  id: string
  title: string
  email: string
  phone?: string
  company?: string
  budget?: number
  source: LeadSource
  campaign?: string
  channel?: string
  origin?: string
  status: LeadStatus
  probability: number
  notes?: string
  companyId: string
  createdById: string
  responsibleId?: string
  clientId?: string
  createdAt: Date
  updatedAt: Date
  convertedAt?: Date
}

// ============ CONTRATOS ============
export enum RecurringType {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  SEMI_ANNUALLY = 'SEMI_ANNUALLY',
  ANNUALLY = 'ANNUALLY'
}

export enum ContractStatus {
  ACTIVE = 'ACTIVE',
  INADIMPLENT = 'INADIMPLENT',
  AT_RISK = 'AT_RISK',
  CANCELLED = 'CANCELLED',
  RENEWAL_SOON = 'RENEWAL_SOON'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PARTIAL = 'PARTIAL',
  PAID = 'PAID'
}

export type Contract = {
  id: string
  number: string
  title: string
  description?: string
  value: number
  discountPercent: number
  discountValue: number
  finalValue: number
  startDate: Date
  endDate?: Date
  competenceStart: Date
  competenceEnd?: Date
  isRecurring: boolean
  recurringType?: RecurringType
  status: ContractStatus
  paymentStatus: PaymentStatus
  companyId: string
  clientId: string
  createdById: string
  createdAt: Date
  updatedAt: Date
}

// ============ PROJETOS ============
export enum ProjectStatus {
  PLANNING = 'PLANNING',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export type Project = {
  id: string
  name: string
  description?: string
  budget: number
  spent: number
  margin: number
  startDate: Date
  endDate?: Date
  expectedEndDate?: Date
  status: ProjectStatus
  priority: Priority
  companyId: string
  contractId: string
  clientId: string
  ownerId: string
  createdAt: Date
  updatedAt: Date
}

// ============ TIMESHEET ============
export type Timesheet = {
  id: string
  date: Date
  hours: number
  description: string
  companyId: string
  userId: string
  projectId: string
  createdAt: Date
  updatedAt: Date
}

// ============ CAMPANHAS ============
export enum CampaignStatus {
  PLANNING = 'PLANNING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  PAUSED = 'PAUSED',
  CANCELLED = 'CANCELLED'
}

export type Campaign = {
  id: string
  name: string
  description?: string
  budget: number
  spent: number
  roi: number
  startDate: Date
  endDate?: Date
  leadsGenerated: number
  conversions: number
  status: CampaignStatus
  companyId: string
  createdById: string
  createdAt: Date
  updatedAt: Date
}

// ============ FINANCEIRO ============
export enum PaymentMethod {
  BANK_TRANSFER = 'BANK_TRANSFER',
  CREDIT_CARD = 'CREDIT_CARD',
  PIX = 'PIX',
  CASH = 'CASH',
  CHECK = 'CHECK',
  OTHER = 'OTHER'
}

export type Payment = {
  id: string
  number: string
  value: number
  expectedDate: Date
  paidDate?: Date
  competenceMonth: Date
  status: PaymentStatus
  method: PaymentMethod
  notes?: string
  description?: string
  receiptCategory?: string
  companyId: string
  contractId: string
  clientId: string
  recordedById: string
  createdAt: Date
  updatedAt: Date
}

export enum ExpenseStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  PAID = 'PAID',
  REJECTED = 'REJECTED'
}

export type Expense = {
  id: string
  description: string
  value: number
  date: Date
  competenceMonth: Date
  category: string
  status: ExpenseStatus
  method: PaymentMethod
  notes?: string
  receipt?: string
  companyId: string
  costCenterId: string
  recordedById: string
  createdAt: Date
  updatedAt: Date
}
