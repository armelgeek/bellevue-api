import { IUseCase } from '@/domain/types/use-case.type'
import type { Payment } from '@/domain/models/payment.model'
import type { PaymentRepositoryInterface } from '@/domain/repositories/payment.repository.interface'
import type { ActivityType } from '@/infrastructure/config/activity.config'

export type ListPaymentsParams = { bookingId: string }
export type ListPaymentsResponse = { success: boolean; data?: Payment[]; error?: string }

export class ListPaymentsUseCase extends IUseCase<ListPaymentsParams, ListPaymentsResponse> {
  log(): ActivityType {
    throw new Error('Method not implemented.')
  }
  constructor(private readonly paymentRepository: PaymentRepositoryInterface) {
    super()
  }

  async execute(params: ListPaymentsParams): Promise<ListPaymentsResponse> {
    try {
      const payments = await this.paymentRepository.findByBooking(params.bookingId)
      return { success: true, data: payments }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}
