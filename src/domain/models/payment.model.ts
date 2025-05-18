import { z } from 'zod'

export const PaymentSchema = z.object({
  id: z.string().uuid(),
  bookingId: z.string().uuid(),
  userId: z.string().uuid(),
  amount: z.number().min(0),
  currency: z.string().min(1),
  status: z.enum(['pending', 'succeeded', 'failed', 'refunded']),
  provider: z.string(), // e.g. 'stripe'
  providerPaymentId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export type Payment = z.infer<typeof PaymentSchema>
