import { z } from 'zod'

export const RoomImageSchema = z.object({
  id: z.string().uuid(),
  roomId: z.string().uuid(),
  url: z.string().url(),
  alt: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export type RoomImage = z.infer<typeof RoomImageSchema>
