# 🏗️ Arquitetura e Escalabilidade

## Esboço da Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js 15)                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Components (React)                                       │  │
│  │  ├─ DashboardLayout                                       │  │
│  │  ├─ LeadsList, LeadForm                                   │  │
│  │  ├─ ContractTable, ProjectCards                          │  │
│  │  └─ FinanceCharts, TimesheetForm                         │  │
│  └───────────────────────────────────────────────────────────┘  │
│                            ↓                                     │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Server Actions (Backend-ish)                            │  │
│  │  ├─ createLead, updateLead, deleteLead                   │  │
│  │  ├─ getLeads, getClients, getContracts                   │  │
│  │  ├─ getDashboardMetrics                                  │  │
│  │  └─ ... outras ações                                     │  │
│  └───────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                      ORM (Prisma)                              │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Schema:                                                  │  │
│  │  - User, Role, Company, CostCenter                        │  │
│  │  - Lead, Client, Contract, Project                        │  │
│  │  - Payment, Expense, Timesheet, Campaign                  │  │
│  └───────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│              PostgreSQL Database (Neon)                        │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Tables: ~15-20 tabelas                                   │  │
│  │  - Totalmente normalizado                                 │  │
│  │  - Indexes em campos de busca/filtro                      │  │
│  │  - Foreign keys com cascade                               │  │
│  └───────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────┘
```

## Padrão: Component → Server Action → Prisma → Database

```typescript
// 1. Component (Client-side)
'use client'
import { createLead } from '@/lib/actions'

export function LeadForm() {
  const handleSubmit = async (data) => {
    // 2. Chamar Server Action
    const result = await createLead(data)
    
    if (result.success) {
      // Sucesso
    } else {
      // Erro
    }
  }
}

// 3. Server Action
'use server'
export async function createLead(data) {
  // Validação
  // Permissões
  
  // 4. Chamar Prisma
  const lead = await prisma.lead.create({ data })
  
  // Retornar resultado
  return { success: true, data: lead }
}

// 5. Prisma gera SQL
// 6. PostgreSQL executa
```

## Escalabilidade Futura

### Fase 1: MVP (Atual)
- ✅ Single Next.js app
- ✅ Server Actions inline
- ✅ Prisma com SQLite ou PostgreSQL
- Limite: ~5-10 usuários simultâneos

### Fase 2: Crescimento (3-6 meses)
Quando atingir 50+ usuários ativos ou 10.000+ registros:

```
┌──────────────────────┐
│  Next.js Frontend    │  
│  (Vercel)            │
└──────────│───────────┘
           │
    ┌──────▼─────────┐
    │  API Gateway   │  (Rate limiting, Auth)
    └──────┬─────────┘
           │
    ┌──────▼──────────────────────────────────┐
    │  Node.js Backend Services (separados)   │
    │  ├─ Leads Service                       │
    │  ├─ Commercial Service                  │
    │  ├─ Finance Service                     │
    │  └─ Reports Service                     │
    └──────┬──────────────────────────────────┘
           │
    ┌──────▼──────────────────────┐
    │  PostgreSQL Database (Neon) │
    │  ├─ Read Replicas           │
    │  └─ Automated Backups       │
    └─────────────────────────────┘
```

### Fase 3: Enterprise (1+ ano)
- Microserviços
- MessageQueue (Bull, RabbitMQ)
- Cache (Redis)
- Search Index (Elasticsearch)
- Analytics (Warehouse)

## Padrões de Design Usados

### 1. Server Actions Pattern
```typescript
// Centralized backend logic without separate API routes
'use server'
export async function createLead(data) { }
```

✅ Pros: Simples, seguro, tipa server-side
❌ Cons: Acoplado ao Next.js

### 2. RBAC (Role-Based Access Control)
```typescript
// Permissions checadas em Server Actions
export async function createExpense(data, userId) {
  const user = await getUser(userId)
  requirePermission('expense.create', user)
  // ...
}
```

### 3. Multi-Tenant Architecture
```typescript
// Isolamento por companyId
const leads = await prisma.lead.findMany({
  where: { companyId: user.companyId }
})
```

✅ Um banco para múltiplas empresas
❌ Cuidado com isolamento de dados

### 4. Audit Trail (Planejado)
```typescript
// Log de mudanças em entidades críticas
await prisma.auditLog.create({
  data: {
    action: 'CREATE',
    entity: 'Lead',
    entityId: lead.id,
    userId,
    changes: { ...oldData, ...newData }
  }
})
```

## Performance Optimization

### Índices Recomendados
```sql
-- Leads
CREATE INDEX idx_leads_company ON leads(company_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_by ON leads(created_by_id);

-- Contracts
CREATE INDEX idx_contracts_client ON contracts(client_id);
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_contracts_company ON contracts(company_id);

-- Payments
CREATE INDEX idx_payments_contract ON payments(contract_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_competence ON payments(competence_month);

-- Expenses
CREATE INDEX idx_expenses_company ON expenses(company_id);
CREATE INDEX idx_expenses_cost_center ON expenses(cost_center_id);
CREATE INDEX idx_expenses_category ON expenses(category);
```

### Query Optimization
```typescript
// ❌ N+1 Problem - Ruim
const leads = await prisma.lead.findMany()
for (const lead of leads) {
  const client = await prisma.client.findUnique({
    where: { id: lead.clientId }
  })
}

// ✅ Use include - Bom
const leads = await prisma.lead.findMany({
  include: { client: true }
})
```

### Caching Strategy
```typescript
// Para dados que mudam raramente
const roles = await prisma.role.findMany()
// Cache por 1 hora
lastRolesCache = roles
lastRolesCacheTime = Date.now()

// Para dados em tempo real, sem cache
const leads = await prisma.lead.findMany(...)
```

## Segurança

### Input Validation
```typescript
import { z } from 'zod'

const leadSchema = z.object({
  title: z.string().min(1),
  email: z.string().email(),
  budget: z.number().positive().optional(),
})

const result = leadSchema.safeParse(input)
```

### SQL Injection Prevention
✅ Prisma previne automaticamente
❌ Nunca use string templates com SQL

### Authentication Flow
```
1. Login → Generate JWT + Refresh Token
2. JWT em Authorization header (ou cookie)
3. Validate JWT em cada request
4. Refresh token quando JWT expirar
5. Logout → Invalidate tokens
```

## Deployment

### Frontend (Vercel)
```bash
# Automático com push para main
# Customizado com vercel.json
```

### Database (Neon)
```
✅ Backup automático
✅ Read replicas
✅ Point-in-time recovery
```

### Secrets Management
- .env.production.local (local)
- Vercel Environment Variables (produção)
- Neon Dashboard (database credentials)

## Monitoramento e Logging

### Logs Recomendados
```typescript
// Erros críticos
console.error('[ERROR]', error)

// Ações de negócio
console.log('[ACTION]', 'Lead criado', { leadId, userId })

// Performance
console.time('fetch-leads')
const leads = await getLeads()
console.timeEnd('fetch-leads')
```

### Métricas a Acompanhar
- Time to interactive
- Database query time
- Number of active users
- Error rate
- Conversion rate (leads → contracts)

## Próximas Melhorias

1. **API Routes** para casos específicas
2. **Message Queue** para ações assíncronas
3. **Cache Layer** (Redis) para reads frequentes
4. **Search** (Elasticsearch) para filtros complexos
5. **Analytics** warehouse para BI
6. **Mobile App** (React Native)
7. **Webhooks** para integrações externas
