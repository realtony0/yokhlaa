# YokhLaa — README Codex

> **À coller à la racine du repo. Codex / Cursor lit ce fichier pour comprendre le projet.**

---

## C'est quoi Yokh Laa ?

Application mobile VTC (iOS + Android) pour Dakar, Sénégal.  
Modèle économique : les chauffeurs paient **18 500 FCFA/mois** d'abonnement fixe et gardent **100% de leurs revenus de courses**. Zéro commission.

---

## Stack

| Couche | Techno |
|--------|--------|
| Mobile | React Native 0.73 · TypeScript · Expo SDK 50 |
| State | Zustand |
| Requêtes | TanStack Query v5 + Axios |
| Carte | React Native Maps + Google Maps SDK |
| Temps réel | Supabase Realtime (WebSocket) |
| Backend | Node.js 20 · Fastify v4 · TypeScript |
| Auth | Supabase Auth — OTP SMS téléphone |
| DB | PostgreSQL 15 via Supabase · ORM Prisma |
| Cache | Redis (Upstash) |
| Push | Expo Notifications (FCM + APNs) |
| Paiements | Wave API + Orange Money API |
| Déploiement | Railway (API) · Supabase cloud · Expo EAS |

---

## Règles métier — NE JAMAIS VIOLER

```
COMMISSION = 0%          // jamais de calcul de commission
SUBSCRIPTION_PRICE = 18500  // FCFA, entier, ne pas modifier
CURRENCY = FCFA          // jamais euros/dollars
PRICES = integers only   // jamais de Float pour les prix
PAYMENT_METHODS = ['wave', 'orange_money']  // uniquement
AUTH_METHOD = OTP_SMS    // pas de mot de passe, pas d'email
```

---

## Structure du repo

```
yokhlaa/
├── mobile/          # App React Native
│   ├── app/         # Screens (React Navigation)
│   ├── components/  # UI réutilisable
│   ├── store/       # Zustand stores
│   ├── services/    # Appels API
│   ├── hooks/       # Custom hooks
│   └── constants/   # theme.ts, config
├── api/             # Backend Fastify
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── schemas/  # Zod
│   │   └── lib/      # supabase, prisma, redis
│   └── prisma/
└── README.md        # ce fichier
```

---

## Conventions de nommage

| Type | Convention | Exemple |
|------|-----------|---------|
| Composant | PascalCase | `DriverCard.tsx` |
| Hook | `use` + camelCase | `useRideStore.ts` |
| Service | camelCase + `.service` | `ride.service.ts` |
| Store | camelCase + `.store` | `auth.store.ts` |
| Interface | `I` + PascalCase | `IDriver`, `IRide` |
| Constante | SCREAMING_SNAKE | `SUBSCRIPTION_PRICE` |
| Commentaires | Français |  |

---

## Couleurs — importer depuis `constants/theme.ts`

```ts
import { colors } from '@/constants/theme';

// Jamais de valeur hardcodée dans les composants
// ✓ colors.green
// ✗ '#22C55E'
```

```ts
export const colors = {
  green:      '#22C55E',
  greenDark:  '#16A34A',
  greenLight: 'rgba(34,197,94,0.1)',
  black:      '#080A0D',
  ink:        '#0C0E12',
  surface:    '#141618',
  card:       '#1A1C20',
  white:      '#F5F6F7',
  dim:        '#8A9099',
  dim2:       '#4A5160',
  red:        '#EF4444',
  border:     'rgba(255,255,255,0.07)',
} as const;
```

---

## Prompt Codex — à copier-coller au début de chaque session

```
Tu travailles sur Yokh Laa, une app VTC sénégalaise (Dakar).
Stack : React Native + TypeScript + Expo + Zustand + TanStack Query + Fastify + Supabase + Prisma.

Règles métier absolues :
- Commission = 0% sur chaque course (ne jamais calculer de commission)
- Prix en FCFA entier uniquement (jamais Float, jamais de décimales)
- Paiements : Wave et Orange Money uniquement
- Auth : OTP SMS sur numéro sénégalais (+221XXXXXXXXX) — pas de mot de passe
- SUBSCRIPTION_PRICE = 18500 (constante, ne pas modifier)

Conventions :
- Composants PascalCase, hooks avec préfixe `use`
- Couleurs depuis constants/theme.ts uniquement
- TypeScript strict — pas de `any`
- Commentaires en français
- Toujours valider les inputs avec Zod côté API

Contexte actuel du projet : MVP v1.0 en cours.
Tâche : [DÉCRIRE LA FEATURE ICI]
```

---

## Commandes

```bash
# Mobile
cd mobile
npx expo start           # dev
npx expo run:ios         # simulateur iOS
npx expo run:android     # simulateur Android

# API
cd api
npm run dev              # dev avec hot reload
npm run db:migrate       # appliquer migrations Prisma
npm run db:studio        # Prisma Studio (UI DB)
npm run generate         # générer types Prisma

# Tests
npm run test             # Jest
npm run lint             # ESLint
```

---

## Variables d'environnement

```bash
# api/.env
DATABASE_URL=postgresql://...       # Supabase connection string
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
REDIS_URL=rediss://...              # Upstash Redis
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE=+1...
WAVE_API_KEY=...
ORANGE_MONEY_API_KEY=...
JWT_SECRET=...

# mobile/.env
EXPO_PUBLIC_API_URL=https://api.yokhlaa.sn
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
EXPO_PUBLIC_GOOGLE_MAPS_KEY=...
```

---

## Modèles de données clés

```ts
// Types partagés — types/index.ts
interface IUser {
  id: string;
  phone: string;       // +221XXXXXXXXX
  name: string;
  role: 'PASSENGER' | 'DRIVER' | 'ADMIN';
}

interface IDriver extends IUser {
  licenseNumber: string;
  vehicleType: string;
  vehiclePlate: string;
  isOnline: boolean;
  isVerified: boolean;
  rating: number;
  currentLat?: number;
  currentLng?: number;
  subscription?: ISubscription;
}

interface IRide {
  id: string;
  passengerId: string;
  driverId?: string;
  status: 'SEARCHING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  pickupLat: number;
  pickupLng: number;
  pickupAddress: string;
  dropLat: number;
  dropLng: number;
  dropAddress: string;
  priceEstimate: number;  // FCFA — entier
  priceFinal?: number;    // FCFA — entier
}

interface ISubscription {
  id: string;
  driverId: string;
  status: 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  startDate: string;
  endDate: string;
  amount: 18500;          // toujours 18500 FCFA
  paymentMethod?: 'wave' | 'orange_money';
}
```

---

## Flux principaux

### Flux course (passager → chauffeur)
```
Passager saisit destination
  → API POST /rides (crée ride SEARCHING)
  → Supabase Realtime notifie chauffeurs proches
  → Chauffeur voit la demande
  → API POST /rides/:id/accept (ride → ACCEPTED)
  → Chauffeur arrive → POST /rides/:id/start (IN_PROGRESS)
  → Course terminée → POST /rides/:id/complete (COMPLETED)
  → Passager note le chauffeur → POST /rides/:id/rate
```

### Flux abonnement chauffeur
```
Chauffeur vérifie statut → GET /subscriptions/status
  → Initie paiement Wave/OM → POST /subscriptions/pay
  → Reçoit référence de paiement
  → Confirme après validation → POST /subscriptions/confirm
  → Statut passe à ACTIVE
  → Chauffeur peut se mettre online
```

---

*YokhLaa · Dakar · 2026 · Mamadou Dieng Ba*
