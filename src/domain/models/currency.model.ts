import { z } from 'zod'

export const CurrencySchema = z.object({
  id: z.string().uuid(),
  code: z.string().min(1),
  symbol: z.string().min(1),
  name: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date()
})

export type Currency = z.infer<typeof CurrencySchema>
