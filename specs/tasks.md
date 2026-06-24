# Tasks: Auth System

**Input**: Design documents from `specs/`
**Prerequisites**: `specs/plan.md`, `specs/spec.md`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialisation du projet et configuration de base

- [ ] T001 Initialiser le projet Node.js + TypeScript dans `package.json` et `tsconfig.json`
- [ ] T002 [P] Installer les dépendances : express, pg, bcrypt, jsonwebtoken, zod, dotenv, cors
- [ ] T003 [P] Installer les devDependencies : typescript, ts-node, nodemon, @types/*
- [ ] T004 Créer le fichier `.env` à partir de `.env.example` avec les valeurs DB et JWT_SECRET
- [ ] T005 [P] Créer `src/db.ts` — connexion PostgreSQL via Pool avec dotenv

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infrastructure partagée bloquante — doit être complète avant toute user story

⚠️ CRITICAL : Aucune user story ne peut démarrer avant la fin de cette phase

- [ ] T006 Créer la migration SQL `migrations/001_create_users.sql` — table users (UUID, email, password, created_at)
- [ ] T007 Exécuter la migration sur PostgreSQL via `psql -U postgres -d auth_db -f migrations/001_create_users.sql`
- [ ] T008 Créer `src/models/user.model.ts` — fonctions `findUserByEmail` et `createUser`
- [ ] T009 Créer `src/app.ts` — serveur Express avec `cors()`, `express.json()`, `dotenv/config`

**Checkpoint** : Base de données prête + serveur Express démarrable → user stories peuvent commencer

---

## Phase 3: User Story 1 — Inscription (Priority: P1) 🎯 MVP

**Goal**: Un utilisateur peut créer un compte avec email + mot de passe sécurisé

**Independent Test**: `POST /auth/register` avec email valide → retourne 201 + user. Même email → retourne 409.

### Implémentation US1

- [ ] T010 [US1] Implémenter `authSchema` Zod dans `src/controllers/auth.controller.ts` — validation email + password min 8 chars
- [ ] T011 [US1] Implémenter `register()` dans `src/services/auth.service.ts` — vérification email existant + `bcrypt.hash` + `createUser`
- [ ] T012 [US1] Implémenter le handler `register` dans `src/controllers/auth.controller.ts` — validation Zod + appel service + réponses 201/400/409
- [ ] T013 [US1] Créer `src/routes/auth.routes.ts` — `POST /register` → `authController.register`
- [ ] T014 [US1] Monter les routes dans `src/app.ts` — `app.use('/auth', authRoutes)`

**Checkpoint** : `POST /auth/register` fonctionnel et testé indépendamment

---

## Phase 4: User Story 2 — Connexion (Priority: P1)

**Goal**: Un utilisateur peut se connecter et recevoir un JWT valide

**Independent Test**: `POST /auth/login` avec bons identifiants → retourne 200 + `{ token }`. Mauvais identifiants → retourne 401.

### Implémentation US2

- [ ] T015 [US2] Implémenter `login()` dans `src/services/auth.service.ts` — `findUserByEmail` + `bcrypt.compare` + `jwt.sign` (1h)
- [ ] T016 [US2] Implémenter le handler `login` dans `src/controllers/auth.controller.ts` — validation Zod + appel service + réponses 200/400/401
- [ ] T017 [US2] Ajouter `POST /login` dans `src/routes/auth.routes.ts` → `authController.login`

**Checkpoint** : `POST /auth/login` fonctionnel — token JWT retourné et vérifiable sur jwt.io

---

## Phase 5: User Story 3 — Déconnexion (Priority: P2)

**Goal**: Un utilisateur connecté peut se déconnecter, son token est invalidé côté client

**Independent Test**: `POST /auth/logout` avec `Authorization: Bearer <token>` valide → retourne 200. Sans token → retourne 401.

### Implémentation US3

- [ ] T018 [US3] Créer `src/middlewares/auth.middleware.ts` — vérification JWT, injection `req.user`, réponse 401 si absent/invalide
- [ ] T019 [US3] Implémenter le handler `logout` dans `src/controllers/auth.controller.ts` — retourne 200 (invalidation côté client)
- [ ] T020 [US3] Ajouter `POST /logout` dans `src/routes/auth.routes.ts` avec middleware `authenticate` → `authController.logout`

**Checkpoint** : `POST /auth/logout` protégé par JWT — retourne 200 si token valide, 401 sinon

---

## Phase 6: User Story 4 — Frontend (Priority: P2)

**Goal**: L'utilisateur peut interagir avec le système d'auth via une interface web simple

**Independent Test**: Ouvrir `auth-frontend/index.html` → redirection login. S'inscrire → redirection login. Se connecter → dashboard avec email affiché. Se déconnecter → redirection login.

### Implémentation US4

- [ ] T021 [P] [US4] Créer `auth-frontend/js/auth.js` — `getToken`, `setToken`, `removeToken`, `requireAuth`, `requireGuest`
- [ ] T022 [P] [US4] Créer `auth-frontend/js/api.js` — `apiRegister`, `apiLogin`, `apiLogout` via Fetch API
- [ ] T023 [P] [US4] Créer `auth-frontend/css/style.css` — styles partagés (card, form, boutons, messages erreur/succès)
- [ ] T024 [US4] Créer `auth-frontend/index.html` — redirection automatique selon état de connexion
- [ ] T025 [US4] Créer `auth-frontend/register.html` — formulaire inscription + affichage erreurs + redirection post-inscription
- [ ] T026 [US4] Créer `auth-frontend/login.html` — formulaire connexion + stockage token + redirection dashboard
- [ ] T027 [US4] Créer `auth-frontend/dashboard.html` — affichage email depuis JWT + bouton déconnexion + redirection post-logout

**Checkpoint** : Parcours complet inscription → connexion → déconnexion fonctionnel dans le navigateur

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Finalisation, robustesse et documentation

- [ ] T028 [P] Vérifier et compléter `.gitignore` — `node_modules/`, `dist/`, `.env`, `package-lock.json`
- [ ] T029 [P] Mettre à jour `README.md` avec instructions de démarrage (install, migration, dev)
- [ ] T030 Tester le parcours complet via `Invoke-RestMethod` PowerShell ou le frontend
- [ ] T031 [P] Vérifier la cohérence `specs/requirements.md` ↔ `specs/tasks.md` (traçabilité REQ → T###)

---

## Dependencies & Execution Order

### Dépendances entre phases

- **Phase 1 (Setup)** : Aucune dépendance — démarrage immédiat
- **Phase 2 (Foundational)** : Dépend de Phase 1 — **bloque toutes les user stories**
- **Phase 3 (US1 Inscription)** : Dépend de Phase 2
- **Phase 4 (US2 Connexion)** : Dépend de Phase 2, intègre les modèles de US1
- **Phase 5 (US3 Déconnexion)** : Dépend de Phase 4 (besoin du token généré au login)
- **Phase 6 (US4 Frontend)** : Dépend de Phases 3, 4, 5 (toutes les routes API doivent exister)
- **Phase 7 (Polish)** : Dépend de toutes les phases

### Dépendances inter-tâches clés

- T008 (model) → T011 (service register) → T012 (controller register)
- T008 (model) → T015 (service login) → T016 (controller login)
- T018 (middleware) → T020 (route logout protégée)
- T021 + T022 (js) → T025, T026, T027 (pages HTML)

### Opportunités parallèles

- T002, T003, T004, T005 peuvent tourner en parallèle (Phase 1)
- T010, T011 peuvent être travaillés en parallèle (US1)
- T021, T022, T023 peuvent être travaillés en parallèle (US4 setup)

---

## Parallel Example: Phase 1

```powershell
# Ces tâches peuvent être lancées simultanément
Task T002 : npm install (dépendances prod)
Task T003 : npm install -D (dépendances dev)
Task T004 : Créer .env
Task T005 : Créer src/db.ts
```

---

## Implementation Strategy

### MVP (User Stories 1 + 2 uniquement)

1. Compléter Phase 1 : Setup
2. Compléter Phase 2 : Foundational (CRITIQUE)
3. Compléter Phase 3 : US1 Inscription
4. Compléter Phase 4 : US2 Connexion
5. **STOP & VALIDER** : tester register + login via Invoke-RestMethod
6. Démo possible dès cette étape

### Livraison incrémentale

1. Setup + Foundational → base prête
2. US1 + US2 → MVP fonctionnel (backend)
3. US3 → déconnexion sécurisée
4. US4 → interface utilisateur complète
5. Polish → production-ready
   