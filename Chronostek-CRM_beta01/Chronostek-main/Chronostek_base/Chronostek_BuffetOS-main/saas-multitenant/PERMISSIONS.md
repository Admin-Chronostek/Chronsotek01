# Permissões e Controle de Acesso

## Estrutura de Roles

### Admin
- Acesso completo ao sistema
- Gerenciar usuários e permissões
- Visualizar todos os dados da empresa
- Configurar ambientes

### Sócio/Gerente
- Acesso a todos os módulos
- Ver relatórios de todas as diretorias
- Criar usuários
- Não pode deletar usuários

### Diretor de Financeiro (1000)
- Módulo Financeiro: ✅ Completo
- Módulo Comercial: 👀 Leitura
- Módulo Leads: ❌ Sem acesso
- Módulo Inovação: ❌ Sem acesso
- Módulo Marketing: ❌ Sem acesso

### Diretor Comercial (2000)
- Módulo Comercial: ✅ Completo
- Módulo Leads: ✅ Completo
- Módulo Financeiro: 👀 Leitura
- Módulo Inovação: 👀 Leitura
- Módulo Marketing: 👀 Leitura

### Gerente de Marketing (3000)
- Módulo Marketing: ✅ Completo
- Módulo Leads: ✅ Edição (campanhas)
- Módulo Comercial: 👀 Leitura
- Módulo Financeiro: ❌ Sem acesso
- Módulo Inovação: ❌ Sem acesso

### Gerente de Inovação/TI (4000)
- Módulo Inovação: ✅ Completo
- Módulo Leads: ❌ Sem acesso
- Módulo Comercial: 👀 Leitura
- Módulo Financeiro: 👀 Leitura
- Módulo Marketing: ❌ Sem acesso

### BDR/Closer
- Módulo Leads: ✅ Leitura + Edição (próprios)
- Módulo Comercial: 👀 Leitura
- Outros módulos: ❌ Sem acesso
- Restrições:
  - Só vê leads atribuídos a si
  - Pode atualizar status do lead
  - Não pode deletar

### Operacional
- Módulo Inovação: 👀 Leitura
- Módulo Comercial: 👀 Leitura
- Módulo Leads: 👀 Leitura
- Módulo Financeiro: ❌ Sem acesso
- Módulo Marketing: ❌ Sem acesso

## Permissões por Ação

### Leads
```typescript
enum LeadPermission {
  CREATE = 'lead.create'
  READ = 'lead.read'
  UPDATE = 'lead.update'
  DELETE = 'lead.delete'
  CONVERT = 'lead.convert'
}
```

### Contratos
```typescript
enum ContractPermission {
  CREATE = 'contract.create'
  READ = 'contract.read'
  UPDATE = 'contract.update'
  DELETE = 'contract.delete'
  APPROVE = 'contract.approve'
}
```

### Projetos
```typescript
enum ProjectPermission {
  CREATE = 'project.create'
  READ = 'project.read'
  UPDATE = 'project.update'
  DELETE = 'project.delete'
  ALLOCATE_RESOURCES = 'project.allocate'
}
```

### Financeiro
```typescript
enum FinancePermission {
  CREATE_PAYMENT = 'finance.payment.create'
  READ_PAYMENT = 'finance.payment.read'
  CREATE_EXPENSE = 'finance.expense.create'
  READ_EXPENSE = 'finance.expense.read'
  VIEW_DRE = 'finance.dre.read'
  VIEW_CASH_FLOW = 'finance.cashflow.read'
  APPROVE_EXPENSE = 'finance.expense.approve'
}
```

## Implementação no Código

### Middleware de Permissões

```typescript
// lib/permissions.ts
import { User } from '@/types'

export function hasPermission(user: User, permission: string): boolean {
  return user.permissions?.includes(permission) ?? false
}

export function requirePermission(
  permission: string,
  user: User
): void {
  if (!hasPermission(user, permission)) {
    throw new Error(`Unauthorized: Permission '${permission}' required`)
  }
}
```

### Usando em Server Actions

```typescript
// lib/actions.ts
'use server'

import { requirePermission } from '@/lib/permissions'

export async function createLead(data: any, userId: string) {
  const user = await getUser(userId)
  requirePermission('lead.create', user)

  // Resto do código...
}
```

### Proteção no Frontend

```typescript
'use client'

import { useSession } from 'next-auth/react'
import { hasPermission } from '@/lib/permissions'

export function LeadForm() {
  const { data: session } = useSession()

  if (!hasPermission(session?.user, 'lead.create')) {
    return <p>Você não tem permissão para criar leads</p>
  }

  return (
    // Formulário...
  )
}
```

## Exemplo: Database Schema para Permissões

```sql
-- roles
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  permissions TEXT[] NOT NULL
);

-- users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  role_id INTEGER REFERENCES roles(id),
  company_id INTEGER REFERENCES companies(id)
);

-- INSERT de roles
INSERT INTO roles (name, permissions) VALUES
('admin', ARRAY[
  'lead.create', 'lead.read', 'lead.update', 'lead.delete',
  'contract.create', 'contract.read', 'contract.update', 'contract.delete',
  'finance.payment.create', 'finance.payment.read',
  'finance.expense.create', 'finance.expense.read'
]),
('director_finance', ARRAY[
  'finance.payment.create', 'finance.payment.read',
  'finance.expense.create', 'finance.expense.read',
  'finance.dre.read', 'contract.read'
]),
('director_commercial', ARRAY[
  'lead.create', 'lead.read', 'lead.update',
  'contract.create', 'contract.read', 'contract.update',
  'finance.dre.read'
]),
('bdr', ARRAY[
  'lead.read', 'lead.update',
  'contract.read'
]);
```

## Fluxo de Autenticação

1. Usuário faz login
2. Verifica credentials no banco
3. Carrega role e permissões
4. Cria JWT com permissions[]
5. Envia cookie HTTP-only
6. Em cada request, valida token e permissões

## Notas de Segurança

- ✅ Sempre validar permissões no backend (Server Actions)
- ✅ Nunca confiar em permissões do frontend apenas
- ✅ Usar JWT com expiração (ex: 24h)
- ✅ Refresh token em cookie seguro
- ✅ Log de ações sensíveis (deletar, aprovar, etc)
- ✅ Rate limiting em endpoints críticos
