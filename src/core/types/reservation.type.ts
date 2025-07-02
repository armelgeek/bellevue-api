export interface ReservationBase {
  id: string
  userId: string
  resourceId: string
  startDate: Date
  endDate: Date
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  createdAt: Date
  updatedAt: Date
}

export type ReservationStatus = ReservationBase['status']
