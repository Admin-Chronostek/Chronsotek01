# 📊 Guia de Configuração - Sistema Financeiro Chronostek CRM

## 🚀 Resumo da Implementação

Você agora tem um **sistema financeiro e comercial completo** com:

✅ Schema Prisma com 4 diretorias  
✅ Categorias de receita (8 tipos) e despesa (10 tipos)  
✅ APIs RESTful para financeiro e comercial  
✅ Dashboard Financeiro com DRE e KPIs  
✅ Dashboard Comercial com Pipeline e Forecast  
✅ Competência financeira (diferencia data de pagamento vs prestação)  
✅ Controle de MRR/ARR  
✅ Health Score de clientes  

---

## 📋 Estrutura de Diretorias

### Centros de Custo Criados no Seed

```
1000 - Diretoria Financeira
2000 - Diretoria Comercial
3000 - Diretoria Marketing
4000 - Diretoria Inovação/TI
```

---

## 💰 Categorias Financeiras

### RECEITAS (1.1-1.8)

| Código | Nome | Uso |
|--------|------|-----|
| 1.1 | Desenvolvimento | Projetos de desenvolvimento novos |
| 1.2 | Mensalidades | Contratos recorrentes mensais |
| 1.3 | Consultoria | Horas de consultoria faturadas |
| 1.4 | Gestão de Tráfego | Campanhas e tráfego pago |
| 1.5 | Setup/Implantação | Implementação inicial |
| 1.6 | Automação | Automações e integrações |
| 1.7 | Hospedagem | Hospedagem em nuvem |
| 1.8 | Suporte | Suporte e manutenção |

### DESPESAS (2.1-2.10)

| Código | Nome | Uso |
|--------|------|-----|
| 2.1 | Comissão | Comissões para vendedores/BDR |
| 2.2 | VPS/Cloud | Infraestrutura servidores |
| 2.3 | APIs | APIs terceirizadas (Stripe, etc) |
| 2.4 | Ferramentas | Softwares/ferramentas |
| 2.5 | Domínios | Domínios e certificados SSL |
| 2.6 | Marketing Interno | Ads e campanhas internas |
| 2.7 | Contabilidade | Serviço contábil |
| 2.8 | Jurídico | Serviços jurídicos |
| 2.9 | Bancos/Taxas | Taxas bancárias |
| 2.10 | Impostos | Impostos diversos |

---

## 🔧 Instalação e Setup

### 1. Atualizar package.json

```bash
cd saas-multitenant
npm install
```

### 2. Configurar Neon PostgreSQL

```env
# .env.local
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Gerar Cliente Prisma

```bash
npx prisma generate
```

### 4. Executar Migrations

```bash
npx prisma migrate deploy
```

### 5. Fazer Seed do Banco

```bash
npx prisma db seed
```

Isso criará:
- ✅ Empresa padrão
- ✅ 4 Centros de custo
- ✅ 8 Categorias de receita
- ✅ 10 Categorias de despesa

### 6. Iniciar Servidor

```bash
npm run dev
```

Acesse:
- Dashboard: http://localhost:3000/dashboard
- Financeiro: http://localhost:3000/dashboard/financeiro
- Comercial: http://localhost:3000/dashboard/comercial

---

## 📊 Como Usar - Workflow Típico

### Cenário 1: Registrar Receita Recebida

```bash
# 1. Criar cliente
POST /api/comercial/clients
{
  "companyId": "...",
  "name": "Cliente XYZ",
  "email": "cliente@xyz.com"
}

# 2. Criar contrato
POST /api/comercial/contracts
{
  "companyId": "...",
  "clientId": "...",
  "number": "CONT-2024-001",
  "title": "Website Institucional",
  "value": 25000,
  "finalValue": 25000,
  "startDate": "2024-06-01",
  "isRecurring": false
}

# 3. Registrar pagamento
POST /api/financeiro/payments
{
  "companyId": "...",
  "contractId": "...",
  "clientId": "...",
  "number": "PAG-001",
  "value": 25000,
  "competenceMonth": "2024-06-01",
  "status": "PAID",
  "recipeCategoryId": "1.1", // Desenvolvimento
  "method": "PIX"
}

# Resultado: Receita refletida no Dashboard
```

### Cenário 2: Registrar Despesa

```bash
# Registrar despesa com VPS
POST /api/financeiro/expenses
{
  "companyId": "...",
  "costCenterId": "4000", // Diretoria TI
  "description": "VPS Neon - Junho",
  "value": 299.90,
  "competenceMonth": "2024-06-01",
  "status": "PAID",
  "expenseCategoryId": "2.2", // VPS/Cloud
  "method": "CREDIT_CARD"
}

# Resultado: Despesa aparece no DRE e reduz lucro
```

### Cenário 3: Criar Contrato Recorrente (MRR)

```bash
# Cliente com plano mensal de R$ 3.000
POST /api/comercial/contracts
{
  "companyId": "...",
  "clientId": "...",
  "number": "CONT-REC-001",
  "title": "Plano Mensal - Consultoria",
  "value": 3000,
  "finalValue": 3000,
  "startDate": "2024-06-01",
  "endDate": "2025-06-01",
  "isRecurring": true,
  "recurringType": "MONTHLY"
}

# Resultado: 
# - MRR = R$ 3.000/mês
# - ARR = R$ 36.000/ano
# - Aparece no forecast de receita
```

---

## 📈 Métricas Importantes

### 1. DRE (Demonstração de Resultado)

**GET** `/api/financeiro/metrics/dre?companyId=...&month=2024-06`

Retorna:
- Receitas por categoria
- Despesas por categoria
- Lucro operacional
- Margem bruta

### 2. Dashboard KPIs

**GET** `/api/financeiro/metrics/dashboard?companyId=...&month=2024-06`

Retorna:
- Receita esperada vs recebida
- Receita inadimplente
- Despesas aprovadas/pagas
- Lucro e margem
- MRR/ARR
- Taxa de inadimplência
- Contratos e clientes ativos

### 3. Pipeline Comercial

**GET** `/api/comercial/pipeline?companyId=...&months=12`

Retorna:
- Forecast mensal de receita
- Contratos ativos por mês
- Leads qualificados
- Probability-weighted forecast

---

## 🎯 Próximas Features (Roadmap)

### Fase 2: Autenticação
- [ ] NextAuth com MultiTenant
- [ ] Login por diretoria
- [ ] Permissões granulares

### Fase 3: Relatórios Avançados
- [ ] Relatórios exportáveis (PDF/Excel)
- [ ] Gráficos avançados (recharts)
- [ ] Comparativo período anterior
- [ ] Análise de sazonalidade

### Fase 4: Automações
- [ ] Webhooks para atualizar status
- [ ] Notificações de inadimplência
- [ ] Alertas de contratos próximos de vencer
- [ ] Atualização automática de projetos

### Fase 5: Integrações
- [ ] Stripe/PagSeguro para pagamentos
- [ ] CRM integrado com WhatsApp
- [ ] Google Sheets sync
- [ ] Contabilidade automática

---

## 🐛 Troubleshooting

### Erro: "companyId é obrigatório"

**Causa**: Sessão não está sendo passada corretamente  
**Solução**: Adicionar middleware de autenticação

### Erro: ForeignKey na migração

**Causa**: Banco já existente incompatível  
**Solução**: 
```bash
npx prisma migrate reset  # ⚠️ Deleta dados
npx prisma migrate deploy
```

### Dados não aparecem no Dashboard

**Causa**: CompanyID pode estar errado  
**Solução**: 
```bash
npx prisma studio  # Verificar dados no Prisma Studio
```

---

## 📞 Suporte e Contato

Para dúvidas ou issues:
- Documentação: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- Roadmap: [ROADMAP.md](./ROADMAP.md)
- Schema Prisma: [schema.prisma](./prisma/schema.prisma)

---

## 💡 Boas Práticas

### ✅ Competência Financeira

Sempre diferenciar:
- **Data de pagamento**: Quando recebeu o dinheiro
- **Competência**: Mês que o serviço foi prestado

```
Exemplo: Cliente paga em junho pelo serviço de maio
- expectedDate/paidDate: 2024-06-10
- competenceMonth: 2024-05-01  ← Use aqui na DRE!
```

### ✅ Categorias Corretas

Use as categorias padronizadas:
- ❌ Não criar categoria nova (use a mais próxima)
- ✅ Se nenhuma serve, avisar para criar no admin

### ✅ Status de Contrato

Manter atualizado o status:
- `ACTIVE`: Contrato em vigência
- `AT_RISK`: Cliente com atraso
- `INADIMPLENT`: Cliente vencido
- `RENEWAL_SOON`: Próximo de renovar
- `CANCELLED`: Contrato finalizado

### ✅ Health Score

Atualizar regularmente (0-100):
- 100: Cliente novo, paga em dia, responde rápido
- 50-75: Cliente bom, 1-2 atrasos pequenos
- 25-50: Cliente com problemas, atrasos frequentes
- 0-25: Cliente em risco de churn

---

## 📊 Exemplo Completo de Uso

Você é o gerente financeiro e quer gerar o relatório de junho de 2024:

### Passo 1: Acessar Dashboard Financeiro
```
http://localhost:3000/dashboard/financeiro
```

### Passo 2: Selecionar Mês
```
Mês: Junho 2024 (2024-06)
```

### Passo 3: Visualizar Dados

O dashboard mostrará automaticamente:
- ✅ Receita Recebida: R$ 45.000
- ✅ Receita Inadimplente: R$ 5.000
- ✅ Total Despesas: R$ 12.000
- ✅ Lucro: R$ 33.000 (73% margem)
- ✅ MRR: R$ 8.000/mês

### Passo 4: Exportar/Compartilhar
```bash
# Download como Excel
GET /api/financeiro/metrics/dre?companyId=...&month=2024-06&format=excel

# Enviar por email para sócios
# (Implementar em Fase 2)
```

---

**Parabéns!** 🎉 Seu CRM financeiro e comercial agora está pronto!
