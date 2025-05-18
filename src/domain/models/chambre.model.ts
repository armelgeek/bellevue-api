import { z } from 'zod'

export const ChambreSchema = z.object({
  id: z.string().uuid(),
  numero: z.string().min(1),
  type: z.string().min(1), // ex: simple, double, suite
  description: z.string().optional(),
  prix: z.number().nonnegative(),
  capacite: z.number().int().positive(),
  images: z.array(z.string().url()).optional(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export type Chambre = z.infer<typeof ChambreSchema>
