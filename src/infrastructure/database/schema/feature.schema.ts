import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const features = pgTable('features', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})
