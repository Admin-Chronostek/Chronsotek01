# Configuração do Neon PostgreSQL

## 1. Criar Conta e Projeto no Neon

1. Acesse [neon.tech](https://neon.tech)
2. Crie uma conta (use email corporativo)
3. Crie um novo projeto
4. Escolha região mais próxima (ex: São Paulo)
5. Nome do projeto: `chronostek-crm-prod`

## 2. Obter Connection String

1. Após criar o projeto, clique em "Connect"
2. Selecione "Prisma" como Driver
3. Copie a URL de conexão em formato:
   ```
   postgresql://user:password@host/database?sslmode=require
   ```

## 3. Configurar Variáveis de Ambiente

Edite `.env.local`:

```env
# Database
DATABASE_URL="postgresql://seu_user:sua_senha@seu_host/seu_banco?sslmode=require"

# NextAuth
NEXTAUTH_SECRET="gere-com-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3001"

# Public URL
NEXT_PUBLIC_APP_URL="http://localhost:3001"
```

### Para gerar NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

## 4. Executar Migrações

```bash
npm run prisma:generate
npm run prisma:migrate dev --name init
```

## 5. Verificar Conexão

```bash
npm run prisma:studio
```

Isso abrirá o Prisma Studio em http://localhost:5555 onde você pode visualizar o banco.

## 6. Variáveis de Ambiente para Produção

Em produção, configure as mesmas variáveis:
- `.env.production.local`
- Ou via painel da plataforma de deploy (Vercel, Railway, etc)

## Troubleshooting

### "SSL Error" ou "Connection refused"

```bash
# Tente atualizar a dependência
npm install @prisma/client@latest
npm run prisma:generate
```

### "User already exists"

Se receber erro ao migrar:
```bash
# Resete o banco (cuidado em produção!)
npm run prisma:migrate reset
```

### Conexão lenta

Aumentar o pool de conexões em `.env.local`:
```env
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require&max_connections=10"
```

## Links Úteis

- [Neon Documentation](https://neon.tech/docs)
- [Prisma + Neon Guide](https://neon.tech/docs/guides/prisma)
- [Connection Pooling](https://neon.tech/docs/reference/connection-pooling)
