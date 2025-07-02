# Meko Academy Backend - Copilot Instructions

## Présentation du Projet

Meko Academy est une plateforme éducative backend construite avec Bun, TypeScript, et Hono. Le projet suit une architecture hexagonale (Clean Architecture) avec une séparation claire entre les couches Domain, Application, et Infrastructure.

## Architecture du Projet

### Structure des Dossiers

```
src/
├── domain/           # Couche métier (entités, interfaces, types)
├── application/      # Couche application (cas d'usage, services)
└── infrastructure/   # Couche infrastructure (controllers, DB, external APIs)
```

### Couche Domain (Domaine)

**Localisation**: `src/domain/`

La couche domain contient la logique métier pure, sans dépendances externes.

#### Models (`src/domain/models/`)
```typescript
// Exemple: game.model.ts
import { z } from 'zod'

const GameSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  file: z.string().optional(),
  coverUrl: z.string().optional(),
  lessonId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export type Game = z.infer<typeof GameSchema>
```

#### Repository Interfaces (`src/domain/repositories/`)
```typescript
// Exemple: game.repository.interface.ts
export interface GameRepositoryInterface {
  findById: (id: string) => Promise<Game | null>
  findAll: (pagination?: { skip: number; limit: number }) => Promise<Game[]>
  create: (data: Omit<Game, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Game>
  update: (id: string, data: Partial<Omit<Game, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<Game>
  delete: (id: string) => Promise<boolean>
}
```

### Couche Application

**Localisation**: `src/application/`

#### Use Cases (`src/application/use-cases/`)

Structure par entité: `game/`, `lesson/`, `module/`, `user/`, etc.

```typescript
// Exemple: create-game.use-case.ts
import { IUseCase } from '@/domain/types/use-case.type'
import { ActivityType } from '@/infrastructure/config/activity.config'

type Params = {
  title: string
  file?: string
  coverUrl?: string
  lessonId: string
}

type Response = {
  data: Game
  success: boolean
  error?: string
}

export class CreateGameUseCase extends IUseCase<Params, Response> {
  constructor(private readonly gameRepository: GameRepositoryInterface) {
    super()
  }

  async execute(params: Params): Promise<Response> {
    try {
      const game = await this.gameRepository.create(params)
      return { data: game, success: true }
    } catch (error: any) {
      return { success: false, error: error.message, data: null as any }
    }
  }

  log(): ActivityType {
    return ActivityType.CREATE_GAME
  }
}
```

#### Services (`src/application/services/`)

Services pour gérer les fichiers et opérations complexes :

```typescript
// Exemple: game-cover.service.ts
export class GameCoverService {
  private coverDirectory: string

  constructor() {
    const uploadRoot = Bun.env.NODE_ENV === 'production' ? '/usr/src/app' : rootDir
    this.coverDirectory = join(uploadRoot, 'uploads', 'game-covers')
  }

  async uploadGameCover(file: File): Promise<{ id: string; url: string }> {
    // Validation et upload logic
  }

  async deleteGameCover(id: string): Promise<boolean> {
    // Suppression logic
  }
}
```

### Couche Infrastructure

**Localisation**: `src/infrastructure/`

#### Controllers (`src/infrastructure/controllers/`)

Controllers Hono avec OpenAPI/Swagger :

```typescript
// Exemple: module.controller.ts
export class ModuleController implements Routes {
  public controller: OpenAPIHono
  
  constructor() {
    this.controller = new OpenAPIHono()
    // Injection des dépendances
    this.moduleRepository = new ModuleRepository()
    this.moduleCoverService = new ModuleCoverService()
    this.initRoutes()
  }

  public initRoutes() {
    this.controller.openapi(
      createRoute({
        method: 'post',
        path: '/v1/admin/modules',
        tags: ['Modules'],
        summary: 'Create module',
        request: {
          body: {
            content: {
              'multipart/form-data': {
                schema: z.object({
                  name: z.string().min(1),
                  description: z.string().optional(),
                  file: z.any().optional()
                })
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Module created successfully',
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean(),
                  data: z.object({
                    // Schema de réponse
                  })
                })
              }
            }
          }
        }
      }),
      async (c: any) => {
        // Implémentation du handler
      }
    )
  }
}
```

#### Repositories (`src/infrastructure/repositories/`)

Implémentations Drizzle ORM :

```typescript
// Exemple: game.repository.ts
export class GameRepository implements GameRepositoryInterface {
  async findById(id: string): Promise<Game | null> {
    const result = await db.query.games.findFirst({
      where: eq(games.id, id)
    })
    
    if (!result) return null
    
    return {
      id: result.id,
      title: result.title,
      file: result.file || undefined,
      coverUrl: result.coverUrl || undefined,
      lessonId: result.lessonId,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt
    }
  }
  
  // Autres méthodes...
}
```

#### Database Schema (`src/infrastructure/database/schema/`)

Schémas Drizzle :

```typescript
// Exemple: schema.ts
export const games = pgTable('games', {
  id: text('id').primaryKey(),
  title: text('title').notNull().unique(),
  file: text('file'),
  coverUrl: text('cover_url'),
  lessonId: text('lesson_id').notNull().references(() => lessons.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})
```

## Guide de Développement d'une Fonctionnalité

### 1. Créer/Modifier le Model Domain

```typescript
// src/domain/models/nouvelle-entite.model.ts
import { z } from 'zod'

const NouvelleEntiteSchema = z.object({
  id: z.string().uuid(),
  nom: z.string().min(1),
  // autres champs...
  createdAt: z.date(),
  updatedAt: z.date()
})

export type NouvelleEntite = z.infer<typeof NouvelleEntiteSchema>
```

### 2. Créer l'Interface Repository

```typescript
// src/domain/repositories/nouvelle-entite.repository.interface.ts
export interface NouvelleEntiteRepositoryInterface {
  findById: (id: string) => Promise<NouvelleEntite | null>
  findAll: (pagination?: { skip: number; limit: number }) => Promise<NouvelleEntite[]>
  create: (data: Omit<NouvelleEntite, 'id' | 'createdAt' | 'updatedAt'>) => Promise<NouvelleEntite>
  update: (id: string, data: Partial<Omit<NouvelleEntite, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<NouvelleEntite>
  delete: (id: string) => Promise<boolean>
}
```

### 3. Créer le Schéma Database

```typescript
// src/infrastructure/database/schema/schema.ts
export const nouvelleEntites = pgTable('nouvelle_entites', {
  id: text('id').primaryKey(),
  nom: text('nom').notNull(),
  // autres colonnes...
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})
```

### 4. Générer et Appliquer la Migration

```bash
bun run db:generate
bun run db:migrate
```

### 5. Implémenter le Repository

```typescript
// src/infrastructure/repositories/nouvelle-entite.repository.ts
export class NouvelleEntiteRepository implements NouvelleEntiteRepositoryInterface {
  async findById(id: string): Promise<NouvelleEntite | null> {
    const result = await db.query.nouvelleEntites.findFirst({
      where: eq(nouvelleEntites.id, id)
    })
    
    if (!result) return null
    
    return {
      id: result.id,
      nom: result.nom,
      // mapping des autres champs...
      createdAt: result.createdAt,
      updatedAt: result.updatedAt
    }
  }
  
  // Autres méthodes CRUD...
}
```

### 6. Créer les Use Cases

```typescript
// src/application/use-cases/nouvelle-entite/create-nouvelle-entite.use-case.ts
export class CreateNouvelleEntiteUseCase extends IUseCase<Params, Response> {
  constructor(private readonly repository: NouvelleEntiteRepositoryInterface) {
    super()
  }

  async execute(params: Params): Promise<Response> {
    try {
      const entite = await this.repository.create(params)
      return { data: entite, success: true }
    } catch (error: any) {
      return { success: false, error: error.message, data: null as any }
    }
  }

  log(): ActivityType {
    return ActivityType.CREATE_NOUVELLE_ENTITE
  }
}
```

### 7. Créer le Controller

```typescript
// src/infrastructure/controllers/nouvelle-entite.controller.ts
export class NouvelleEntiteController implements Routes {
  private repository: NouvelleEntiteRepository

  constructor() {
    this.controller = new OpenAPIHono()
    this.repository = new NouvelleEntiteRepository()
    this.initRoutes()
  }

  public initRoutes() {
    // CRUD endpoints avec OpenAPI schema
  }
}
```

### 8. Ajouter le Controller aux Routes

```typescript
// src/infrastructure/controllers/index.ts
import { NouvelleEntiteController } from './nouvelle-entite.controller'

export const controllers = [
  // ...autres controllers,
  new NouvelleEntiteController()
]
```

## Conventions de Code

### Naming Conventions

- **Files**: kebab-case (`game-cover.service.ts`)
- **Classes**: PascalCase (`GameCoverService`)
- **Variables/Functions**: camelCase (`gameRepository`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)
- **Database Tables**: snake_case (`game_covers`)
- **API Endpoints**: kebab-case (`/api/v1/game-covers`)

### Response Format Standard

```typescript
// Success Response
{
  success: true,
  data: T
}

// Error Response
{
  success: false,
  error: string
}

// Paginated Response
{
  success: true,
  data: {
    items: T[],
    total: number,
    page: number,
    limit: number,
    totalPages: number
  }
}
```

### Error Handling

```typescript
try {
  // Logic
  return c.json({ success: true, data: result })
} catch (error: any) {
  return c.json({ success: false, error: error.message }, 400)
}
```

## File Upload Pattern

### Service Pattern

```typescript
export class EntityFileService {
  private fileDirectory: string

  constructor() {
    const uploadRoot = Bun.env.NODE_ENV === 'production' ? '/usr/src/app' : rootDir
    this.fileDirectory = join(uploadRoot, 'uploads', 'entity-files')
  }

  async uploadFile(file: File): Promise<{ id: string; url: string }> {
    // Validation
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image')
    }

    if (file.size > MAX_SIZE) {
      throw new Error(`File size must be less than ${MAX_SIZE / 1024 / 1024}MB`)
    }

    // Upload logic
    const id = this.generateId()
    const extension = this.getFileExtension(file.type)
    const filename = `${id}.${extension}`
    const filepath = join(this.fileDirectory, filename)

    await this.ensureDirectoryExists(this.fileDirectory)
    const buffer = await file.arrayBuffer()
    await Bun.write(filepath, buffer)

    return {
      id,
      url: `/uploads/entity-files/${filename}`
    }
  }
}
```

### Use Case Pattern

```typescript
export class UploadEntityFileUseCase {
  constructor(private entityFileService: EntityFileService) {}

  async execute(data: { file: File }): Promise<{ success: boolean; data?: { id: string; url: string }; error?: string }> {
    try {
      const result = await this.entityFileService.uploadFile(data.file)
      return { success: true, data: result }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}
```

## Bonnes Pratiques de Gestion des Fichiers

### Validation et Sécurité

```typescript
// Validation des types de fichiers
const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const allowedGameTypes = ['application/zip', 'text/html', 'application/javascript']

if (!allowedTypes.includes(file.type)) {
  throw new Error('File type not allowed')
}

// Validation de la taille
const maxImageSize = 5 * 1024 * 1024 // 5MB
const maxGameSize = 50 * 1024 * 1024 // 50MB

if (file.size > maxSize) {
  throw new Error(`File size exceeds ${maxSize / 1024 / 1024}MB limit`)
}
```

### Gestion des Environnements

```typescript
constructor() {
  // Support des environnements de développement et production
  const uploadRoot = Bun.env.NODE_ENV === 'production' ? '/usr/src/app' : rootDir
  this.fileDirectory = join(uploadRoot, 'uploads', 'entity-files')
}
```

### Nettoyage Automatique

```typescript
// Pattern de suppression avec nettoyage des fichiers
async deleteEntity(id: string): Promise<boolean> {
  const entity = await this.repository.findById(id)
  
  // Supprimer les fichiers associés avant la suppression de l'entité
  if (entity.file) {
    const fileId = this.extractFileId(entity.file)
    await this.fileService.deleteFile(fileId)
  }
  
  if (entity.coverUrl) {
    const coverId = this.extractFileId(entity.coverUrl)
    await this.coverService.deleteCover(coverId)
  }
  
  return await this.repository.delete(id)
}
```

### Gestion des Erreurs de Fichiers

```typescript
try {
  const result = await this.fileService.uploadFile(file)
  return { success: true, data: result }
} catch (error: any) {
  // Log l'erreur pour le debugging
  console.error('File upload failed:', error)
  
  // Retourner une erreur utilisateur-friendly
  return { 
    success: false, 
    error: error.message || 'File upload failed' 
  }
}
```

## Gestion des Permissions

### Pattern Middleware

```typescript
import { authMiddleware } from '@/infrastructure/middlewares/auth.middleware'
import { roleMiddleware } from '@/infrastructure/middlewares/role.middleware'

// Dans le controller
this.controller.use('/v1/admin/*', authMiddleware)
this.controller.use('/v1/admin/*', roleMiddleware(['admin', 'super_admin']))
```

### Validation des Prérequis

```typescript
// Validation des prérequis dans les endpoints
async validatePrerequisites(prerequisiteIds: string[], lessonId: string): Promise<void> {
  if (prerequisiteIds.length === 0) return

  // Vérifier que tous les prérequis existent et appartiennent à la même leçon
  const prerequisites = await Promise.all(
    prerequisiteIds.map(id => this.gameRepository.findById(id))
  )

  const invalidPrerequisites = prerequisites.filter(game => !game || game.lessonId !== lessonId)
  
  if (invalidPrerequisites.length > 0) {
    throw new Error('Invalid prerequisites: all prerequisites must exist and belong to the same lesson')
  }
}

// Utilisation dans les use cases
const prerequisiteIds = prerequisites ? prerequisites.split(',').map(id => id.trim()).filter(Boolean) : []
await this.validatePrerequisites(prerequisiteIds, lessonId)
```

## Database Relations

### One-to-Many

```typescript
// Parent Table
export const lessons = pgTable('lessons', {
  id: text('id').primaryKey(),
  // autres champs...
})

// Child Table
export const games = pgTable('games', {
  id: text('id').primaryKey(),
  lessonId: text('lesson_id').notNull().references(() => lessons.id, { onDelete: 'cascade' }),
  // autres champs...
})

// Relations
export const lessonsRelations = relations(lessons, ({ many }) => ({
  games: many(games)
}))

export const gamesRelations = relations(games, ({ one }) => ({
  lesson: one(lessons, {
    fields: [games.lessonId],
    references: [lessons.id]
  })
}))
```

### Many-to-Many

```typescript
// Junction Table
export const gamePrerequisites = pgTable('game_prerequisites', {
  gameId: text('game_id').notNull().references(() => games.id, { onDelete: 'cascade' }),
  prerequisiteGameId: text('prerequisite_game_id').notNull().references(() => games.id, { onDelete: 'cascade' })
}, (table) => ({
  pk: primaryKey({ columns: [table.gameId, table.prerequisiteGameId] })
}))

// Relations
export const gamePrerequisitesRelations = relations(gamePrerequisites, ({ one }) => ({
  game: one(games, {
    fields: [gamePrerequisites.gameId],
    references: [games.id]
  }),
  prerequisiteGame: one(games, {
    fields: [gamePrerequisites.prerequisiteGameId],
    references: [games.id]
  })
}))

export const gamesRelations = relations(games, ({ one, many }) => ({
  lesson: one(lessons, {
    fields: [games.lessonId],
    references: [lessons.id]
  }),
  prerequisites: many(gamePrerequisites, {
    relationName: 'gameToPrerequisites'
  }),
  dependentGames: many(gamePrerequisites, {
    relationName: 'prerequisiteToGames'
  })
}))
```

### Gestion des Relations dans le Repository

```typescript
// Créer des relations de prérequis
async createPrerequisites(gameId: string, prerequisiteIds: string[]): Promise<void> {
  if (prerequisiteIds.length === 0) return

  const prerequisitesData = prerequisiteIds.map(prerequisiteId => ({
    gameId,
    prerequisiteGameId: prerequisiteId
  }))

  await db.insert(gamePrerequisites).values(prerequisitesData)
}

// Supprimer et recréer les prérequis lors de la mise à jour
async updatePrerequisites(gameId: string, prerequisiteIds: string[]): Promise<void> {
  // Supprimer les prérequis existants
  await db.delete(gamePrerequisites).where(eq(gamePrerequisites.gameId, gameId))
  
  // Créer les nouveaux prérequis
  await this.createPrerequisites(gameId, prerequisiteIds)
}

// Récupérer les prérequis d'un jeu
async findPrerequisites(gameId: string): Promise<Game[]> {
  const results = await db
    .select({
      id: prerequisiteGames.id,
      title: prerequisiteGames.title,
      // autres champs...
    })
    .from(gamePrerequisites)
    .innerJoin(games, eq(gamePrerequisites.prerequisiteGameId, games.id))
    .where(eq(gamePrerequisites.gameId, gameId))
    
  return results.map(this.mapToGame)
}
```

## Scripts Utiles

```bash
# Développement
bun run dev              # Démarrer en mode développement
bun run build            # Build pour production
bun run start            # Démarrer en production

# Database
bun run db:generate      # Générer migration
bun run db:migrate       # Appliquer migrations
bun run db:reset         # Reset database
bun run db:studio        # Ouvrir Drizzle Studio

# Tests et Qualité
bun run test             # Lancer les tests
bun run lint             # Linter
bun run lint:fix         # Fix automatique du linting
bun run format           # Formater le code
```

## Variables d'Environnement

```env
# Database
DATABASE_URL="postgresql://..."

# Server
PORT=3000
NODE_ENV="development"

# Auth
JWT_SECRET="..."
JWT_EXPIRES_IN="7d"

# File Upload
MAX_FILE_SIZE=52428800  # 50MB

# Email
RESEND_API_KEY="..."
FROM_EMAIL="..."
```

## Tests

### Pattern Test

```typescript
import { beforeEach, describe, expect, it } from 'vitest'

describe('CreateGameUseCase', () => {
  let useCase: CreateGameUseCase
  let mockRepository: GameRepositoryInterface

  beforeEach(() => {
    mockRepository = {
      create: vi.fn(),
      // autres méthodes mockées...
    }
    useCase = new CreateGameUseCase(mockRepository)
  })

  it('should create a game successfully', async () => {
    const params = {
      title: 'Test Game',
      lessonId: 'lesson-123'
    }

    const mockGame = { id: 'game-123', ...params, createdAt: new Date(), updatedAt: new Date() }
    vi.mocked(mockRepository.create).mockResolvedValue(mockGame)

    const result = await useCase.execute(params)

    expect(result.success).toBe(true)
    expect(result.data).toEqual(mockGame)
    expect(mockRepository.create).toHaveBeenCalledWith(params)
  })
})
```

## Fonctionnalités Complètes

### Système de Gestion des Fichiers pour les Jeux

Le projet dispose d'un système complet de gestion des fichiers pour les jeux incluant :

1. **Upload de fichiers de jeu** (zip, html, js, json, swf jusqu'à 50MB)
2. **Images de couverture de jeu** (images jusqu'à 5MB, stockées dans `/uploads/game-covers/`)
3. **Gestion des prérequis de jeu** (relations many-to-many entre jeux)
4. **Intégration complète** avec les opérations CRUD des jeux

#### Services Implémentés

- `GameFileService` : Gestion des fichiers de jeu (zip, html, js, json, swf - max 50MB)
- `GameCoverService` : Gestion des images de couverture (images - max 5MB)
- Use cases correspondants pour upload/delete avec gestion d'erreurs
- Repository avec support des prérequis (relations many-to-many)
- Endpoints API avec support multipart/form-data et validation stricte

#### Endpoints Disponibles

- `POST /v1/admin/lessons/{lessonId}/games` - Créer un jeu avec fichier et couverture
- `PUT /v1/admin/games/{id}` - Mettre à jour un jeu avec prérequis et remplacement de fichiers
- `DELETE /v1/admin/games/{id}` - Supprimer un jeu et ses fichiers associés automatiquement
- Support des prérequis via champ `prerequisites` (IDs séparés par virgules avec validation)

#### Fonctionnalités Avancées

- **Gestion automatique des fichiers** : Suppression des anciens fichiers lors des mises à jour
- **Validation stricte** : Types de fichiers, tailles, formats d'image
- **Nettoyage automatique** : Suppression des fichiers orphelins lors de la suppression des jeux
- **Support multipart/form-data** : Upload simultané de fichiers de jeu et couvertures
- **Gestion des prérequis** : Validation et création automatique des relations entre jeux
