import { numeric, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const payments = pgTable('payments', {
  id: text('id').primaryKey(),
  bookingId: text('booking_id').notNull(),
  userId: text('user_id').notNull(),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').notNull(),
  status: text('status').notNull(), // pending, succeeded, failed, refunded
  provider: text('provider').notNull(),
  providerPaymentId: text('provider_payment_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})
