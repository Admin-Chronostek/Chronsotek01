# 🚀 INSTRUÇÕES DE SETUP COMPLETO - CRONOS TEK CRM

## Passo 1: Navegar para o diretório do projeto

```bash
cd /workspaces/Chronostek/Chronostek_base/Chronostek_BuffetOS-main/saas-multitenant
```

## Passo 2: Verificar arquivo .env.local

```bash
cat .env.local
```

**Esperado:**
```
DATABASE_URL="postgresql://neondb_owner:npg_co6HLdDk4nxV@..."
NEXTAUTH_SECRET="3kX9pL7mN2vH8qR5wT1jU4fB6dZ0yC8aS2eJ9xK3vM5tN1wP7sL2kH4jR6dV8"
NEXTAUTH_URL="http://localhost:3001"
NEXT_PUBLIC_APP_URL="http://localhost:3001"
```

## Passo 3: Instalar dependências

```bash
npm install --legacy-peer-deps
```

**Tempo esperado**: 2-5 minutos  
**Esperado**: Nenhum erro (warnings ok)

## Passo 4: Gerar cliente Prisma

```bash
npx prisma generate
```

**Esperado**: `✔ Generated Prisma Client`

## Passo 5: Executar migrações no banco

```bash
npx prisma migrate deploy
```

**Esperado**: 
```
Applying migration `20240510_init`

The following migration(s) have been applied:

migrations/
  └─ 20240510_init/
    └─ migration.sql

5 migrations applied.
```

## Passo 6: Verificar status das migrações

```bash
npx prisma migrate status
```

**Esperado**: Todas as migrações marcadas como `Applied`

## Passo 7: Testar conexão com Prisma Studio

```bash
npm run prisma:studio
```

**Esperado**: 
- Abre em `http://localhost:5555`
- Mostra as 14 tabelas criadas
- Sem erros de conexão

## Passo 8: Iniciar servidor de desenvolvimento

Em outro terminal:

```bash
npm run dev
```

**Esperado**:
```
  ▲ Next.js 15.0.0
  - Local:        http://localhost:3001
  - Environments: .env.local
  ✓ Ready in 2.5s
```

## Passo 9: Acessar a aplicação

Abra no navegador:
```
http://localhost:3001
```

**Esperado**: 
- Landing page com 5 módulos (Leads, Comercial, Financeiro, Inovação, Marketing)
- Cards com gradientes azuis
- Botões funcionais para cada módulo

## Passo 10: Testar módulo Leads

Clique em "Leads" → Você deve ver:
- 4 KPI cards
- Filtros por status
- Tabela com 1 lead de exemplo
- Sem erros no console

---

## ✅ Se tudo funcionar

Significa que:
- ✅ Conexão com Neon PostgreSQL está ok
- ✅ Prisma migrations executadas com sucesso
- ✅ Banco de dados criado com 14 tabelas
- ✅ Next.js servidor rodando normalmente
- ✅ Sistema pronto para próximas fases

## 🆘 Se algo der errado

### Erro: "Cannot find module '@prisma/client'"
```bash
npm run prisma:generate
npm install
```

### Erro: "Connection refused" / "Database connection error"
```bash
# Verificar conexão
psql "postgresql://neondb_owner:npg_co6HLdDk4nxV@ep-calm-cherry-aqyucdif-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require"

# Se não tiver psql instalado, use:
curl -s "postgresql://neondb_owner:npg_co6HLdDk4nxV@ep-calm-cherry-aqyucdif-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

### Erro: "Port 3001 already in use"
```bash
# Kill process na porta 3001
lsof -i :3001 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### Erro: "Unexpected token in migration"
```bash
# Resetar e tentar de novo (⚠️ deleta dados!)
npx prisma migrate reset
```

---

## 📊 Checklist Final

- [ ] .env.local configurado com Neon URL
- [ ] npm install completado sem erros
- [ ] npx prisma generate ok
- [ ] npx prisma migrate deploy ok
- [ ] Prisma Studio conecta ao banco
- [ ] npm run dev rodando em :3001
- [ ] Homepage acessível
- [ ] Módulo Leads funciona
- [ ] Console sem erros
- [ ] Sistema pronto para desenvolvimento

---

## 🎯 Próximos passos após setup bem-sucedido

1. **Autenticação** (NextAuth.js)
   - [ ] Login page
   - [ ] Register page
   - [ ] Protected routes

2. **Leads CRUD Completo**
   - [ ] Create lead form
   - [ ] Edit functionality
   - [ ] Delete com confirmação
   - [ ] Convert to client

3. **Dashboard com Métricas**
   - [ ] Gráficos em tempo real
   - [ ] KPIs dinâmicos
   - [ ] Comparação de períodos

4. **Outros módulos**
   - [ ] Comercial
   - [ ] Financeiro
   - [ ] Inovação/TI
   - [ ] Marketing

---

**Tempo total esperado**: 15-20 minutos  
**Resultado**: Sistema completo e pronto para desenvolvimento 🚀
