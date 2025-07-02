import type { PaymentBase, PaymentStatus } from '../types/payment.type'

export interface PaymentService {
  process: (payment: PaymentBase) => Promise<PaymentStatus>
  getStatus: (paymentId: string) => Promise<PaymentStatus>
}
