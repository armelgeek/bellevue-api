# Couche Domain

La couche domain est le cœur de l'application. Elle contient la logique métier pure et les règles de l'entreprise.

## Structure

```
domain/
├── models/         # Modèles de données et entités métier
├── repositories/   # Interfaces des repositories
└── types/         # Types et interfaces partagés
```

## Composants

### Models
- Définit les entités métier
- Contient la logique métier pure
- Ne dépend d'aucune infrastructure
- Exemple: `user.model.ts`

### Repositories (Interfaces)
- Définit les contrats pour l'accès aux données
- Interfaces pures sans implémentation
- Utilisé par la couche application
- Exemple: `user.repository.interface.ts`

### Types
- Types partagés dans le domaine
- Interfaces communes
- Enums métier
- DTOs (Data Transfer Objects)

## Règles

1. **Pas de dépendances externes**
   - Pas d'imports de frameworks
   - Pas de code d'infrastructure
   - Pas de dépendances à des bases de données

2. **Logique pure**
   - Règles métier uniquement
   - Validation des données
   - Invariants du domaine

3. **Interfaces stables**
   - Contrats clairs
   - Abstraction des détails techniques
   - Point de référence pour l'application
// docs: add API documentation - Development on 2025-06-18
