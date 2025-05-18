import { z } from 'zod'

export const RoomSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
  type: z.enum(['single', 'double', 'suite', 'family', 'bnb']),
  capacity: z.number().int().min(1),
  pricePerNight: z.number().min(0),
  currency: z.string().min(1),
  isActive: z.boolean().default(true),
  features: z.array(z.string()).optional(),
  rules: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(), // URLs or ids
  createdAt: z.date(),
  updatedAt: z.date()
})

export type Room = z.infer<typeof RoomSchema>
