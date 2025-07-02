export interface PaymentBase {
  id: string
  reservationId: string
  userId: string
  amount: number
  currency: string
  status: 'pending' | 'paid' | 'failed' | 'refunded'
  method: string
  createdAt: Date
  updatedAt: Date
}

export type PaymentStatus = PaymentBase['status']
