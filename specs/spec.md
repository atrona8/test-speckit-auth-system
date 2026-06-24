# Spec: Auth System

## Overview

Système d'authentification fullstack permettant à un utilisateur de s'inscrire, se connecter et se déconnecter de manière sécurisée.

## User Stories

### US1 — Inscription (P1)
En tant qu'utilisateur, je veux créer un compte avec mon email et un mot de passe afin d'accéder à l'application.

**Acceptance Criteria :**
- Je peux soumettre un formulaire avec email + mot de passe
- Mon mot de passe est stocké de façon sécurisée (non lisible)
- Je reçois une confirmation ou un message d'erreur clair
- Un email déjà utilisé me renvoie une erreur explicite

### US2 — Connexion (P1)
En tant qu'utilisateur, je veux me connecter avec mes identifiants afin d'obtenir un accès authentifié.

**Acceptance Criteria :**
- Je peux soumettre email + mot de passe
- En cas de succès, je reçois un token d'accès
- En cas d'échec, je reçois un message d'erreur générique (pas d'info sur quel champ est faux)
- Je suis redirigé vers le dashboard après connexion réussie

### US3 — Déconnexion (P2)
En tant qu'utilisateur connecté, je veux me déconnecter afin de sécuriser mon accès.

**Acceptance Criteria :**
- Un bouton de déconnexion est accessible depuis le dashboard
- Mon token est invalidé côté client après déconnexion
- Je suis redirigé vers la page de connexion

### US4 — Protection des routes (P2)
En tant que développeur, je veux que les routes sensibles soient protégées par authentification.

**Acceptance Criteria :**
- Toute requête sans token valide sur une route protégée retourne 401
- Le token est vérifié à chaque requête via middleware
- Un token expiré ou invalide est rejeté

## Functional Requirements

- REQ-001 : L'utilisateur peut s'inscrire avec email + mot de passe
- REQ-002 : L'utilisateur peut se connecter
- REQ-003 : L'utilisateur peut se déconnecter
- REQ-004 : Vérification des identifiants à la connexion
- REQ-005 : Stockage sécurisé des mots de passe (bcrypt)

## Success Criteria

- Un utilisateur peut s'inscrire, se connecter et se déconnecter sans erreur
- Les mots de passe ne sont jamais stockés en clair
- Les routes protégées rejettent les requêtes non authentifiées
- Les erreurs sont affichées de manière claire à l'utilisateur

## Edge Cases

- Email déjà enregistré → erreur 409
- Mot de passe trop court (< 8 caractères) → erreur de validation
- Token expiré → erreur 401
- Tentative d'accès au dashboard sans token → redirection login
