# Use Case: Assigner un Rôle à un Utilisateur
ID: UC-001

## Acteurs
- Principal: Administrateur
- Secondaire: Système

## Description
Permet à un administrateur d'assigner un rôle spécifique à un utilisateur existant dans le système, mettant à jour ses permissions.

## Préconditions
- [ ] L'administrateur est authentifié
- [ ] L'administrateur a la permission de gérer les rôles
- [ ] L'utilisateur cible existe dans le système
- [ ] Le rôle à assigner existe dans le système

## Flow Principal
1. L'administrateur sélectionne un utilisateur
2. Le système affiche les rôles disponibles
3. L'administrateur sélectionne le rôle à assigner
4. Le système valide la requête
5. Le système assigne le rôle à l'utilisateur
6. Le système confirme l'assignation

## Flows Alternatifs
### A1: Utilisateur non trouvé
1. Si l'utilisateur n'existe pas
2. Le système retourne une erreur 404
3. L'opération est annulée

### A2: Rôle non trouvé
1. Si le rôle n'existe pas
2. Le système retourne une erreur 404
3. L'opération est annulée

### A3: Permissions insuffisantes
1. Si l'administrateur n'a pas les permissions requises
2. Le système retourne une erreur 403
3. L'opération est annulée

## Postconditions
- [ ] Le rôle est assigné à l'utilisateur
- [ ] Les permissions de l'utilisateur sont mises à jour
- [ ] Un log d'activité est créé

## Spécifications Techniques
### API Endpoint
- Méthode: POST
- Route: `/api/permissions/roles/assign`
- Auth requise: Oui
- Permissions: ['assign_role']

### Payload
```typescript
interface AssignRoleRequestDTO {
  userId: string;
  roleId: string;
}

interface AssignRoleResponseDTO {
  success: boolean;
  message: string;
  data: {
    userId: string;
    roleId: string;
    role: {
      name: string;
      permissions: string[];
    };
  };
}
```

### Validation & Tests
- [ ] Vérifier que l'utilisateur existe
- [ ] Vérifier que le rôle existe
- [ ] Vérifier les permissions de l'administrateur
- [ ] Vérifier que l'assignation est effective
- [ ] Vérifier la création du log d'activité

### Erreurs Possibles
| Code | Message | Description |
|------|---------|-------------|
| 400 | INVALID_REQUEST | Les données de la requête sont invalides |
| 401 | UNAUTHORIZED | L'utilisateur n'est pas authentifié |
| 403 | FORBIDDEN | L'utilisateur n'a pas les permissions requises |
| 404 | USER_NOT_FOUND | L'utilisateur cible n'existe pas |
| 404 | ROLE_NOT_FOUND | Le rôle n'existe pas |
| 500 | INTERNAL_ERROR | Erreur interne du serveur |

// docs: add deployment instructions - Development on 2025-06-19

// docs: add architecture documentation - Development on 2025-06-19
