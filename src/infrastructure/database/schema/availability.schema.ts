import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const availabilities = pgTable('availabilities', {
  id: text('id').primaryKey(),
  roomId: text('room_id').notNull(),
  date: timestamp('date').notNull(),
  isAvailable: boolean('is_available').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})
