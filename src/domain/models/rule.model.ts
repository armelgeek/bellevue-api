import { z } from 'zod'

export const RuleSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export type Rule = z.infer<typeof RuleSchema>
