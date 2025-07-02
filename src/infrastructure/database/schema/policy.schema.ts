import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const policies = pgTable('policies', {
  id: text('id').primaryKey(),
  type: text('type').notNull(), // cancellation, house
  title: text('title').notNull(),
  description: text('description').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})
