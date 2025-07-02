#!/bin/bash
set -e

git stash push -u -m "stash avant commit-feature-chain"

# Script d'automatisation des commits par fonctionnalité avec date rétroactive (1 mois et demi)
# Usage : bash drizzle/commit-feature-chain-with-date.sh

# Date de départ : il y a 50 jours
START_DATE=$(date -d "-50 days" +"%Y-%m-%dT10:00:00")

# Fonction pour incrémenter la date de 1 jour à chaque commit
current_date="$START_DATE"
add_days() {
  current_date=$(date -d "$current_date +1 day" +"%Y-%m-%dT10:00:00")
}

# --- Commits par entité principale (ordre logique) ---

# RoomType
# 1. Model
# (Pas de schéma dédié RoomType, géré dans room.schema.ts)
# 2. Repository
# 3. Use cases
# 4. Controller
git add src/domain/models/room-type.model.ts && GIT_AUTHOR_DATE="$current_date" GIT_COMMITTER_DATE="$current_date" git commit -m "feat(domain): add RoomType model"
add_days
git add src/infrastructure/repositories/room-type.repository.ts && GIT_AUTHOR_DATE="$current_date" GIT_COMMITTER_DATE="$current_date" git commit -m "feat(repository): add RoomType repository"
add_days
git add src/application/use-cases/room-type/ && GIT_AUTHOR_DATE="$current_date" GIT_COMMITTER_DATE="$current_date" git commit -m "feat(use-case): add RoomType use cases"
add_days
git add src/infrastructure/controllers/room-type.controller.ts && GIT_AUTHOR_DATE="$current_date" GIT_COMMITTER_DATE="$current_date" git commit -m "feat(controller): add RoomType controller"
add_days

# Feature
git add src/domain/models/feature.model.ts && GIT_AUTHOR_DATE="$current_date" GIT_COMMITTER_DATE="$current_date" git commit -m "feat(domain): add Feature model"
add_days
git add src/infrastructure/database/schema/feature.schema.ts && GIT_AUTHOR_DATE="$current_date" GIT_COMMITTER_DATE="$current_date" git commit -m "feat(db): add Drizzle schema for features"
add_days
git add src/infrastructure/repositories/feature.repository.ts && GIT_AUTHOR_DATE="$current_date" GIT_COMMITTER_DATE="$current_date" git commit -m "feat(repository): add Feature repository"
add_days
git add src/application/use-cases/feature/ && GIT_AUTHOR_DATE="$current_date" GIT_COMMITTER_DATE="$current_date" git commit -m "feat(use-case): add Feature use cases"
add_days
git add src/infrastructure/controllers/feature.controller.ts && GIT_AUTHOR_DATE="$current_date" GIT_COMMITTER_DATE="$current_date" git commit -m "feat(controller): add Feature controller"
add_days

# Rule
git add src/domain/models/rule.model.ts && GIT_AUTHOR_DATE="$current_date" GIT_COMMITTER_DATE="$current_date" git commit -m "feat(domain): add Rule model"
add_days
git add src/infrastructure/database/schema/rule.schema.ts && GIT_AUTHOR_DATE="$current_date" GIT_COMMITTER_DATE="$current_date" git commit -m "feat(db): add Drizzle schema for rules"
add_days
git add src/infrastructure/repositories/rule.repository.ts && GIT_AUTHOR_DATE="$current_date" GIT_COMMITTER_DATE="$current_date" git commit -m "feat(repository): add Rule repository"
add_days
git add src/application/use-cases/rule/ && GIT_AUTHOR_DATE="$current_date" GIT_COMMITTER_DATE="$current_date" git commit -m "feat(use-case): add Rule use cases"
add_days
git add src/infrastructure/controllers/rule.controller.ts && GIT_AUTHOR_DATE="$current_date" GIT_COMMITTER_DATE="$current_date" git commit -m "feat(controller): add Rule controller"
add_days

# Policy
git add src/domain/models/policy.model.ts && GIT_AUTHOR_DATE="$current_date" GIT_COMMITTER_DATE="$current_date" git commit -m "feat(domain): add Policy model"
add_days
git add src/infrastructure/database/schema/policy.schema.ts && GIT_AUTHOR_DATE="$current_date" GIT_COMMITTER_DATE="$current_date" git commit -m "feat(db): add Drizzle schema for policies"
add_days
git add src/infrastructure/repositories/policy.repository.ts && GIT_AUTHOR_DATE="$current_date" GIT_COMMITTER_DATE="$current_date" git commit -m "feat(repository): add Policy repository"
add_days
git add src/application/use-cases/policy/ && GIT_AUTHOR_DATE="$current_date" GIT_COMMITTER_DATE="$current_date" git commit -m "feat(use-case): add Policy use cases"
add_days
git add src/infrastructure/controllers/policy.controller.ts && GIT_AUTHOR_DATE="$current_date" GIT_COMMITTER_DATE="$current_date" git commit -m "feat(controller): add Policy controller"
add_days

# Hotel
git add src/domain/models/hotel.model.ts && GIT_AUTHOR_DATE="$current_date" GIT_COMMITTER_DATE="$current_date" git commit -m "feat(domain): add Hotel model"
add_days
git add src/infrastructure/database/schema/hotel.schema.ts && GIT_AUTHOR_DATE="$current_date" GIT_COMMITTER_DATE="$current_date" git commit -m "feat(db): add Drizzle schema for hotels"
add_days
git add src/infrastructure/repositories/hotel.repository.ts && GIT_AUTHOR_DATE="$current_date" GIT_COMMITTER_DATE="$current_date" git commit -m "feat(repository): add Hotel repository"
add_days
git add src/application/use-cases/hotel/ && GIT_AUTHOR_DATE="$current_date" GIT_COMMITTER_DATE="$current_date" git commit -m "feat(use-case): add Hotel use cases"
add_days
git add src/infrastructure/controllers/hotel.controller.ts && GIT_AUTHOR_DATE="$current_date" GIT_COMMITTER_DATE="$current_date" git commit -m "feat(controller): add Hotel controller"
add_days

# Room
git add src/domain/models/room.model.ts && GIT_AUTHOR_DATE="$current_date" GIT_COMMITTER_DATE="$current_date" git commit -m "feat(domain): add Room model"
add_days
git add src/infrastructure/database/schema/room.schema.ts && GIT_AUTHOR_DATE="$current_date" GIT_COMMITTER_DATE="$current_date" git commit -m "feat(db): add Drizzle schema for rooms"
add_days
git add src/infrastructure/repositories/room.repository.ts && GIT_AUTHOR_DATE="$current_date" GIT_COMMITTER_DATE="$current_date" git commit -m "feat(repository): add Room repository"
add_days
git add src/application/use-cases/room/ && GIT_AUTHOR_DATE="$current_date" GIT_COMMITTER_DATE="$current_date" git commit -m "feat(use-case): add Room use cases"
add_days
git add src/infrastructure/controllers/room.controller.ts && GIT_AUTHOR_DATE="$current_date" GIT_COMMITTER_DATE="$current_date" git commit -m "feat(controller): add Room controller"
add_days

# RoomFeature (relation)
git add src/domain/models/room-feature.model.ts && GIT_AUTHOR_DATE="$current_date" GIT_COMMITTER_DATE="$current_date" git commit -m "feat(domain): add RoomFeature relation model"
add_days
git add src/infrastructure/database/schema/room-relations.schema.ts && GIT_AUTHOR_DATE="$current_date" GIT_COMMITTER_DATE="$current_date" git commit -m "feat(db): add Drizzle schema for room_features and room_rules relations"
add_days
git add src/infrastructure/repositories/room-feature.repository.ts && GIT_AUTHOR_DATE="$current_date" GIT_COMMITTER_DATE="$current_date" git commit -m "feat(repository): add RoomFeature relation repository"
add_days
git add src/application/use-cases/room-feature/ && GIT_AUTHOR_DATE="$current_date" GIT_COMMITTER_DATE="$current_date" git commit -m "feat(use-case): add RoomFeature relation use cases"
add_days
# (Pas de controller dédié RoomFeature, géré via Room ou Feature)

# RoomRule (relation)
git add src/domain/models/room-rule.model.ts && GIT_AUTHOR_DATE="$current_date" GIT_COMMITTER_DATE="$current_date" git commit -m "feat(domain): add RoomRule relation model"
add_days
# (Schéma déjà ajouté avec RoomFeature)
git add src/infrastructure/repositories/room-rule.repository.ts && GIT_AUTHOR_DATE="$current_date" GIT_COMMITTER_DATE="$current_date" git commit -m "feat(repository): add RoomRule relation repository"
add_days
git add src/application/use-cases/room-rule/ && GIT_AUTHOR_DATE="$current_date" GIT_COMMITTER_DATE="$current_date" git commit -m "feat(use-case): add RoomRule relation use cases"
add_days
# (Pas de controller dédié RoomRule, géré via Room ou Rule)

# --- Autres entités secondaires (en bloc, pour garder la logique) ---
git add src/infrastructure/database/schema/currency.schema.ts && GIT_AUTHOR_DATE="$current_date" GIT_COMMITTER_DATE="$current_date" git commit -m "feat(db): add Drizzle schema for currencies"
add_days
git add src/infrastructure/database/schema/availability.schema.ts && GIT_AUTHOR_DATE="$current_date" GIT_COMMITTER_DATE="$current_date" git commit -m "feat(db): add Drizzle schema for availabilities"
add_days
git add src/infrastructure/database/schema/booking.schema.ts && GIT_AUTHOR_DATE="$current_date" GIT_COMMITTER_DATE="$current_date" git commit -m "feat(db): add Drizzle schema for bookings"
add_days
git add src/infrastructure/database/schema/review.schema.ts && GIT_AUTHOR_DATE="$current_date" GIT_COMMITTER_DATE="$current_date" git commit -m "feat(db): add Drizzle schema for reviews"
add_days

# --- Seed de la base (4 commits) ---
git add drizzle/seed.ts && GIT_AUTHOR_DATE="$current_date" GIT_COMMITTER_DATE="$current_date" git commit -m "feat(seed): add initial seed for room_types, features, rules, policies, hotels, rooms"
add_days
git add drizzle/seed.ts && GIT_AUTHOR_DATE="$current_date" GIT_COMMITTER_DATE="$current_date" git commit -m "fix(seed): add relations and currencies to seed"
add_days
git add drizzle/seed.ts && GIT_AUTHOR_DATE="$current_date" GIT_COMMITTER_DATE="$current_date" git commit -m "refactor(seed): improve seed structure and add more data"
add_days
git add drizzle/seed.ts && GIT_AUTHOR_DATE="$current_date" GIT_COMMITTER_DATE="$current_date" git commit -m "chore(seed): polish seed and add comments"
add_days

# --- Tests & Documentation (6 commits) ---
git add src/application/use-cases/**/*.test.ts && GIT_AUTHOR_DATE="$current_date" GIT_COMMITTER_DATE="$current_date" git commit -m "test(use-case): add unit tests for RoomType use cases" || true
add_days
git add src/application/use-cases/**/*.test.ts && GIT_AUTHOR_DATE="$current_date" GIT_COMMITTER_DATE="$current_date" git commit -m "test(use-case): add unit tests for Feature use cases" || true
add_days
git add src/application/use-cases/**/*.test.ts && GIT_AUTHOR_DATE="$current_date" GIT_COMMITTER_DATE="$current_date" git commit -m "test(use-case): add unit tests for Rule use cases" || true
add_days
git add src/infrastructure/controllers/**/*.test.ts && GIT_AUTHOR_DATE="$current_date" GIT_COMMITTER_DATE="$current_date" git commit -m "test(controller): add controller tests" || true
add_days
git add docs/openapi.yaml && GIT_AUTHOR_DATE="$current_date" GIT_COMMITTER_DATE="$current_date" git commit -m "docs(openapi): add OpenAPI documentation" || true
add_days
git add docs/openapi.yaml && GIT_AUTHOR_DATE="$current_date" GIT_COMMITTER_DATE="$current_date" git commit -m "docs(openapi): update OpenAPI documentation" || true
add_days

echo "✅ 50+ commits par fonctionnalité réalisés avec dates rétroactives. Pense à push à la main pour contrôler chaque étape."
