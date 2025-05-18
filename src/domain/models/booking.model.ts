import { z } from 'zod'

export const BookingSchema = z.object({
  id: z.string().uuid(),
  roomId: z.string().uuid(),
  userId: z.string().uuid(),
  startDate: z.date(),
  endDate: z.date(),
  guests: z.number().int().min(1),
  totalPrice: z.number().min(0),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
  createdAt: z.date(),
  updatedAt: z.date()
})

export type Booking = z.infer<typeof BookingSchema>
