# Yokh Laa — Backlog Technique MVP v1.0

Source: CDC technique (mars 2026).  
Objectif: transformer le CDC en tickets exécutables, testables et ordonnés par sprint.

## Règles métier non négociables (gates globaux)
- `COMMISSION = 0%` sur toutes les courses, sans exception.
- `SUBSCRIPTION_PRICE = 18500` FCFA, constante, entier.
- Tous les montants sont en FCFA `Int` (jamais de `Float` pour les prix/paiements).
- Méthodes de paiement autorisées: `wave`, `orange_money` uniquement.
- Authentification: OTP SMS uniquement (pas email/mot de passe).
- Mobile: couleurs uniquement depuis `constants/theme.ts` (pas de hardcode).
- Code: TypeScript strict, pas de `any`.

## Définition de “Done” (DoD) pour chaque ticket
- Code mergé localement, compile sans erreur TypeScript.
- Validation d’inputs côté API (Zod) si endpoint créé/modifié.
- Tests minimaux ajoutés/ajustés (unitaire ou intégration selon le ticket).
- Logs structurés utiles (succès/erreur) sur les flux critiques.
- Règles métier ci-dessus explicitement respectées.

## Légende
- Priorité: `P0` (critique), `P1` (haute), `P2` (moyenne)
- Taille: `S` (<= 0.5j), `M` (1-2j), `L` (2-4j)
- Types: `API`, `MOBILE`, `DATA`, `INFRA`, `QA`

## Sprint S1 (Semaines 1-2) — Fondations + Auth OTP + Profils

| ID | Type | Priorité | Taille | Dépendances | Ticket |
|---|---|---|---|---|---|
| S1-INFRA-01 | INFRA | P0 | M | — | Initialiser env API/mobile (`.env.example`, secrets Supabase, Redis, Twilio placeholders), configs strict TypeScript, scripts `dev/test/lint`. |
| S1-DATA-01 | DATA | P0 | M | — | Stabiliser `prisma/schema.prisma` avec `User`, `Driver`, `Subscription`, `Ride`, enums; migration initiale et seed minimal. |
| S1-API-AUTH-01 | API | P0 | M | S1-INFRA-01 | `POST /api/auth/send-otp`: validation Zod, rate limit Redis (5 tentatives/10 min par téléphone), journalisation. |
| S1-API-AUTH-02 | API | P0 | M | S1-API-AUTH-01 | `POST /api/auth/verify-otp` + émission JWT + refresh token + création user si absent. |
| S1-API-AUTH-03 | API | P1 | S | S1-API-AUTH-02 | `POST /api/auth/refresh` et middleware de vérification JWT Supabase côté Fastify. |
| S1-API-DRIVER-01 | API | P1 | M | S1-DATA-01, S1-API-AUTH-03 | `GET/PUT /api/drivers/me` (profil chauffeur), validations et contrôle d’accès. |
| S1-MOB-AUTH-01 | MOBILE | P0 | M | S1-API-AUTH-02 | Écrans `login/register/onboarding` OTP, stockage token (SecureStore), gestion session. |
| S1-MOB-AUTH-02 | MOBILE | P1 | M | S1-MOB-AUTH-01 | Navigation conditionnelle selon auth + rôle (driver/passenger). |
| S1-MOB-PROFILE-01 | MOBILE | P1 | S | S1-API-DRIVER-01 | Écran profil chauffeur (lecture/édition champs MVP). |
| S1-QA-01 | QA | P0 | S | Tous S1 | Suite de smoke tests: OTP send/verify, refresh, création profil, logout/login. |

### Critères d’acceptation Sprint S1
- OTP fonctionne de bout en bout sur device de test.
- Un utilisateur peut se connecter sans mot de passe.
- Profil chauffeur est lisible/modifiable avec contrôle d’accès.
- Aucun secret hardcodé dans le code.

## Sprint S2 (Semaines 3-4) — Carte + Temps réel + Présence chauffeur

| ID | Type | Priorité | Taille | Dépendances | Ticket |
|---|---|---|---|---|---|
| S2-API-DRIVER-02 | API | P0 | M | S1-API-DRIVER-01 | `POST /api/drivers/go-online`, `POST /api/drivers/go-offline`, `PATCH /api/drivers/location`. |
| S2-API-RT-01 | API | P1 | M | S2-API-DRIVER-02 | Publication évènements temps réel (changement présence/localisation) via Supabase Realtime. |
| S2-MOB-MAP-01 | MOBILE | P0 | L | S1-MOB-AUTH-02 | Intégration `react-native-maps` + permissions localisation + affichage position utilisateur. |
| S2-MOB-MAP-02 | MOBILE | P0 | M | S2-API-RT-01 | Affichage chauffeurs online proches en temps réel sur carte passager. |
| S2-MOB-DRIVER-01 | MOBILE | P0 | M | S2-API-DRIVER-02 | Bouton go online/offline chauffeur + envoi position périodique (throttle). |
| S2-QA-01 | QA | P1 | S | Tous S2 | Tests de non-régression auth + tests présence online/offline + update position. |

### Critères d’acceptation Sprint S2
- Chauffeur peut devenir disponible et invisible à la demande.
- Passager voit les chauffeurs online proches sur carte.
- Flux continue même avec variations réseau modérées.

## Sprint S3 (Semaines 5-6) — Flux course complet (request → complete)

| ID | Type | Priorité | Taille | Dépendances | Ticket |
|---|---|---|---|---|---|
| S3-API-RIDE-01 | API | P0 | M | S1-DATA-01 | `POST /api/rides`, `GET /api/rides/:id` avec validations pickup/drop/prix int FCFA. |
| S3-API-RIDE-02 | API | P0 | L | S3-API-RIDE-01, S2-API-RT-01 | `accept`, `cancel`, `start`, `complete` + transitions d’état robustes (machine d’états simple). |
| S3-API-RIDE-03 | API | P1 | S | S3-API-RIDE-02 | `POST /api/rides/:id/rate` (1-5), mise à jour rating chauffeur. |
| S3-API-RULES-01 | API | P0 | S | S3-API-RIDE-02 | Guard rails métier: aucune commission, prix int uniquement, validation rôle conducteur/passager. |
| S3-MOB-PASS-01 | MOBILE | P0 | L | S3-API-RIDE-01 | Écran demande course passager (`home`) + détail/tracking de base. |
| S3-MOB-DRIVER-02 | MOBILE | P0 | M | S3-API-RIDE-02 | Réception demande course (`ride-request`) + accepter/refuser + start/complete. |
| S3-MOB-HISTORY-01 | MOBILE | P1 | M | S3-API-RIDE-02 | Historique des courses côté passager + chauffeur. |
| S3-QA-01 | QA | P0 | M | Tous S3 | Tests E2E flux complet course (création → acceptation → démarrage → complétion). |

### Critères d’acceptation Sprint S3
- Une course peut être exécutée de bout en bout sans intervention manuelle DB.
- États de course cohérents, pas de transition invalide.
- `priceFinal` et `priceEstimate` restent des entiers FCFA.

## Sprint S4 (Semaines 7-8) — Abonnement Wave/Orange Money + Dashboard chauffeur

| ID | Type | Priorité | Taille | Dépendances | Ticket |
|---|---|---|---|---|---|
| S4-API-SUB-01 | API | P0 | M | S1-DATA-01 | `GET /api/subscriptions/status`. |
| S4-API-PAY-01 | API | P0 | L | S4-API-SUB-01 | `POST /api/subscriptions/pay` (init Wave/OM), validation `method in [wave, orange_money]`. |
| S4-API-PAY-02 | API | P0 | M | S4-API-PAY-01 | `POST /api/subscriptions/confirm`, activation abonnement, gestion erreurs/retry idempotent. |
| S4-API-RULES-01 | API | P0 | S | S4-API-PAY-02 | Verrou `amount = 18500` FCFA côté backend (source unique). |
| S4-MOB-SUB-01 | MOBILE | P0 | M | S4-API-SUB-01 | Écran `subscription`: statut + échéance + CTA paiement. |
| S4-MOB-PAY-01 | MOBILE | P0 | M | S4-API-PAY-01 | Flow paiement abonnement (choix méthode Wave/OM, suivi état confirmation). |
| S4-MOB-DRIVER-03 | MOBILE | P1 | M | S3-MOB-HISTORY-01 | Dashboard chauffeur basique + earnings history. |
| S4-QA-01 | QA | P0 | M | Tous S4 | Jeux de tests paiement (succès, refus, timeout, confirm en double). |

### Critères d’acceptation Sprint S4
- Paiement abonnement fonctionne avec Wave/OM uniquement.
- Montant facturé est toujours `18500 FCFA`.
- Chauffeur voit statut abonnement à jour sans incohérence.

## Sprint S5 (Semaines 9-10) — Push notifications + notation + durcissement UX

| ID | Type | Priorité | Taille | Dépendances | Ticket |
|---|---|---|---|---|---|
| S5-API-NOTIF-01 | API | P1 | M | S3-API-RIDE-02 | Service notifications (évènements: nouvelle course, course acceptée, course terminée). |
| S5-MOB-PUSH-01 | MOBILE | P1 | M | S5-API-NOTIF-01 | Intégration Expo Notifications (permissions + token device + handlers). |
| S5-MOB-RATING-01 | MOBILE | P1 | S | S3-API-RIDE-03 | UI notation chauffeur après course terminée. |
| S5-MOB-OFFLINE-01 | MOBILE | P1 | M | S3-MOB-HISTORY-01 | Support offline minimal: historique/cache local lecture, états de reprise réseau. |
| S5-QA-01 | QA | P1 | S | Tous S5 | Tests de bout en bout notifications + notation + reprise réseau. |

### Critères d’acceptation Sprint S5
- Notifications critiques reçues sur Android et iOS.
- Notation 1-5 enregistrée correctement.
- Expérience offline minimale conforme au CDC.

## Sprint S6 (Semaines 11-12) — Qualité finale + publication stores

| ID | Type | Priorité | Taille | Dépendances | Ticket |
|---|---|---|---|---|---|
| S6-INFRA-01 | INFRA | P0 | M | S1-INFRA-01 | Pipeline CI GitHub Actions: lint + tests + build mobile/API. |
| S6-INFRA-02 | INFRA | P1 | M | S6-INFRA-01 | Intégration Sentry mobile + API (erreurs critiques instrumentées). |
| S6-QA-01 | QA | P0 | L | Tous sprints | Campagne de tests de régression complète + checklist release MVP. |
| S6-MOB-REL-01 | MOBILE | P0 | M | S6-QA-01 | Configuration Expo EAS, signatures, builds release Android/iOS. |
| S6-MOB-REL-02 | MOBILE | P1 | S | S6-MOB-REL-01 | Préparation metadata stores (captures, textes, privacy). |
| S6-API-OPS-01 | API | P1 | S | S6-QA-01 | Hardening prod API (timeouts, rate limits ajustés, logs structurés finaux). |

### Critères d’acceptation Sprint S6
- Pipeline CI/CD vert.
- Crash/reporting actif en pré-prod.
- Build release prêt soumission App Store + Play Store.

## Séquence d’exécution immédiate (ordre conseillé pour lancer S1)
1. `S1-INFRA-01`
2. `S1-DATA-01`
3. `S1-API-AUTH-01`
4. `S1-API-AUTH-02`
5. `S1-API-AUTH-03`
6. `S1-MOB-AUTH-01`
7. `S1-MOB-AUTH-02`
8. `S1-API-DRIVER-01`
9. `S1-MOB-PROFILE-01`
10. `S1-QA-01`

## Risques et mitigations (MVP)
- Risque: intégration Wave/OM instable.
  Mitigation: sandbox + idempotence + retries bornés + logs transactionnels.
- Risque: géolocalisation bruitée.
  Mitigation: throttling + filtre distance minimale + fallback polling.
- Risque: OTP abuse.
  Mitigation: rate limiting Redis + contrôle par IP/téléphone + audit logs.
- Risque: dérive règles métier.
  Mitigation: tests d’invariants (`commission=0`, `amount=18500`, paiements autorisés).
