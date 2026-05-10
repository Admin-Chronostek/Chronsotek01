# Chronostek CRM - Guia de Implementação

## 🚀 Visão Geral

Sistema integrado de CRM, Financeiro e Gestão Comercial desenvolvido em Next.js 15 + TypeScript + PostgreSQL (Neon).

### Módulos Implementados

1. **Leads** ✅ (Em progresso)
   - Criação, edição e exclusão de leads
   - Rastreamento de origem (Google Ads, Instagram, LinkedIn, etc)
   - Status do lead (Novo, Contatado, Qualificado, Proposta, Perdido, Convertido)
   - Probabilidade de conversão
   - Orçamento estimado
   - Filtros e busca

2. **Comercial** 🔄 (Estrutura pronta)
   - Pipeline de vendas
   - Gestão de contratos
   - Gestão de clientes
   - Previsão de receita (MRR/ARR)

3. **Financeiro** 🔄 (Estrutura pronta)
   - DRE Mensal
   - Fluxo de Caixa
   - Receitas e Despesas
   - Análise por Centro de Custo
   - Competência Financeira

4. **Inovação/TI** 🔄 (Estrutura pronta)
   - Gestão de Projetos
   - Timesheet
   - Alocação de Recursos
   - Margem por Projeto

5. **Marketing** 🔄 (Estrutura pronta)
   - Campanhas
   - ROI por Campanha
   - Attribution
   - CAC e LTV

## 📋 Pré-requisitos

- Node.js 18+
- PostgreSQL (via Neon)
- npm ou yarn

## 🔧 Instalação

### 1. Configurar variáveis de ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env.local

# Editar .env.local com as credenciais do Neon
DATABASE_URL="postgresql://user:password@host/database"
NEXTAUTH_SECRET="sua-chave-secreta-aqui"
NEXTAUTH_URL="http://localhost:3001"
```

**Para gerar NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 2. Instalar dependências

```bash
npm install
# ou
yarn install
```

### 3. Configurar banco de dados

```bash
# Gerar cliente Prisma
npm run prisma:generate

# Executar migrações
npm run prisma:migrate

# (Opcional) Abrir Prisma Studio para visualizar dados
npm run prisma:studio
```

### 4. Iniciar servidor de desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:3001`

## 📊 Estrutura de Dados

### Centros de Custo (Diretorias)

```
1000 - Diretoria Financeira
2000 - Diretoria Comercial
3000 - Diretoria Marketing
4000 - Diretoria Inovação/TI
```

### Categorias de Receitas (1.x)

- 1.1 Desenvolvimento
- 1.2 Mensalidades
- 1.3 Consultoria
- 1.4 Gestão de Tráfego
- 1.5 Setup/Implantação
- 1.6 Automação
- 1.7 Hospedagem
- 1.8 Suporte

### Categorias de Despesas (2.x)

- 2.1 Comissão
- 2.2 VPS/Cloud
- 2.3 APIs
- 2.4 Ferramentas
- 2.5 Domínios
- 2.6 Marketing Interno
- 2.7 Contabilidade
- 2.8 Jurídico
- 2.9 Bancos/Taxas
- 2.10 Impostos

## 🏗️ Arquitetura

### Stack Técnico

- **Frontend**: Next.js 15 App Router
- **Linguagem**: TypeScript
- **Estilos**: Tailwind CSS
- **Banco de Dados**: PostgreSQL via Neon
- **ORM**: Prisma
- **Autenticação**: NextAuth.js
- **Validação**: Zod + React Hook Form

### Estrutura de Pastas

```
.
├── app/
│   ├── dashboard/
│   │   ├── leads/            # Módulo de Leads
│   │   ├── comercial/        # Módulo Comercial
│   │   ├── financeiro/       # Módulo Financeiro
│   │   ├── inovacao/         # Módulo Inovação/TI
│   │   └── marketing/        # Módulo Marketing
│   ├── api/                  # Rotas de API (se necessário)
│   ├── layout.tsx
│   └── page.tsx
├── components/               # Componentes React
├── lib/
│   ├── actions.ts            # Server Actions
│   ├── prisma.ts             # Cliente Prisma
│   └── constants.ts          # Constantes
├── prisma/
│   └── schema.prisma         # Schema do banco
└── types/                    # Tipos TypeScript
```

## 💾 Server Actions (Backend)

Todas as operações com banco de dados são feitas via Server Actions em `lib/actions.ts`:

### Leads

- `createLead()` - Criar novo lead
- `getLeads()` - Listar leads com filtros
- `updateLead()` - Atualizar lead
- `deleteLead()` - Deletar lead

### Clientes

- `createClient()` - Criar cliente
- `getClients()` - Listar clientes com filtros
- `updateClient()` - Atualizar cliente

### Contratos

- `createContract()` - Criar contrato
- `getContracts()` - Listar contratos com filtros

### Métricas

- `getDashboardMetrics()` - Métricas gerais do dashboard

## 🎯 Próximos Passos

### Curto Prazo (Semana 1-2)

1. ✅ Implementar autenticação e login
2. ✅ Conexão real com banco Neon
3. ✅ Módulo de Leads completo (CRUD)
4. ✅ Módulo de Clientes completo (CRUD)
5. ✅ Dashboard com métricas

### Médio Prazo (Semana 3-4)

6. Módulo Comercial
   - Pipeline Kanban
   - Gestão de Contratos
   - Previsão de receita (MRR/ARR)

7. Módulo Financeiro
   - DRE Mensal
   - Fluxo de Caixa
   - Receitas e Despesas

8. Timesheet (Inovação/TI)

### Longo Prazo (Semana 5+)

9. Attribution (Marketing)
10. Relatórios avançados
11. Integração com APIs externas
12. Mobile app (React Native)

## 📱 Funcionalidades Chave por Módulo

### Leads
- [x] Listagem com filtros
- [x] Criar novo lead
- [ ] Atualizar status
- [ ] Converter para cliente
- [ ] Histórico de interações
- [ ] Atribuição a responsável

### Comercial
- [ ] Pipeline Kanban
- [ ] Criar contrato
- [ ] Gestão de clientes
- [ ] Previsão de receita
- [ ] MRR/ARR tracking
- [ ] Health score

### Financeiro
- [ ] DRE mensal
- [ ] Fluxo de caixa
- [ ] Registro de receitas
- [ ] Registro de despesas
- [ ] Relatórios por centro de custo
- [ ] Análise de margem

### Inovação/TI
- [ ] Criar projetos
- [ ] Timesheet
- [ ] Alocação de pessoas
- [ ] Margem por projeto
- [ ] Produtividade

### Marketing
- [ ] Criar campanhas
- [ ] Rastrear ROI
- [ ] CPL (Custo por Lead)
- [ ] Attribution
- [ ] CAC/LTV

## 🔐 Segurança

- Autenticação com NextAuth.js
- RBAC (Role-Based Access Control)
- Validação de dados com Zod
- SQL Injection prevention com Prisma
- CSRF protection

## 📞 Suporte

Para dúvidas ou problemas, consulte:
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Neon Documentation](https://neon.tech/docs)

## 📝 Licença

Propriedade da Chronostek
