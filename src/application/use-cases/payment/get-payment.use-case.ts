import { IUseCase } from '@/domain/types/use-case.type'
import type { Payment } from '@/domain/models/payment.model'
import type { PaymentRepositoryInterface } from '@/domain/repositories/payment.repository.interface'
import type { ActivityType } from '@/infrastructure/config/activity.config'

export type GetPaymentParams = { id: string }
export type GetPaymentResponse = { success: boolean; data?: Payment; error?: string }

export class GetPaymentUseCase extends IUseCase<GetPaymentParams, GetPaymentResponse> {
  log(): ActivityType {
    throw new Error('Method not implemented.')
  }
  constructor(private readonly paymentRepository: PaymentRepositoryInterface) {
    super()
  }

  async execute(params: GetPaymentParams): Promise<GetPaymentResponse> {
    try {
      const payment = await this.paymentRepository.findById(params.id)
      if (!payment) return { success: false, error: 'Payment not found' }
      return { success: true, data: payment }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}
