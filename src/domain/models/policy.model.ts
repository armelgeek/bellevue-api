import { z } from 'zod'

export const PolicySchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['cancellation', 'house']),
  title: z.string().min(1),
  description: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date()
})

export type Policy = z.infer<typeof PolicySchema>
