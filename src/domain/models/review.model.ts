import { z } from 'zod'

export const ReviewSchema = z.object({
  id: z.string().uuid(),
  roomId: z.string().uuid(),
  userId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export type Review = z.infer<typeof ReviewSchema>
