# Yokh Laa — Instructions Codex

App VTC sénégalaise (Dakar). Stack : React Native + TypeScript + Expo + Zustand + TanStack Query + Fastify + Supabase + Prisma.

## Règles métier absolues
- COMMISSION = 0% — jamais de calcul de commission
- SUBSCRIPTION_PRICE = 18500 FCFA — entier, constante, ne pas modifier
- Prix FCFA entiers uniquement — jamais Float
- Paiements : wave et orange_money uniquement
- Auth : OTP SMS +221 uniquement — pas de mot de passe

## Conventions
- Composants : PascalCase → DriverCard.tsx
- Hooks : préfixe use → useRideStore.ts
- Services : suffixe .service → ride.service.ts
- TypeScript strict — pas de any
- Commentaires en français
- Couleurs depuis constants/theme.ts uniquement
