# Use Case: Create New Role
ID: UC-PERM-002

## Acteurs
- Principal: Administrateur système

## Description
Un administrateur système crée un nouveau rôle avec des permissions spécifiques pour être assigné aux utilisateurs.

## Préconditions
- [ ] L'administrateur est authentifié
- [ ] L'administrateur a la permission `MANAGE_ROLES`
- [ ] Le nom du rôle n'existe pas déjà

## Flow Principal
1. L'administrateur accède à la page de gestion des rôles
2. Le système affiche la liste des rôles existants
3. L'administrateur sélectionne "Créer un nouveau rôle"
4. Le système affiche le formulaire de création
5. L'administrateur remplit:
   - Nom du rôle
   - Description
   - Permissions associées
6. L'administrateur soumet le formulaire
7. Le système valide les données
8. Le système crée le nouveau rôle

## Flows Alternatifs
### A1: Nom de rôle déjà utilisé
1. Si le nom du rôle existe déjà
2. Le système affiche une erreur
3. L'administrateur doit choisir un autre nom

### A2: Permissions invalides
1. Si une ou plusieurs permissions n'existent pas
2. Le système affiche une erreur
3. L'administrateur doit corriger les permissions

## Postconditions
- [ ] Le nouveau rôle est créé
- [ ] Le rôle apparaît dans la liste des rôles
- [ ] Un log d'activité est créé

## Spécifications Techniques
### API Endpoint
- Méthode: POST
- Route: `/api/permissions/roles`
- Body:
```typescript
{
  name: string;
  description: string;
  permissions: string[];
  metadata?: Record<string, any>;
}
```
- Response:
```typescript
{
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    description: string;
    permissions: string[];
    createdAt: Date;
    metadata?: Record<string, any>;
  }
}
```

### Authentification & Permissions
- Authentification requise: Oui
- Permissions requises: `MANAGE_ROLES`

### Validation
- [ ] Nom du rôle: 3-50 caractères, unique
- [ ] Description: max 200 caractères
- [ ] Permissions: array non-vide de permissions valides
- [ ] Metadata: object JSON valide (optionnel)

### Tests Requis
- [ ] Test de création réussie
- [ ] Test avec nom existant
- [ ] Test avec permissions invalides
- [ ] Test sans authentification
- [ ] Test sans permission requise
- [ ] Test avec données invalides
- [ ] Test de validation du format des données
- [ ] Test de création avec metadata
