# Plan: Auth System

## Stack

- **Runtime** : Node.js
- **Framework** : Express
- **Langage** : TypeScript
- **Base de données** : PostgreSQL
- **Auth** : JWT (HS256, expiration 1h)
- **Hash mots de passe** : bcrypt (salt rounds: 10)
- **Validation** : Zod
- **Variables d'environnement** : dotenv
- **CORS** : cors
- **Frontend** : HTML5 + CSS3 + JavaScript Vanilla

## API REST

| Méthode | Route           | Body / Header                   | Description              |
|---------|-----------------|---------------------------------|--------------------------|
| POST    | /auth/register  | `{ email, password }`           | Inscription              |
| POST    | /auth/login     | `{ email, password }`           | Connexion → retourne JWT |
| POST    | /auth/logout    | `Authorization: Bearer <token>` | Déconnexion              |

## Data Model

### Table users

```sql
CREATE TABLE users (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      VARCHAR(255) UNIQUE NOT NULL,
  password   VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

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
├── db.ts
└── app.ts

migrations/
└── 001_create_users.sql

auth-frontend/
├── index.html
├── login.html
├── register.html
├── dashboard.html
├── css/style.css
└── js/
    ├── auth.js
    └── api.js
```

## Logique métier

- **Inscription** : validation Zod → bcrypt.hash → INSERT users
- **Connexion** : findByEmail → bcrypt.compare → jwt.sign
- **Déconnexion** : suppression token côté client (stateless JWT)
- **Middleware** : jwt.verify → injection req.user
