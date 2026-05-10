# 🔥 COMANDOS RÁPIDOS - COPIAR E COLAR

## 1️⃣ SETUP INICIAL (Primeira vez)

```bash
cd /workspaces/Chronostek/Chronostek_base/Chronostek_BuffetOS-main/saas-multitenant

npm install --legacy-peer-deps
npx prisma generate
npx prisma migrate deploy
npm run dev
```

**Tempo**: 5 minutos  
**Resultado**: App rodando em http://localhost:3001

---

## 2️⃣ DESENVOLVIMENTO DIÁRIO

```bash
# Terminal 1: Aplicação
npm run dev

# Terminal 2: Prisma Studio (opcional)
npm run prisma:studio
```

**Resultado**: 
- App: http://localhost:3001
- Prisma Studio: http://localhost:5555

---

## 3️⃣ LINTING & FORMATAÇÃO

```bash
# Verificar erros
npm run lint

# Formatar código
npm run format
```

---

## 4️⃣ BUILD & PRODUÇÃO

```bash
# Build para produção
npm run build

# Iniciar production build
npm start
```

---

## 5️⃣ DATABASE

```bash
# Criar migrations
npx prisma migrate dev --name seu_nome_aqui

# Resetar banco (⚠️ deleta dados!)
npx prisma migrate reset

# Abrir Prisma Studio
npx prisma studio

# Visualizar schema
npx prisma db pull
```

---

## 6️⃣ GERAR TIPOS (Se mudar schema)

```bash
npx prisma generate
```

---

## 7️⃣ TROUBLESHOOTING

```bash
# Limpar node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Validar schema Prisma
npx prisma validate

# Checar status de migrations
npx prisma migrate status
```

---

## 8️⃣ TESTES

```bash
# Rodar testes (quando implementados)
npm test

# Rodar testes em watch mode
npm test -- --watch
```

---

## 9️⃣ DEPLOYMENT (Vercel)

```bash
# Login no Vercel
npm i -g vercel
vercel login

# Deploy
vercel

# Deploy em produção
vercel --prod
```

---

## 🔟 GIT WORKFLOW

```bash
# Status
git status

# Adicionar arquivos
git add .

# Commit
git commit -m "feat: descrição breve"

# Push
git push origin seu_branch

# Criar branch
git checkout -b feature/nome-da-feature
```

---

## 📋 SCRIPTS DISPONÍVEIS

```json
{
  "dev": "next dev -p 3001",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "format": "prettier --write .",
  "type-check": "tsc --noEmit",
  "prisma:generate": "prisma generate",
  "prisma:studio": "prisma studio",
  "prisma:seed": "node prisma/seed.js"
}
```

---

## 🎯 PRIMEIRA VEZ? COPIE ISTO:

```bash
# 1. Navegar
cd /workspaces/Chronostek/Chronostek_base/Chronostek_BuffetOS-main/saas-multitenant

# 2. Instalar dependências (pode levar 2-3 min)
npm install --legacy-peer-deps

# 3. Gerar tipos Prisma
npx prisma generate

# 4. Criar tabelas no banco
npx prisma migrate deploy

# 5. Iniciar aplicação
npm run dev

# 6. Abrir navegador em: http://localhost:3001
# 7. Pronto! 🎉
```

---

## ✅ COMO VERIFICAR SE FUNCIONOU?

```bash
# 1. Terminal deve mostrar:
# ✓ Ready in X.XXs
# ✓ URL: http://localhost:3001

# 2. Browser deve mostrar:
# - Landing page com 5 módulos
# - Sidebar com navegação
# - Leads module com dados de exemplo

# 3. Abrir Prisma Studio:
npm run prisma:studio

# 4. No Prisma Studio:
# - Deve mostrar 14 tabelas
# - Leadsiever tabel deve ter dados
```

---

## 🐛 ERROS COMUNS & SOLUÇÕES

### ❌ "Module not found"
```bash
npm install --legacy-peer-deps
npx prisma generate
```

### ❌ "Database connection error"
Verificar .env.local tem DATABASE_URL

### ❌ "Port 3001 already in use"
```bash
# Kill processo na porta 3001
lsof -ti:3001 | xargs kill -9

# Ou usar outra porta
npm run dev -- -p 3002
```

### ❌ "Permission denied"
```bash
# Liberar permissões
chmod +x setup.sh
./setup.sh
```

---

## 📚 DOCUMENTAÇÃO RÁPIDA

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Iniciar dev server |
| `npm run build` | Build para produção |
| `npm run lint` | Verificar erros lint |
| `npm test` | Rodar testes |
| `npm run prisma:studio` | Abrir Prisma Studio |
| `npx prisma migrate dev --name X` | Criar migration |

---

## 🚀 PIPELINE TÍPICO DO DESENVOLVIMENTO

```
1. npm run dev                  # Inicia servidor
2. Fazer alterações no código   # Edit files
3. Browser auto-reload          # Vê mudanças
4. npm run lint                 # Verifica erros
5. git add . && git commit      # Commit
6. git push                     # Push
7. Vercel auto-deploys          # Deploy automático
```

---

## 💡 DICAS PRO

- Use `npm run prisma:studio` para verificar dados em tempo real
- Watchmode automático no dev (não precisa reiniciar)
- TypeScript valida em tempo real (sem runtime errors)
- Server Actions são type-safe end-to-end

---

## 🎓 REFERÊNCIA COMPLETA

- Setup detalhado: [SETUP.md](./SETUP.md)
- Banco de dados: [NEON_SETUP.md](./NEON_SETUP.md)
- Exemplos código: [EXAMPLES.md](./EXAMPLES.md)
- Todos os arquivos: [INDEX.md](./INDEX.md)

---

**Última atualização**: 10 de Maio de 2026  
**Status**: ✅ Pronto para usar

**Ficou com dúvida? Vá para [INDEX.md](./INDEX.md) → [START_HERE.md](./START_HERE.md)**
