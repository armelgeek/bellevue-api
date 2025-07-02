import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const hotels = pgTable('hotels', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  address: text('address').notNull(),
  phone: text('phone'),
  email: text('email'),
  images: text('images'), // JSON stringified array
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})
