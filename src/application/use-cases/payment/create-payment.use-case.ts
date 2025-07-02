import { IUseCase } from '@/domain/types/use-case.type'
import type { Payment } from '@/domain/models/payment.model'
import type { PaymentRepositoryInterface } from '@/domain/repositories/payment.repository.interface'
import type { ActivityType } from '@/infrastructure/config/activity.config'

export type CreatePaymentParams = Omit<Payment, 'id' | 'createdAt' | 'updatedAt' | 'status'> & {
  status?: Payment['status']
}
export type CreatePaymentResponse = { success: boolean; data?: Payment; error?: string }

export class CreatePaymentUseCase extends IUseCase<CreatePaymentParams, CreatePaymentResponse> {
  log(): ActivityType {
    throw new Error('Method not implemented.')
  }
  constructor(private readonly paymentRepository: PaymentRepositoryInterface) {
    super()
  }

  async execute(params: CreatePaymentParams): Promise<CreatePaymentResponse> {
    try {
      const payment = await this.paymentRepository.create({ ...params, status: params.status ?? 'pending' })
      return { success: true, data: payment }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}
