# Yokh Laa — Instructions Codex

App VTC sénégalaise. Stack : React Native + TypeScript + Expo + Zustand + Fastify + Supabase + Prisma.

## Règles absolues
- Commission = 0% (jamais de calcul de commission)
- Prix en FCFA entier uniquement
- Paiements : Wave et Orange Money uniquement
- Auth : OTP SMS uniquement
- SUBSCRIPTION_PRICE = 18500 (constante, ne pas modifier)
- Couleurs depuis constants/theme.ts uniquement
- TypeScript strict — pas de `any`
- Commentaires en français

Codex lira ça automatiquement à chaque session, tu n'as plus besoin de répéter le contexte.

---

**Étape 4 — Premier prompt pour démarrer**

Une fois le projet ouvert dans Codex, envoie ce message :

```text
Initialise la structure du projet Yokh Laa :
1. Crée le dossier mobile/ avec Expo + TypeScript
2. Crée le dossier api/ avec Fastify + TypeScript + Prisma
3. Crée constants/theme.ts avec les couleurs définies dans le README
4. Crée types/index.ts avec les interfaces IUser, IDriver, IRide, ISubscription
```
