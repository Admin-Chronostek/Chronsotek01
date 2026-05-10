# ⚡ Comandos Rápidos

## Setup Inicial

```bash
# 1. Navegar até o projeto
cd saas-multitenant

# 2. Instalar dependências
npm install

# 3. Copiar env file
cp .env.example .env.local

# 4. Gerar Prisma e rodar migrações (após configurar Neon)
npm run prisma:generate
npm run prisma:migrate dev --name init

# 5. Iniciar servidor
npm run dev
```

## Desenvolvimento Diário

```bash
# Iniciar dev server (faz rebuild automático)
npm run dev

# Em outro terminal, abrir Prisma Studio
npm run prisma:studio

# Listar tipos TypeScript
npx tsc --noEmit

# Verificar linting
npm run lint
```

## Banco de Dados

```bash
# Generate Prisma client (após mudar schema.prisma)
npm run prisma:generate

# Criar nova migração
npm run prisma:migrate dev --name nome_da_migracao

# Listar todas as migrações
npm run prisma:migrate status

# Resetar banco (⚠️ deleta tudo)
npm run prisma:migrate reset

# Abrir Prisma Studio (GUI do banco)
npm run prisma:studio

# Seed do banco com dados de exemplo
npx prisma db seed
```

## Build e Deploy

```bash
# Build para produção
npm run build

# Iniciar servidor de produção local
npm start

# Analytics do build
npm run build -- --analyze  # se tiver analyzer

# Verificar tamanho dos bundles
npm run build
# Output mostra tamanho de cada rota
```

## Git

```bash
# Status
git status

# Ver branches
git branch -a

# Criar nova branch
git checkout -b feature/nome-da-feature

# Commits
git add .
git commit -m "feat: descrição do que foi feito"

# Push
git push origin feature/nome-da-feature

# Pull Request
# Abra no GitHub/GitLab

# Sync com main
git fetch origin
git rebase origin/main

# Depois de PR mergir
git checkout main
git pull origin main
git branch -d feature/nome-da-feature
```

## Criação de Componentes

```bash
# Novo layout modular (exemplo: novo módulo)
mkdir -p app/dashboard/novo-modulo
touch app/dashboard/novo-modulo/page.tsx
touch app/dashboard/novo-modulo/layout.tsx

# Novo componente
touch components/novo-componente.tsx

# Novo tipo
touch types/novo-tipo.ts

# Nova action
# Edit lib/actions.ts
```

## Debugging

```bash
# Ver logs do servidor
npm run dev | grep -E "error|warn"

# Usar debugger do VS Code
# 1. Adicione breakpoints
# 2. Abra .vscode/launch.json e configure
# 3. F5 para iniciar debug

# Usar DevTools do navegador
# F12 → Console, Network, Performance
```

## Limpeza

```bash
# Limpar cache Next.js
rm -rf .next

# Reinstalar node_modules
rm -rf node_modules
npm install

# Limpar banco SQLite (se usando SQLite)
rm -f dev.db

# Limpar prisma cache
rm -rf .prisma
npm run prisma:generate
```

## Ambiente

```bash
# Ver versão do Node
node --version  # deve ser v18+

# Ver versão do npm
npm --version

# Atualizar npm
npm install -g npm@latest

# Verificar env vars
cat .env.local | grep DATABASE_URL
```

## Docker (se usar PostgreSQL via Docker)

```bash
# Iniciar container
docker run --name postgres-local \
  -e POSTGRES_PASSWORD=senha123 \
  -p 5432:5432 \
  -d postgres:15

# Parar container
docker stop postgres-local

# Remover container
docker rm postgres-local

# Ver logs
docker logs postgres-local
```

## Produção (Vercel + Neon)

```bash
# Editar env vars no Vercel
# Dashboard → Settings → Environment Variables

# Deploy automático
git push origin main  # Faz deploy automático em produção

# Ver logs de deploy
# Vercel Dashboard → Deployments → Latest

# Rollback para deploy anterior
# Vercel Dashboard → Deployments → Clique em deployment
```

## Problemas Comuns

```bash
# "Module not found @prisma/client"
npm run prisma:generate

# "Port 3001 already in use"
# Mac/Linux
lsof -i :3001 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Windows
netstat -ano | findstr :3001
# Anote o PID
taskkill /PID <PID> /F

# "Cannot connect to database"
# Verifique DATABASE_URL em .env.local
# Teste conexão: psql $DATABASE_URL

# "TypeScript errors"
npx tsc --noEmit
# Verifique erros e corrija

# "Build fails"
npm run build
# Veja qual arquivo deu erro
# Corrija e rode novamente
```

## Atalhos úteis

```bash
# Alias para commands frequentes (adicione em ~/.bashrc ou ~/.zshrc)
alias ccrm='cd /workspaces/Chronostek/Chronostek_base/Chronostek_BuffetOS-main/saas-multitenant'
alias dv='npm run dev'
alias ps='npm run prisma:studio'
alias build='npm run build'
alias start='npm start'

# Depois use:
ccrm && dv  # cd para projeto e inicia dev
```

## Checklist de Antes de Commit

```bash
□ npm run lint        # Sem erros
□ npm run build       # Build passa
□ npx tsc --noEmit    # Tipos OK
□ Testes passam
□ Console sem errors
□ Funcionalidade testada
□ Code review ok
```

## Checklist de Antes de Deploy

```bash
□ Tudo em git
□ Versão incrementada (se necessário)
□ Env vars configuradas
□ Database migrada
□ Build local OK
□ Testes passam
□ Seed de dados ok (se for dev)
□ Performance checada
□ Security review
```

---

**Dica**: Crie um arquivo `.bashrc-aliases` no seu home e faça source dele para ter esses commands sempre disponíveis!
