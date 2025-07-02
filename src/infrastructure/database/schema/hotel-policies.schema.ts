import { pgTable, text } from 'drizzle-orm/pg-core'

export const hotelPolicies = pgTable('hotel_policies', {
  hotelId: text('hotel_id').notNull(),
  policyId: text('policy_id').notNull()
})
