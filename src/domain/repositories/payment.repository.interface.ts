import type { Payment } from '../models/payment.model'

export interface PaymentRepositoryInterface {
  findById: (id: string) => Promise<Payment | null>
  findByBooking: (bookingId: string) => Promise<Payment[]>
  create: (data: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Payment>
  update: (id: string, data: Partial<Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<Payment>
}
