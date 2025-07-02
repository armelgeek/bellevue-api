import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const roomImages = pgTable('room_images', {
  id: text('id').primaryKey(),
  roomId: text('room_id').notNull(),
  url: text('url').notNull(),
  alt: text('alt'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})
