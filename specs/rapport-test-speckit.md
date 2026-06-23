# Rapport d'évaluation — Test de SpecKit avec agent IA (Continue)

**Contexte** : Test interne  
**Date** : Juin 2025  
**Outil évalué** : SpecKit (open source) + Continue (extension VS Code)  
**Objectifs** : Évaluer le niveau d'assistance à la complétion des requirements, le niveau de détail de l'implémentation et la qualité du code produit par l'agent.

---

## Introduction

### Qu'est-ce que SpecKit ?

SpecKit est un framework open source de gestion de spécifications orienté développement assisté par IA. Son principe repose sur une convention de fichiers structurés — `requirements.md`, `design.md`, `tasks.md` — placés dans un dossier `specs/` à la racine du projet. Ces fichiers servent de **contexte partagé** entre le développeur et l'agent IA : l'agent peut les lire, les compléter et s'y référer pour guider son implémentation.

SpecKit s'intègre à **Continue**, une extension VS Code open source qui connecte un modèle de langage (LLM) directement à l'environnement de développement. L'agent a ainsi accès à l'arborescence du projet, aux fichiers sources, au terminal, et peut créer ou modifier du code en temps réel.

### Contexte du test

Le test a consisté à partir d'un projet quasi-vierge contenant uniquement un fichier `specs/requirements.md` décrivant un système d'authentification minimaliste (5 exigences, section contraintes vide). L'objectif était de mesurer jusqu'où l'agent pouvait aller de manière autonome, depuis la lecture des specs jusqu'au déploiement local d'une application fonctionnelle fullstack.

---

## Résumé du déroulement

### 1. Analyse des requirements et proposition d'architecture

Dès la lecture du fichier `requirements.md`, l'agent a identifié les manques (section contraintes vide) et a spontanément proposé une stack technique cohérente et justifiée :

- **Backend** : Node.js + Express + TypeScript
- **Base de données** : PostgreSQL
- **Sécurité** : bcrypt (hash mots de passe), JWT HS256 (sessions)
- **Validation** : Zod
- **Frontend** : HTML + CSS + JavaScript Vanilla (sans framework)

Cette proposition a été accompagnée d'un tableau des routes API, d'un schéma SQL et d'une arborescence de fichiers. L'agent a ensuite mis à jour `design.md` et `tasks.md` avec ces informations, assurant la traçabilité entre les specs et l'implémentation.

**Résultat** : L'agent a joué un rôle actif de co-conception, transformant des exigences vagues en une architecture concrète et documentée.

---

### 2. Implémentation backend

L'agent a généré l'intégralité du code backend en une passe :

| Fichier | Rôle |
|---|---|
| `src/app.ts` | Point d'entrée Express |
| `src/db.ts` | Connexion PostgreSQL via Pool |
| `src/models/user.model.ts` | Requêtes SQL (findByEmail, createUser) |
| `src/services/auth.service.ts` | Logique métier (bcrypt, JWT) |
| `src/controllers/auth.controller.ts` | Gestion des requêtes HTTP + validation Zod |
| `src/middlewares/auth.middleware.ts` | Vérification JWT sur routes protégées |
| `src/routes/auth.routes.ts` | Définition des routes REST |
| `migrations/001_create_users.sql` | Création de la table users |

Chaque exigence du `requirements.md` était explicitement référencée dans les commentaires du code (REQ-001, REQ-002, etc.), assurant une traçabilité directe entre les specs et le code.

---

### 3. Implémentation frontend

Sur demande, l'agent a créé un second projet `auth-frontend/` avec ses propres specs (`requirements.md`, `design.md`, `tasks.md`), puis a généré une interface complète en HTML/CSS/JS Vanilla :

- Page de connexion et d'inscription avec validation côté client
- Dashboard protégé avec affichage de l'email et déconnexion
- Gestion du JWT en `localStorage`
- Redirections automatiques selon l'état de connexion
- Affichage des erreurs API

---

### 4. Résolution des problèmes rencontrés

Plusieurs erreurs sont survenues lors de la mise en route. L'agent les a diagnostiquées et résolues de manière autonome ou guidée :

| Problème | Cause | Solution apportée |
|---|---|---|
| `inotify` incompatible Windows | `ts-node-dev` est Linux-only | Remplacement par `nodemon` + `ts-node` |
| `npm install npm run dev` | Commande mal interprétée par l'utilisateur | Correction et explication de la séparation des commandes |
| `Unexpected token` JSON | PowerShell transforme les guillemets | Proposition de `Invoke-RestMethod` et syntaxe adaptée |
| `Failed to fetch` (frontend) | CORS non configuré | Ajout de `cors()` dans `app.ts` + installation du package |
| `SASL: client password must be a string` | `dotenv` absent, variables d'environnement non chargées | Ajout de `dotenv/config` + création du fichier `.env` |
| Table `users` inexistante | Migration SQL non exécutée | Commandes `psql` fournies pour créer la DB et exécuter la migration |

L'agent s'est montré réactif et précis dans ses diagnostics, en identifiant la cause racine à chaque fois plutôt qu'en proposant des solutions génériques.

---

## Conclusion

### Points forts

**Assistance à la complétion des requirements**
L'agent excelle dans ce rôle. Face à un `requirements.md` incomplet, il a su enrichir les specs, poser les bonnes questions implicites (stack, contraintes) et produire une architecture cohérente. Le maintien de la traçabilité REQ → code est un point particulièrement appréciable.

**Niveau de détail de l'implémentation**
L'implémentation est complète et structurée selon les bonnes pratiques (séparation des couches controller / service / model, middleware d'authentification, validation des entrées, migration SQL séparée). L'agent n'a pas produit un prototype mais une base de code organisée et extensible.

**Qualité du code**
Le code généré est lisible, typé (TypeScript strict), et commenté de manière pertinente. Les patterns utilisés (Pool PostgreSQL, bcrypt async, JWT signé, Zod schema validation) correspondent aux standards du domaine.

**Assistance au débogage**
L'agent a démontré une bonne capacité à diagnostiquer des erreurs d'environnement (Windows vs Linux, variables non chargées, CORS), ce qui représente une valeur ajoutée significative pour des profils moins expérimentés.

---

### Limites identifiées

**Limites de l'agent**

- **Dépendances cross-platform** : L'agent a proposé `ts-node-dev` sans anticiper son incompatibilité Windows, ce qui a nécessité une correction. Une détection proactive de l'OS cible améliorerait la robustesse des suggestions initiales.
- **Configuration d'environnement** : `dotenv` et le fichier `.env` n'ont pas été intégrés dès le départ, laissant les variables d'environnement non chargées. Ces éléments auraient dû faire partie du scaffold initial.
- **Migration non exécutée automatiquement** : L'agent crée le fichier SQL mais ne propose pas de script d'initialisation automatique (ex: un script `setup.ts` qui joue la migration au démarrage en développement).
- **Pas d'accès aux services externes** : L'agent ne peut pas créer de dépôt GitHub, configurer des secrets ou interagir avec des services tiers, ce qui est une limite inhérente et légitime (sécurité des credentials).

**Limites de SpecKit**

- **Pas de validation des specs** : SpecKit ne vérifie pas la cohérence entre `requirements.md`, `design.md` et `tasks.md`. Un requirement peut être omis dans les tasks sans qu'aucune alerte soit levée.
- **Format libre** : Les fichiers Markdown sont souples mais non structurés. L'absence de schema (ex: JSON/YAML) rend difficile l'automatisation ou la génération de métriques de couverture.
- **Pas de versionnement des specs** : Il n'y a pas de mécanisme natif pour tracer l'évolution des exigences dans le temps (diff de specs, changelog).
- **Dépendance au LLM sous-jacent** : La qualité de l'assistance dépend fortement du modèle connecté à Continue. SpecKit ne garantit pas un niveau de réponse minimal indépendamment du LLM utilisé.

---

### Verdict global

Le test démontre que l'association **SpecKit + Continue** constitue un environnement d'assistance au développement efficace, particulièrement pour la phase de conception et d'implémentation initiale. L'agent apporte une valeur réelle en tant que co-développeur : il structure, implémente, documente et débogue. Les frictions rencontrées étaient majoritairement des problèmes de configuration d'environnement, corrigés rapidement avec l'assistance de l'agent.

Pour un usage en équipe, il serait pertinent de compléter SpecKit par des conventions plus strictes sur le format des specs et d'intégrer des scripts d'initialisation d'environnement dans le scaffold de base afin de réduire les frictions au démarrage.
