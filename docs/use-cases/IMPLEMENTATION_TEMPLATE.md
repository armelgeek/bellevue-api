# Template d'Implémentation des Use Cases

Ce template aide à structurer l'implémentation d'un use case selon notre architecture en couches avec Hono.js et Drizzle ORM.

## Structure d'Implémentation

Pour implémenter un use case, nous devons créer/modifier les fichiers suivants:

```
src/
  domain/
    types/           # Types et interfaces
    models/          # Modèles de domaine et validations Zod
    repositories/    # Interfaces des repositories
  application/
    services/       # Services métier
    use-cases/      # Cas d'utilisation
  infrastructure/
    controllers/    # Points d'entrée API Hono
    database/
      schema/       # Schémas Drizzle
    repositories/   # Implémentation avec Drizzle
```

## Prompt Template

```markdown
# Implémentation du Use Case: [Nom]
ID: UC-[DOM]-[NUM]

## 1. Types et Interfaces (domain/types)

```typescript
// Types d'entrée/sortie du use case
export interface [NomUseCase]Input {
  // Propriétés requises
}

export interface [NomUseCase]Output {
  // Propriétés de retour
}

// Types additionnels si nécessaire
```

## 2. Modèle de Domain avec Zod (si nouveau modèle requis)

```typescript
import { z } from 'zod'

export const [NomModel] = z.object({
  // Définition du schéma Zod
})

export type [NomModel] = z.infer<typeof [NomModel]>
```

## 3. Interface Repository

```typescript
import type { [NomModel] } from '../models'

export interface [Nom]RepositoryInterface {
  // Méthodes CRUD nécessaires
}
```

## 4. Service (si nécessaire)

```typescript
export class [Nom]Service {
  constructor(
    private readonly repository: [Nom]RepositoryInterface
  ) {}

  // Méthodes de service
}
```

## 5. Use Case Implementation

```typescript
import { IUseCase } from '@/domain/types'
import type { [Nom]Service } from '@/application/services'

export class [NomUseCase]UseCase extends IUseCase<[NomUseCase]Input, [NomUseCase]Output> {
  constructor(
    private readonly service: [Nom]Service
  ) {
    super()
  }

  async execute(input: [NomUseCase]Input): Promise<[NomUseCase]Output> {
    // 1. Validation des entrées avec Zod
    // 2. Logique métier
    // 3. Appel aux services
    // 4. Transformation sortie et gestion des erreurs
  }
}
```

## 6. Repository Implementation

```typescript
import { eq } from 'drizzle-orm'
import { db } from '../database/db'
import { [tableNom] } from '../database/schema'
import type { [Nom]RepositoryInterface } from '@/domain/repositories'

export class [Nom]Repository implements [Nom]RepositoryInterface {
  async findById(id: string): Promise<[NomModel] | null> {
    const [result] = await db
      .select()
      .from([tableNom])
      .where(eq([tableNom].id, id))

    if (!result) return null
    return result
  }
}
```

## 7. Controller Implementation

```typescript
import { OpenAPIHono } from '@hono/zod-openapi'
import type { [NomUseCase]UseCase } from '@/application/use-cases'

export class [Nom]Controller {
  private app: OpenAPIHono

  constructor(
    private readonly useCase: [NomUseCase]UseCase
  ) {
    this.app = new OpenAPIHono()
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.app.openapi(
      [METHODE],
      '/[route]',
      {
        tags: ['[Tag]'],
        summary: '[Description]',
        // Définition OpenAPI
      },
      async (c) => {
        const input = await c.req.json()
        const result = await this.useCase.execute(input)
        return c.json(result)
      }
    )
  }
}
```

## Points de Vérification

### Validation de l'Architecture
- [ ] Types et interfaces dans domain/types
- [ ] Modèles Zod dans domain/models
- [ ] Use case utilise uniquement les services
- [ ] Repository implémente l'interface du domain
- [ ] Controller utilise uniquement le use case

### Validation Technique
- [ ] Validation Zod des entrées/sorties
- [ ] Gestion des erreurs avec les types d'erreur standard
- [ ] Tests unitaires pour chaque couche
- [ ] Documentation OpenAPI complète
- [ ] Transactions DB si nécessaire

### Qualité du Code
- [ ] Nommage clair et cohérent
- [ ] Pas de logique métier dans le controller ou repository
- [ ] Gestion appropriée des erreurs DB
- [ ] Logging des actions importantes
- [ ] Performance (indexes DB, N+1 queries)

Le code doit être:
- Typé avec TypeScript strict
- Validé avec Zod
- Documenté avec OpenAPI
- Testé (unit + integration)
- Conforme aux standards du projet
