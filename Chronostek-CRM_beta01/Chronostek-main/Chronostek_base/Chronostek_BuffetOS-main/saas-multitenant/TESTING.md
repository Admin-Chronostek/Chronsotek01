# Guia de Testes Locais

## 1. Configuração Inicial

```bash
# Clone ou navegue até o projeto
cd /workspaces/Chronostek/Chronostek_base/Chronostek_BuffetOS-main/saas-multitenant

# Instale as dependências
npm install

# Configure o arquivo .env.local
cp .env.example .env.local
```

## 2. Banco de Dados Local (Alternativa ao Neon)

### Opção A: Usar SQLite (mais rápido para testes)

Edite `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

Edite `.env.local`:

```env
DATABASE_URL="file:./dev.db"
```

Depois execute:

```bash
npm run prisma:generate
npm run prisma:migrate dev --name init
```

### Opção B: PostgreSQL Local

Instale PostgreSQL local ou use Docker:

```bash
docker run --name postgres-local \
  -e POSTGRES_PASSWORD=senha123 \
  -p 5432:5432 \
  -d postgres:15
```

Edite `.env.local`:

```env
DATABASE_URL="postgresql://postgres:senha123@localhost:5432/chronostek_dev"
```

Execute as migrações:

```bash
npm run prisma:generate
npm run prisma:migrate dev --name init
```

## 3. Iniciar Servidor de Desenvolvimento

```bash
npm run dev
```

Acesse: `http://localhost:3001`

## 4. Visualizar Dados Com Prisma Studio

Em outro terminal:

```bash
npm run prisma:studio
```

Acesse: `http://localhost:5555`

## 5. Testes Manuais

### Teste 1: Página Home
- [ ] Acesse `http://localhost:3001`
- [ ] Verifique se todos os 5 módulos aparecem
- [ ] Clique em cada módulo e verifique a navegação

### Teste 2: Módulo Leads
- [ ] Acesse `http://localhost:3001/dashboard/leads`
- [ ] Verifique os KPI cards (mostrando dados de exemplo)
- [ ] Clique nos filtros de status
- [ ] Verifique a tabela com dados de exemplo

### Teste 3: Outros Módulos
- [ ] Visite cada módulo
- [ ] Confirme que a estrutura está ok
- [ ] Verifique sidebar ativa

### Teste 4: Responsividade
- [ ] Abra DevTools (F12)
- [ ] Teste em mobile (375px)
- [ ] Teste em tablet (768px)
- [ ] Teste em desktop (1920px)

## 6. Teste de Build

```bash
# Build para produção
npm run build

# Inicie produção local
npm start
```

Deve compilar sem erros.

## 7. Teste de Tipos TypeScript

```bash
# Se tiver TypeScript CLI
npx tsc --noEmit

# Ou verifique os erros no VS Code
```

## 8. Teste de Linting

```bash
npm run lint
```

## 9. Teste com Dados de Exemplo

Para Popular o banco com dados de exemplo, crie um arquivo `prisma/seed.ts`:

```typescript
import { prisma } from '@/lib/prisma'

async function main() {
  // Criar empresa
  const company = await prisma.company.create({
    data: {
      name: 'Empresa Teste',
      slug: 'empresa-teste',
      email: 'contato@empresa.com',
    },
  })

  // Criar usuário
  const user = await prisma.user.create({
    data: {
      email: 'admin@empresa.com',
      name: 'Admin User',
      password: 'hashed_password_here',
      roleId: '1',
      companyId: company.id,
    },
  })

  // Criar leads de exemplo
  await prisma.lead.createMany({
    data: [
      {
        title: 'João Silva',
        email: 'joao@example.com',
        source: 'GOOGLE_ADS',
        status: 'NEW',
        probability: 30,
        companyId: company.id,
        createdById: user.id,
      },
      // ... mais leads
    ],
  })

  console.log('Seed completado!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

Depois:

```bash
npx prisma db seed
```

## 10. Troubleshooting

### Erro: "Cannot find module '@prisma/client'"

```bash
npm run prisma:generate
npm install
```

### Erro: "Port 3001 already in use"

```bash
# Linux/Mac
lsof -i :3001
kill -9 <PID>

# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### Erro: "SQLite database file not found"

```bash
# Criar arquivo vazio
touch dev.db
```

### Erro: "PostgreSQL connection refused"

- Verifique se PostgreSQL está rodando
- Teste conexão: `psql -U postgres -d chronostek_dev`
- Verifique credenciais em `.env.local`

## 11. Teste de Performance

```bash
# Verificar build size
npm run build

# Saída deve mostrar o tamanho dos arquivos gerados
# Route (kind)                    Size     First Load JS
# ┌ ○ /                           3.8 kB   97.8 kB
# ├ ○ /dashboard/leads           ...
```

## 12. Checklist de Testes

- [ ] Home page carrega
- [ ] Módulos navegáveis
- [ ] Sidebar funciona
- [ ] Tabela de leads aparece
- [ ] Filtros funcionam
- [ ] Build sem erros
- [ ] Responsive OK
- [ ] Prisma Studio conecta ao DB
- [ ] Types sem erros (tsc)
- [ ] Lint passa

## 💡 Dicas

- Use DevTools do navegador para inspecionar elementos
- Abra o Network tab para ver chamadas de API
- Use Prisma Studio para ver dados do banco visualmente
- Faça commits antes de fazer mudanças grandes
- Teste em incógnito para limpar cache

## 🔗 URLs Úteis Durante Testes

- App: http://localhost:3001
- Prisma Studio: http://localhost:5555
- Dev Tools: F12
- Next.js Docs: https://nextjs.org/docs
