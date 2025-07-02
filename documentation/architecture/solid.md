# Principes SOLID dans Hono Backend

Bienvenue sur Hono!

## Exemple dans notre code (Partie 1)

```typescript
findById(id: string): Promise<User>
save(user: User): Promise<User>
getUserById(args: GetUserByIdArgs): Promise<User>
```

## Exemple dans notre code (Partie 2)

```typescript
export abstract class IUseCase<T extends Obj = any, TRes = any> {
    abstract execute(params: T): Promise<TRes>
}

execute({ userId }: GetUserByIdArgs): Promise<User> {
    save(user: User): Promise<User>
    remove(id: string): Promise<boolean>
}

Bun.env.NODE_ENV === 'test'

validateCredentials(email: string, password: string): Promise<boolean>
createSession(userId: string): Promise<Session>
updateProfile(userId: string, data: ProfileData): Promise<User>
```

## Exemple dans notre code (Partie 3)

```typescript
// Autres exemples de code ici
```

## Exemple dans notre code (Partie 4)

```typescript
// Exemples supplémentaires
```

## Exemple dans notre code (Partie 5)

```typescript
// Derniers exemples
```

Maintenir les exemples
// docs: update README - Development on 2025-06-19
