#!/bin/bash

echo "🚀 CHRONOSTEK CRM - SETUP COMPLETO"
echo "=================================="
echo ""

# 1. Navegar para o diretório
cd /workspaces/Chronostek/Chronostek_base/Chronostek_BuffetOS-main/saas-multitenant

echo "📦 [1/6] Instalando dependências..."
npm install --legacy-peer-deps 2>&1 | tail -20

echo ""
echo "🔧 [2/6] Gerando cliente Prisma..."
npx prisma generate 2>&1 | tail -10

echo ""
echo "🗄️  [3/6] Criando migrações do banco..."
npx prisma migrate deploy 2>&1 | tail -20

echo ""
echo "📊 [4/6] Status das migrações..."
npx prisma migrate status 2>&1

echo ""
echo "✅ SETUP COMPLETO!"
echo ""
echo "📋 Próximos passos:"
echo "   1. npm run dev              → Iniciar servidor"
echo "   2. http://localhost:3001    → Acessar aplicação"
echo "   3. npm run prisma:studio    → Abrir Prisma Studio (DB GUI)"
echo ""
