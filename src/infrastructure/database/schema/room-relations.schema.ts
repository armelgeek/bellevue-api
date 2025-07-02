import { pgTable, text } from 'drizzle-orm/pg-core'

export const roomFeatures = pgTable('room_features', {
  roomId: text('room_id').notNull(),
  featureId: text('feature_id').notNull()
})

export const roomRules = pgTable('room_rules', {
  roomId: text('room_id').notNull(),
  ruleId: text('rule_id').notNull()
})
