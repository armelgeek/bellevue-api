import { IUseCase } from '@/domain/types/use-case.type'
import type { Currency } from '@/domain/models/currency.model'
import type { CurrencyRepositoryInterface } from '@/domain/repositories/currency.repository.interface'
import type { ActivityType } from '@/infrastructure/config/activity.config'

type Params = Omit<Currency, 'id' | 'createdAt' | 'updatedAt'>

type Response = {
  data: Currency | null
  success: boolean
  error?: string
}

export class CreateCurrencyUseCase extends IUseCase<Params, Response> {
  log(): ActivityType {
    throw new Error('Method not implemented.')
  }
  constructor(private readonly repository: CurrencyRepositoryInterface) {
    super()
  }

  async execute(params: Params): Promise<Response> {
    try {
      const currency = await this.repository.create(params)
      return { data: currency, success: true }
    } catch (error: any) {
      return { success: false, error: error.message, data: null }
    }
  }
}
