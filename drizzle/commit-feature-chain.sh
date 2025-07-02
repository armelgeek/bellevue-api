#!/bin/bash
set -e

# Script d'automatisation des commits par fonctionnalité pour le backend Bellevue
# Usage : bash drizzle/commit-feature-chain.sh

# 1. Modèles et types du domaine
git add src/domain/models/
git commit -m "feat(domain): add RoomType, Feature, Rule, Policy, Hotel, Room models (Zod + types)"
git add src/domain/models/room-feature.model.ts src/domain/models/room-rule.model.ts || true
git commit -m "feat(domain): add relation models RoomFeature, RoomRule" || true

# 2. Schémas Drizzle
git add src/infrastructure/database/schema/room-type.schema.ts
git commit -m "feat(db): add Drizzle schema for room_types"
git add src/infrastructure/database/schema/feature.schema.ts
git commit -m "feat(db): add Drizzle schema for features"
git add src/infrastructure/database/schema/rule.schema.ts
git commit -m "feat(db): add Drizzle schema for rules"
git add src/infrastructure/database/schema/policy.schema.ts
git commit -m "feat(db): add Drizzle schema for policies"
git add src/infrastructure/database/schema/hotel.schema.ts
git commit -m "feat(db): add Drizzle schema for hotels"
git add src/infrastructure/database/schema/room.schema.ts
git commit -m "feat(db): add Drizzle schema for rooms"
git add src/infrastructure/database/schema/room-relations.schema.ts
git commit -m "feat(db): add Drizzle schema for room_features and room_rules relations"
git add src/infrastructure/database/schema/currency.schema.ts
git commit -m "feat(db): add Drizzle schema for currencies"

# 3. Repositories
git add src/infrastructure/repositories/
git commit -m "feat(repository): add repositories for RoomType, Feature, Rule, Policy, Hotel, Room and relations"

# 4. Use Cases
git add src/application/use-cases/
git commit -m "feat(use-case): add CRUD use cases for RoomType, Feature, Rule, Policy, Hotel, Room and relations"

# 5. Controllers Hono
git add src/infrastructure/controllers/
git commit -m "feat(controller): add OpenAPIHono controllers for RoomType, Feature, Rule, Policy, Hotel, Room and relations"

# 6. Seed de la base
git add drizzle/seed.ts
git commit -m "feat(seed): add initial seed for room_types, features, rules, policies, hotels, rooms, relations, currencies"

# 7. Tests & Documentation
git add src/application/use-cases/**/*.test.ts src/infrastructure/controllers/**/*.test.ts docs/openapi.yaml || true
git commit -m "test(use-case): add unit tests for Room CRUD use cases and docs(openapi): add OpenAPI documentation" || true

echo "✅ Commits par fonctionnalité réalisés. Pense à push à la main pour contrôler chaque étape."
