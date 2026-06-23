# Architecture

## Stack recommandée

- **Runtime** : Node.js
- **Framework** : Express
- **Langage** : TypeScript
- **Base de données** : PostgreSQL
- **Auth** : JWT (HS256, expiration 1h)
- **Hash mots de passe** : bcrypt (salt rounds: 10)
- **Validation** : Zod

## Backend

API REST :

| Méthode | Route            | Body / Header                    | Description              |
|---------|------------------|----------------------------------|--------------------------|
| POST    | /auth/register   | `{ email, password }`            | Inscription              |
| POST    | /auth/login      | `{ email, password }`            | Connexion → retourne JWT |
| POST    | /auth/logout     | `Authorization: Bearer <token>`  | Déconnexion              |

## Stockage

Table users :

```sql
CREATE TABLE users (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      VARCHAR(255) UNIQUE NOT NULL,
  password   VARCHAR(255) NOT NULL,  -- bcrypt hash
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Logique

- **Inscription** : validation email + password via Zod, hash bcrypt, insertion en base
- **Connexion** : vérification email existant + `bcrypt.compare()`, génération JWT signé
- **Déconnexion** : invalidation du token côté client (stateless) ou blacklist Redis
- **Middleware auth** : vérifie et décode le JWT sur les routes protégées

## Structure des fichiers

```
src/
├── controllers/
│   └── auth.controller.ts
├── middlewares/
│   └── auth.middleware.ts
├── models/
│   └── user.model.ts
├── routes/
│   └── auth.routes.ts
├── services/
│   └── auth.service.ts
└── app.ts
```