# Use Cases Documentation

Ce dossier contient tous les use cases de l'application, organisés par domaine fonctionnel.

## Structure des Use Cases

Chaque use case est documenté selon le format suivant:

```markdown
# Use Case: [Nom]
ID: UC-[Domain]-[Number]

## Acteurs
- Principal: [Acteur]
- Secondaire: [Acteur] (si applicable)

## Description
[Description courte du use case]

## Préconditions
- [ ] Condition 1
- [ ] Condition 2

## Flow Principal
1. L'utilisateur [action]
2. Le système [réponse]
3. L'utilisateur [action]
4. Le système [réponse]

## Flows Alternatifs
### A1: [Scenario d'erreur]
1. Si [condition]
2. Alors [action]

## Postconditions
- [ ] Résultat 1
- [ ] Résultat 2

## Spécifications Techniques
### API Endpoint
- Méthode: [GET/POST/PUT/DELETE]
- Route: `/api/[route]`
- Body: [Schema du body si applicable]
- Response: [Schema de la réponse]

### Authentification & Permissions
- Authentification requise: [Oui/Non]
- Permissions requises: [Liste des permissions]

### Validation
- [ ] Règle de validation 1
- [ ] Règle de validation 2

### Tests Requis
- [ ] Test case 1
- [ ] Test case 2
```

## Organisation des Domaines

### 🔐 Authentication
- Login
- Register
- Reset Password
- Verify Email

### 👥 User Management
- Create User
- Update User
- Delete User
- List Users

### 🛡️ Permission Management
- Assign Role
- Create Role
- Update Role
- Delete Role
- List Roles

### 💳 Subscription
- Create Subscription
- Cancel Subscription
- Update Payment Method
- Change Plan

## Standards de Nommage

- Les fichiers de use cases doivent être nommés en kebab-case: `create-user.md`
- Les IDs des use cases suivent le format: `UC-[DOM]-[NUM]`
  - DOM: Code du domaine (AUTH, USER, PERM, SUB)
  - NUM: Numéro séquentiel à 3 chiffres (001, 002, etc.)

## Validation des Use Cases

Avant d'implémenter un use case, vérifier:
- [ ] La cohérence avec l'architecture existante
- [ ] La conformité aux standards API
- [ ] La documentation OpenAPI
- [ ] Les tests unitaires requis
- [ ] La validation des données
- [ ] La gestion des erreurs standardisée
- [ ] La conformité RGPD si applicable
