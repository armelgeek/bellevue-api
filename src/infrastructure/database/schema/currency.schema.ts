import { pgTable, text } from 'drizzle-orm/pg-core'

export const currencies = pgTable('currencies', {
  code: text('code').primaryKey(),
  symbol: text('symbol').notNull(),
  name: text('name').notNull()
})
