import { z } from 'zod'

export const AvailabilitySchema = z.object({
  id: z.string().uuid(),
  roomId: z.string().uuid(),
  date: z.date(),
  isAvailable: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export type Availability = z.infer<typeof AvailabilitySchema>
