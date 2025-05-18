import { z } from 'zod'

export const HotelSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
  address: z.string().min(1),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  images: z.array(z.string()).optional(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export type Hotel = z.infer<typeof HotelSchema>
