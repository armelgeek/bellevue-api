import { z } from 'zod'

export const ReservationSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  chambreId: z.string().uuid(),
  dateDebut: z.date(),
  dateFin: z.date(),
  statut: z.enum(['en_attente', 'confirmee', 'annulee']),
  montant: z.number().nonnegative(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export type Reservation = z.infer<typeof ReservationSchema>
