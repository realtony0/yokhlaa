# YokhLaa

Application VTC sénégalaise — 0% commission — Dakar 2026.

## Stack
- Mobile : React Native + TypeScript + Expo SDK 50
- State : Zustand
- Backend : Node.js 20 + Fastify v4 + TypeScript
- Auth : Supabase Auth (OTP SMS)
- DB : PostgreSQL via Supabase + Prisma ORM
- Paiements : Wave API + Orange Money API

## Règles métier absolues
- COMMISSION = 0% — jamais de calcul de commission
- SUBSCRIPTION_PRICE = 18500 FCFA — constante, ne pas modifier
- Prix toujours en entiers FCFA — jamais de Float
- Paiements : Wave et Orange Money uniquement
- Auth : OTP SMS sur numéro +221 uniquement
