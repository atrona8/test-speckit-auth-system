# Architecture Frontend

## Stack

- **Langage** : HTML5 + CSS3 + JavaScript (Vanilla, ES6+)
- **Communication API** : Fetch API
- **Stockage token** : localStorage
- **Aucun framework** : pas de React, Vue, Angular

## Pages

| Fichier         | Route         | Description                        |
|-----------------|---------------|------------------------------------|
| `index.html`    | /             | Redirige selon l'état de connexion |
| `register.html` | /register     | Formulaire d'inscription           |
| `login.html`    | /login        | Formulaire de connexion            |
| `dashboard.html`| /dashboard    | Page protégée post-connexion       |

## Structure des fichiers

```
auth-frontend/
├── specs/
│   ├── requirements.md
│   ├── design.md
│   └── tasks.md
├── css/
│   └── style.css          # Styles partagés
├── js/
│   ├── api.js             # Fonctions fetch vers le backend
│   └── auth.js            # Gestion du token (get/set/remove)
├── index.html             # Redirection selon état
├── register.html          # Formulaire inscription
├── login.html             # Formulaire connexion
└── dashboard.html         # Page protégée
```

## Logique

- **REQ-005** : Le JWT est stocké dans `localStorage` sous la clé `auth_token`
- **REQ-006** : Chaque page vérifie la présence du token au chargement et redirige si besoin
- **REQ-004** : Les erreurs retournées par l'API sont affichées dans un bloc `.error-message`
