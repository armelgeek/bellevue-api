# Couche Infrastructure

La couche infrastructure contient toutes les implémentations techniques et les intégrations avec les services externes.

## Structure

```
infrastructure/
├── config/         # Configurations des services externes
├── controllers/    # Contrôleurs HTTP
├── database/      # Accès à la base de données
├── middlewares/   # Middlewares HTTP
├── pages/         # Pages et composants UI
└── repositories/  # Implémentation des repositories
```

## Composants

### Config
- Configuration des services externes
- Paramètres d'environnement
- Intégrations (Stripe, Auth, Mail)
- Exemples:
  - `auth.config.ts`
  - `stripe.config.ts`
  - `mail.config.ts`

### Controllers
- Points d'entrée HTTP
- Validation des requêtes
- Routage vers les use cases
- Gestion des réponses HTTP
- Exemple: `user.controller.ts`

### Database
- Schémas de base de données
- Configuration de l'ORM (Drizzle)
- Migrations
- Structure:
  - `db/` : Configuration de la connexion
  - `schema/` : Définition des tables

### Middlewares
- Authentification
- Gestion des erreurs
- Logging
- Formatage des réponses
- Exemples:
  - `auth.middleware.ts`
  - `error.middleware.ts`
  - `response.middleware.ts`

### Pages
- Composants UI (TSX/JSX)
- Documentation interactive
- Pages d'administration
- Exemples:
  - `architecture.tsx`
  - `home.tsx`

### Repositories
- Implémentation des interfaces du domaine
- Accès à la base de données
- Requêtes SQL/ORM
- Exemple: `user.repository.ts`

## Principes

1. **Séparation des préoccupations**
   - Chaque composant a une responsabilité unique
   - Isolation des détails d'implémentation
   - Facilite les tests et la maintenance

2. **Adaptateurs**
   - Implémente les interfaces du domaine
   - Convertit les données externes en modèles du domaine
   - Isole la logique métier des détails techniques

3. **Configuration**
   - Centralise la configuration des services
   - Gestion des variables d'environnement
   - Documentation des intégrations