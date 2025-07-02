import { IUseCase } from '@/domain/types/use-case.type'
import type { Currency } from '@/domain/models/currency.model'
import type { CurrencyRepositoryInterface } from '@/domain/repositories/currency.repository.interface'
import type { ActivityType } from '@/infrastructure/config/activity.config'

type Params = { id: string } & Partial<Omit<Currency, 'id' | 'createdAt' | 'updatedAt'>>

type Response = {
  data: Currency | null
  success: boolean
  error?: string
}

export class UpdateCurrencyUseCase extends IUseCase<Params, Response> {
  log(): ActivityType {
    throw new Error('Method not implemented.')
  }
  constructor(private readonly repository: CurrencyRepositoryInterface) {
    super()
  }

  async execute(params: Params): Promise<Response> {
    try {
      const { id, ...data } = params
      const currency = await this.repository.update(id, data)
      return { data: currency, success: true }
    } catch (error: any) {
      return { success: false, error: error.message, data: null }
    }
  }
}
