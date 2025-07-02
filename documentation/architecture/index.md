# Structure du projet

Ce projet suit une architecture hexagonale (aussi appelée architecture en oignon ou ports and adapters) qui est divisée en plusieurs couches distinctes.

## Organisation des dossiers

```
src/
├── application/     # Couche application (cas d'utilisation)
├── domain/         # Couche domaine (logique métier)
└── infrastructure/ # Couche infrastructure (détails techniques)
```

### Point d'entrée

- `server.ts` : Point d'entrée de l'application
- `app.ts` : Configuration de l'application Hono

## Principes de l'architecture

Cette architecture est basée sur les principes suivants :

1. **Séparation des préoccupations** : Chaque couche a une responsabilité unique et bien définie
2. **Dépendances vers l'intérieur** : Les dépendances pointent toujours vers le centre (domaine)
3. **Isolation du domaine** : La logique métier est isolée des détails techniques
4. **[Principes SOLID](./solid.md)** : Application rigoureuse des principes de conception orientée objet

## Flux des données

1. Les requêtes arrivent via l'infrastructure (controllers)
2. Les cas d'utilisation (application) orchestrent les opérations
3. Le domaine contient la logique métier pure
4. L'infrastructure fournit les implémentations techniques
// docs: create developer guide - Development on 2025-06-18
