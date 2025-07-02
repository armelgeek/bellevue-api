import { z } from 'zod'

export const ReservationSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  resourceId: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const PaymentSchema = z.object({
  id: z.string().uuid(),
  reservationId: z.string().uuid(),
  userId: z.string().uuid(),
  amount: z.number().positive(),
  currency: z.string().length(3),
  status: z.enum(['pending', 'paid', 'failed', 'refunded']),
  method: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
})
