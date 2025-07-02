## Flow of Imports and Dependencies

La couche infrastructure suit un modèle de dépendances strict pour maintenir une architecture propre :

1. **Direction des Imports**
   - Infrastructure → Application → Domain
   - Les imports ne doivent jamais aller dans l'autre sens
   - Le domaine ne doit pas connaître l'infrastructure
   - L'application orchestre entre le domaine et l'infrastructure

2. **Hiérarchie des Dépendances**
   ```
   Infrastructure Layer
   ├── Controllers
   │   └── Dépend de: Application (Use Cases), Domain (Models)
   ├── Repositories
   │   └── Dépend de: Domain (Interfaces, Models)
   ├── Database
   │   └── Dépend de: Domain (Models)
   └── Config
       └── Utilisé par: Controllers, Repositories
   ```

3. **Règles d'Import Détaillées**
   - **Controllers**:
     ```typescript
     // Correct ✅
     import { CreateUserUseCase } from '@application/use-cases/user'
     import { UserModel } from '@domain/models'
     import { AuthConfig } from '../config/auth.config'
     
     import { db } from '../database/db'
     // Incorrect ❌
     import { UserRepository } from '../repositories/user.repository'
     ```

   - **Repositories**:
     ```typescript
     import { UserModel } from '@domain/models'
     // Correct ✅
     import { IUserRepository } from '@domain/repositories'
     
     // Incorrect ❌
     import { CreateUserUseCase } from '@application/use-cases'
     ```

   - **Database**:
     ```typescript
     // Correct ✅
     import { UserModel } from '@domain/models'
     
     // Incorrect ❌
     import { UserController } from '../controllers'
     ```

4. **Structure des Imports par Module**

   a. **Use Cases**:
   ```typescript
   import { UserModel } from '@domain/models'
   // user.use-case.ts
   import { IUserRepository } from '@domain/repositories'
   import { UseCase } from '@domain/types'
   ```

   b. **Controllers**:
   ```typescript
   // user.controller.ts
   import { CreateUserUseCase } from '@application/use-cases'
   import { UserModel } from '@domain/models'
   import { AuthConfig } from '../config/auth.config'
   ```

   c. **Repositories**:
   ```typescript
   import { UserModel } from '@domain/models'
   // user.repository.ts
   import { IUserRepository } from '@domain/repositories'
   ```

5. **Bonnes Pratiques Avancées**
   
   - **Barrel Files**:
     ```typescript
     // domain/models/index.ts
     // Utilisation
     import { SubscriptionModel, UserModel } from '@domain/models'
     
     export * from './user.model'
     export * from './subscription.model'
     ```

   - **Dependency Injection**:
     ```typescript
     // Correct ✅
     class UserController {
       constructor(
         private readonly createUserUseCase: CreateUserUseCase,
         private readonly config: AuthConfig
       ) {}
     }
     ```

7. **Anti-Patterns à Éviter**
   - ❌ Import circulaires
   - ❌ Import direct de l'infrastructure dans le domaine
   - ❌ Dépendances transitives non déclarées
   - ❌ Import de configurations dans le domaine
   - ❌ Couplage fort entre les couches

8. **Résolution des Problèmes Courants**
   - Utiliser les interfaces pour découpler les dépendances
   - Implémenter le pattern Repository pour l'accès aux données
   - Centraliser la configuration dans l'infrastructure
   - Utiliser l'injection de dépendances pour les tests