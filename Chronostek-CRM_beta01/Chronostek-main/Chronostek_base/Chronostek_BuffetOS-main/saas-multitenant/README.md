# Chronostek CRM

Sistema integrado de CRM, Financeiro e Gestão Comercial desenvolvido com Next.js 15, TypeScript, Tailwind CSS e PostgreSQL (Neon).

## 🎯 Sobre

Plataforma completa para gestão de:

- **📊 Leads**: Rastreamento de origem, probabilidade, status e conversão
- **💼 Comercial**: Pipeline, contratos, clientes, previsão de receita (MRR/ARR)
- **💰 Financeiro**: DRE mensal, fluxo de caixa, receitas, despesas, análise por centro de custo
- **🚀 Inovação/TI**: Projetos, timesheet, alocação de recursos, margem por projeto
- **📣 Marketing**: Campanhas, ROI, attribution, CAC/LTV

## ⚡ Quick Start

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env.local
# Editar .env.local com credenciais do Neon

# 3. Configurar banco de dados
npm run prisma:generate
npm run prisma:migrate

# 4. Iniciar servidor de desenvolvimento
npm run dev
```

Acesse `http://localhost:3001`

## 📚 Documentação Completa

Veja [SETUP.md](./SETUP.md) para instruções detalhadas de instalação, configuração e uso.

## 🏗️ Stack Técnico

- **Frontend**: Next.js 15 (App Router)
- **Linguagem**: TypeScript
- **Estilos**: Tailwind CSS + shadcn/ui
- **Banco de Dados**: PostgreSQL via Neon
- **ORM**: Prisma
- **Autenticação**: NextAuth.js (estrutura preparada)
- **Validação**: Zod + React Hook Form
- **Servidor de Aplicação**: Node.js com Server Actions

## 📦 Estrutura do Projeto

```
saas-multitenant/
├── app/
│   ├── dashboard/
│   │   ├── leads/              # Módulo de Leads
│   │   ├── comercial/          # Módulo Comercial
│   │   ├── financeiro/         # Módulo Financeiro
│   │   ├── inovacao/           # Módulo Inovação/TI
│   │   └── marketing/          # Módulo Marketing
│   ├── layout.tsx              # Layout raiz
│   ├── page.tsx                # Home page
│   └── globals.css             # Estilos globais
├── components/
│   └── dashboard-layout.tsx    # Layout compartilhado
├── lib/
│   ├── actions.ts              # Server Actions (backend)
│   ├── prisma.ts               # Cliente Prisma
│   └── constants.ts            # Constantes e enums
├── prisma/
│   └── schema.prisma           # Schema do banco de dados
├── types/
│   └── index.ts                # Tipos TypeScript
└── public/                     # Arquivos estáticos
```

## 🗄️ Estrutura de Dados

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

## 🎨 Módulos

### Leads ✅ (Em progresso)

- Criar, editar e deletar leads
- Rastreamento de origem (Google Ads, Instagram, LinkedIn, Instagram, Cold Call, etc)
- Status (Novo, Contatado, Qualificado, Proposta, Perdido, Convertido)
- Probabilidade de conversão
- Orçamento estimado
- Filtros e busca
- Atribuição a responsável

### Comercial 🔄 (Estrutura pronta)

- Pipeline Kanban
- Gestão de contratos
- Gestão de clientes
- Previsão de receita
- MRR/ARR tracking
- Health score do cliente

### Financeiro 🔄 (Estrutura pronta)

- DRE mensal
- Fluxo de caixa
- Registro de receitas (por categoria)
- Registro de despesas (por centro de custo)
- Competência financeira
- Análise de margem

### Inovação/TI 🔄 (Estrutura pronta)

- Gestão de projetos
- Timesheet por pessoa
- Alocação de recursos
- Margem por projeto
- Análise de produtividade

### Marketing 🔄 (Estrutura pronta)

- Cadastro de campanhas
- ROI por campanha
- Attribution de leads
- CAC (Customer Acquisition Cost)
- LTV (Lifetime Value)

## 🔧 Comandos

```bash
# Desenvolvimento
npm run dev              # Inicia servidor em localhost:3001

# Build e produção
npm run build            # Build para produção
npm start                # Inicia servidor de produção

# Prisma
npm run prisma:generate  # Gera cliente Prisma
npm run prisma:migrate   # Executa migrações
npm run prisma:studio    # Abre Prisma Studio

# Linting
npm run lint             # Executa linter
```

## 🚀 Roadmap

### Fase 1 - MVP (Semana 1-2)
- [x] Estrutura base do projeto
- [x] Schema do banco de dados
- [x] Layout e navegação
- [ ] Autenticação e permissões
- [ ] Módulo de Leads completo

### Fase 2 - Financeiro (Semana 3-4)
- [ ] Módulo Comercial (Pipeline + Contratos)
- [ ] Módulo Financeiro (DRE + Fluxo de Caixa)
- [ ] Dashboard com métricas

### Fase 3 - Operacional (Semana 5-6)
- [ ] Módulo Inovação/TI (Projetos + Timesheet)
- [ ] Relatórios avançados
- [ ] Exportação de dados

### Fase 4 - Marketing (Semana 7+)
- [ ] Módulo Marketing (Campanhas + Attribution)
- [ ] Integrações externas
- [ ] Mobile app

## 🔐 Segurança

- Autenticação via NextAuth.js
- RBAC (Role-Based Access Control)
- Validação de dados com Zod
- SQL Injection prevention via Prisma
- CSRF protection
- Isolamento de dados por tenant

## 📱 Próximos Passos

1. Configurar banco de dados Neon com schema
2. Implementar autenticação
3. Completar módulo de Leads com CRUD
4. Adicionar integração com campanhas de marketing
5. Implementar dashboard com métricas em tempo real

## 📞 Suporte

Para dúvidas ou problemas:
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Neon PostgreSQL Docs](https://neon.tech/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## 📄 Licença

© 2024 Chronostek. Todos os direitos reservados.
    │   ├── components/         # Componentes reutilizáveis
    │   ├── dashboard/          # Dashboard principal
    │   ├── leads/              # Módulo de leads
    │   ├── login/              # Autenticação
    │   ├── register/
    │   ├── layout.jsx
    │   ├── page.jsx
    │   └── globals.css
    │
    ├── backend/                # API (Express)
    │   ├── config/             # Configuração (DB, etc)
    │   ├── controllers/        # Regras de negócio
    │   ├── database/           # Scripts SQL
    │   ├── middlewares/        # Middlewares (tenant, auth)
    │   ├── models/             # Acesso a dados
    │   ├── routes/             # Rotas da API
    │   ├── services/           # Camada de serviço
    │   └── app.js              # Entry point do servidor
    │
    ├── .env
    ├── package.json
    └── README.md
Módulo de Leads

O módulo de leads concentra a maior parte da funcionalidade atual do sistema:

Overview: visão geral com métricas e distribuição de leads
Acquisition: análise de origem e conversão
Pipeline: gerenciamento visual do funil (Kanban)
Performance: acompanhamento de desempenho da equipe
Reports: geração de relatórios
Multitenancy

O isolamento de dados é feito por tenant utilizando middleware no backend.

Fluxo:

O usuário realiza login
O tenant_id é associado à sessão (cookie)
As requisições incluem o identificador do tenant
O backend filtra todas as operações com base nesse identificador

Middleware responsável: tenantContext.js

Execução local
Pré-requisitos
Node.js 18+
PostgreSQL (ou instância no Supabase)
Configuração

Criar arquivo .env na raiz do projeto:

DATABASE_URL=postgresql://postgres:[SENHA]@db.[PROJETO].supabase.co:5432/postgres
JWT_SECRET=sua_chave_secreta
PORT=3000
Banco de dados

Executar o script:

backend/database/leads_table.sql
Backend
cd saas-multitenant
node backend/app.js

Disponível em: http://localhost:3000

Frontend
cd saas-multitenant
npm run dev -- -p 3001

Disponível em: http://localhost:3001

Deploy

A aplicação está preparada para separação de serviços:

Frontend: Vercel
Backend: Render
Banco: Supabase
Variáveis de ambiente relevantes
DATABASE_URL
JWT_SECRET
FRONTEND_URL
CORS_ORIGIN
Roadmap
Módulo de contratos
Módulo financeiro
Controle de permissões (RBAC)
Integrações externas (webhooks)
Integração com canais de comunicação