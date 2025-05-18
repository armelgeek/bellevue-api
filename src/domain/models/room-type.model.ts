import { z } from 'zod'

export const RoomTypeSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export type RoomType = z.infer<typeof RoomTypeSchema>
