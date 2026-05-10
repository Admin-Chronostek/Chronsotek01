# 📋 API Documentation - Chronostek CRM

## Módulo Financeiro

### Receitas (Payments)

#### GET `/api/financeiro/payments`
Lista todos os pagamentos com filtros

**Query Parameters:**
- `companyId` (obrigatório)
- `status` (PENDING, PAID, OVERDUE, CANCELLED)
- `month` (YYYY-MM)
- `skip` (default: 0)
- `take` (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "number": "PAG-001",
      "value": 5000.00,
      "expectedDate": "2024-05-15",
      "paidDate": "2024-05-14",
      "status": "PAID",
      "client": { "id": "...", "name": "...", "email": "..." },
      "contract": { "id": "...", "number": "...", "title": "..." },
      "recipeCategory": { "id": "...", "code": "1.1", "name": "Desenvolvimento" }
    }
  ],
  "pagination": { "skip": 0, "take": 10, "total": 45 }
}
```

#### POST `/api/financeiro/payments`
Cria novo pagamento

**Body:**
```json
{
  "companyId": "...",
  "contractId": "...",
  "clientId": "...",
  "number": "PAG-002",
  "value": 3000,
  "expectedDate": "2024-06-10",
  "paidDate": "2024-06-09",
  "competenceMonth": "2024-06-01",
  "status": "PAID",
  "method": "PIX",
  "recipeCategoryId": "...",
  "description": "Pagamento desenvolvimento",
  "notes": "Recebido antecipado",
  "recordedById": "..."
}
```

#### GET `/api/financeiro/payments/[id]`
Busca um pagamento específico

#### PUT `/api/financeiro/payments/[id]`
Atualiza um pagamento existente

#### DELETE `/api/financeiro/payments/[id]`
Deleta um pagamento

---

### Despesas (Expenses)

#### GET `/api/financeiro/expenses`
Lista todas as despesas

**Query Parameters:**
- `companyId` (obrigatório)
- `status` (PENDING, APPROVED, PAID, REJECTED)
- `month` (YYYY-MM)
- `costCenterId`
- `skip`, `take`

#### POST `/api/financeiro/expenses`
Cria nova despesa

**Body:**
```json
{
  "companyId": "...",
  "costCenterId": "...",
  "description": "Servidor VPS - Neon",
  "value": 299.90,
  "date": "2024-06-01",
  "competenceMonth": "2024-06-01",
  "status": "APPROVED",
  "method": "CREDIT_CARD",
  "expenseCategoryId": "...",
  "notes": "Mensal recorrente",
  "receipt": "https://...",
  "recordedById": "..."
}
```

#### GET `/api/financeiro/expenses/[id]`
Busca uma despesa específica

#### PUT `/api/financeiro/expenses/[id]`
Atualiza uma despesa

#### DELETE `/api/financeiro/expenses/[id]`
Deleta uma despesa

---

### Categorias

#### GET `/api/financeiro/categories`
Lista todas as categorias (receita e despesa)

**Query Parameters:**
- `companyId` (obrigatório)
- `type` (recipe, expense, ou ambas se não informado)

**Response:**
```json
{
  "success": true,
  "data": {
    "recipe": [
      { "id": "...", "code": "1.1", "name": "Desenvolvimento", "color": "#3B82F6", "isActive": true },
      { "id": "...", "code": "1.2", "name": "Mensalidades", "color": "#10B981", "isActive": true }
    ],
    "expense": [
      { "id": "...", "code": "2.1", "name": "Comissão", "color": "#EF4444", "isActive": true },
      { "id": "...", "code": "2.2", "name": "VPS/Cloud", "color": "#F97316", "isActive": true }
    ]
  }
}
```

---

### Métricas

#### GET `/api/financeiro/metrics/dre`
Gera a DRE (Demonstração de Resultado) mensal

**Query Parameters:**
- `companyId` (obrigatório)
- `month` (YYYY-MM, obrigatório)

**Response:**
```json
{
  "success": true,
  "data": {
    "period": "2024-06",
    "recipe": {
      "total": 25000.00,
      "detail": [
        { "categoryCode": "1.1", "categoryName": "Desenvolvimento", "value": 15000.00 },
        { "categoryCode": "1.2", "categoryName": "Mensalidades", "value": 10000.00 }
      ]
    },
    "expenses": {
      "total": 8000.00,
      "detail": [...]
    },
    "summary": {
      "totalRecipe": 25000.00,
      "totalExpenses": 8000.00,
      "operationalProfit": 17000.00,
      "grossMarginPercent": 68.00
    }
  }
}
```

#### GET `/api/financeiro/metrics/dashboard`
Retorna KPIs principais do dashboard financeiro

**Query Parameters:**
- `companyId` (obrigatório)
- `month` (YYYY-MM, default: mês atual)

**Response:**
```json
{
  "success": true,
  "data": {
    "period": "2024-06",
    "kpis": {
      "expectedRecipe": { "label": "Receita Esperada", "value": 25000.00, "color": "#3B82F6" },
      "receivedRecipe": { "label": "Receita Recebida", "value": 23500.00, "color": "#10B981" },
      "overdueRecipe": { "label": "Receita Inadimplente", "value": 1500.00, "color": "#EF4444" },
      "totalExpenses": { "label": "Despesas Totais", "value": 8000.00, "color": "#8B5CF6" },
      "profit": { "label": "Lucro Operacional", "value": 15500.00, "color": "#10B981" },
      "profitMargin": { "label": "Margem de Lucro (%)", "value": 62.00, "color": "#06B6D4" },
      "mrr": { "label": "MRR", "value": 5000.00, "color": "#14B8A6" },
      "arr": { "label": "ARR", "value": 60000.00, "color": "#6366F1" },
      "delinquencyRate": { "label": "Taxa de Inadimplência (%)", "value": 6.00, "color": "#F59E0B" },
      "activeContracts": { "label": "Contratos Ativos", "value": 12, "color": "#3B82F6" },
      "totalClients": { "label": "Clientes Ativos", "value": 8, "color": "#10B981" }
    }
  }
}
```

---

## Módulo Comercial

### Clientes

#### GET `/api/comercial/clients`
Lista todos os clientes

**Query Parameters:**
- `companyId` (obrigatório)
- `status` (ACTIVE, INACTIVE, PROSPECT)
- `search` (nome ou email)
- `skip`, `take`

#### POST `/api/comercial/clients`
Cria novo cliente

**Body:**
```json
{
  "companyId": "...",
  "name": "Empresa XYZ LTDA",
  "email": "contato@empresaxyz.com.br",
  "phone": "(11) 98765-4321",
  "cnpj": "12.345.678/0001-90",
  "website": "https://empresaxyz.com.br",
  "address": "Rua das Flores, 123",
  "city": "São Paulo",
  "state": "SP",
  "zip": "01310-100",
  "notes": "Cliente importante - fazer follow-up mensal"
}
```

#### GET `/api/comercial/clients/[id]`
Busca cliente específico com detalhes completos (contratos, projetos, leads, pagamentos)

#### PUT `/api/comercial/clients/[id]`
Atualiza cliente (inclui healthScore e status)

#### DELETE `/api/comercial/clients/[id]`
Inativa cliente (soft delete)

---

### Contratos

#### GET `/api/comercial/contracts`
Lista todos os contratos

**Query Parameters:**
- `companyId` (obrigatório)
- `status` (ACTIVE, INADIMPLENT, AT_RISK, CANCELLED, RENEWAL_SOON)
- `clientId`
- `isRecurring` (true/false)
- `skip`, `take`

#### POST `/api/comercial/contracts`
Cria novo contrato

**Body:**
```json
{
  "companyId": "...",
  "clientId": "...",
  "createdById": "...",
  "number": "CONT-2024-001",
  "title": "Desenvolvimento Website",
  "description": "Website institucional + CRM",
  "value": 25000.00,
  "discountPercent": 5,
  "discountValue": 1250.00,
  "startDate": "2024-06-01",
  "endDate": "2024-12-31",
  "competenceStart": "2024-06-01",
  "competenceEnd": "2024-12-31",
  "isRecurring": false,
  "recurringType": null
}
```

#### GET `/api/comercial/contracts/[id]`
Busca contrato específico com todas as relações

#### PUT `/api/comercial/contracts/[id]`
Atualiza contrato

#### DELETE `/api/comercial/contracts/[id]`
Cancela contrato

---

### Pipeline Comercial

#### GET `/api/comercial/pipeline`
Retorna o pipeline comercial com forecast de receita

**Query Parameters:**
- `companyId` (obrigatório)
- `months` (default: 12)

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalForecast": 150000.00,
      "recurringForecast": 60000.00,
      "oneTimeForecast": 65000.00,
      "leadsForecast": 25000.00,
      "activeContracts": 12,
      "qualifiedLeads": 5
    },
    "monthlyForecast": [
      {
        "month": "2024-06",
        "recurring": 5000.00,
        "oneTime": 8000.00,
        "total": 13000.00,
        "contracts": [...]
      }
    ],
    "leads": [
      {
        "id": "...",
        "title": "Cliente Novo - Integração",
        "company": "Tech Solutions",
        "budget": 50000,
        "probability": 70,
        "expectedValue": 35000.00,
        "responsible": "João Silva"
      }
    ]
  }
}
```

---

## Status Codes

- `200` ✅ OK
- `201` ✅ Created
- `400` ⚠️ Bad Request
- `404` ❌ Not Found
- `409` ⚠️ Conflict (ex: número duplicado)
- `500` ❌ Internal Server Error

---

## Autenticação

Todas as rotas requerem:
- Header `X-Company-ID: {companyId}` (será implementado com NextAuth)
- Session válida

---

## Próximas Implementações

- [ ] Autenticação com NextAuth
- [ ] Proteção de rotas com permissões por diretoria
- [ ] Paginação melhorada
- [ ] Filtros avançados
- [ ] Exportação em CSV/Excel
- [ ] Webhooks para atualizações em tempo real
