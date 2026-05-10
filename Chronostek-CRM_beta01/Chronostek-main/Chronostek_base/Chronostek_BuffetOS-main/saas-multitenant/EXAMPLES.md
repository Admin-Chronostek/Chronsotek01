# Exemplo de Uso das Server Actions

## Importar as ações

```typescript
'use client'

import { createLead, getLeads, updateLead, deleteLead } from '@/lib/actions'
```

## Exemplo: Criar um Lead

```typescript
const handleCreateLead = async (formData: {
  title: string
  email: string
  phone?: string
  company?: string
  source: string
  budget?: number
}) => {
  const result = await createLead({
    ...formData,
    status: 'NEW',
    probability: 0,
    companyId: 'sua-empresa-id',
    createdById: 'seu-user-id',
  })

  if (result.success) {
    console.log('Lead criado:', result.data)
  } else {
    console.error('Erro:', result.error)
  }
}
```

## Exemplo: Listar Leads

```typescript
'use client'

import { useEffect, useState } from 'react'
import { getLeads } from '@/lib/actions'

export function LeadsList() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeads = async () => {
      const result = await getLeads('sua-empresa-id', {
        status: 'NEW',
        search: 'João',
      })

      if (result.success) {
        setLeads(result.data)
      }

      setLoading(false)
    }

    fetchLeads()
  }, [])

  if (loading) return <div>Carregando...</div>

  return (
    <ul>
      {leads.map((lead) => (
        <li key={lead.id}>
          <strong>{lead.title}</strong> - {lead.email}
        </li>
      ))}
    </ul>
  )
}
```

## Exemplo: Atualizar Lead

```typescript
const handleUpdateLead = async (leadId: string) => {
  const result = await updateLead(leadId, {
    status: 'QUALIFIED',
    probability: 75,
  })

  if (result.success) {
    console.log('Lead atualizado com sucesso')
  }
}
```

## Exemplo: Deletar Lead

```typescript
const handleDeleteLead = async (leadId: string) => {
  const result = await deleteLead(leadId)

  if (result.success) {
    console.log('Lead deletado com sucesso')
  }
}
```

## Exemplo: Obter Métricas do Dashboard

```typescript
'use client'

import { useEffect, useState } from 'react'
import { getDashboardMetrics } from '@/lib/actions'

export function DashboardMetrics() {
  const [metrics, setMetrics] = useState(null)

  useEffect(() => {
    const fetchMetrics = async () => {
      const result = await getDashboardMetrics('sua-empresa-id')

      if (result.success) {
        setMetrics(result.data)
      }
    }

    fetchMetrics()
  }, [])

  if (!metrics) return <div>Carregando métricas...</div>

  return (
    <div>
      <h2>Dashboard</h2>
      <div>
        <p>Total de Leads: {metrics.leads.total}</p>
        <p>Clientes Ativos: {metrics.clients.active}</p>
        <p>Receita: R$ {metrics.revenue.total}</p>
        <p>MRR: R$ {metrics.revenue.mrr}</p>
      </div>
    </div>
  )
}
```

## Estrutura de Resposta

Todas as ações retornam um objeto com a estrutura:

### Sucesso
```typescript
{
  success: true,
  data: { /* dados retornados */ }
}
```

### Erro
```typescript
{
  success: false,
  error: "Mensagem de erro"
}
```

## Tipos de Entrada

### CreateLead
```typescript
{
  title: string              // Nome do lead
  email: string              // Email (requerido)
  phone?: string             // Telefone (opcional)
  company?: string           // Empresa (opcional)
  budget?: number            // Orçamento em R$ (opcional)
  source: string             // Origem (GOOGLE_ADS, INSTAGRAM, LINKEDIN, etc)
  campaign?: string          // Campanha (opcional)
  channel?: string           // Canal (Pago, Orgânico, Direto)
  origin?: string            // Origem detalhada (opcional)
  status: string             // Status (NEW, CONTACTED, QUALIFIED, etc)
  probability: number        // 0-100
  companyId: string          // ID da empresa (requerido)
  createdById: string        // ID do usuário criador (requerido)
  responsibleId?: string     // ID do responsável (opcional)
  notes?: string             // Notas (opcional)
}
```

### GetLeads Filters
```typescript
{
  status?: string            // Filtrar por status (ou 'ALL')
  source?: string            // Filtrar por origem
  search?: string            // Busca por nome, email ou empresa
}
```

## Tratamento de Erros

```typescript
try {
  const result = await createLead(data)

  if (!result.success) {
    // Tratar erro
    console.error('Erro:', result.error)
    // Mostrar mensagem ao usuário
    toast.error(result.error)
  } else {
    // Sucesso
    console.log('Lead criado:', result.data)
    toast.success('Lead criado com sucesso!')
  }
} catch (err) {
  console.error('Erro inesperado:', err)
  toast.error('Erro inesperado')
}
```
