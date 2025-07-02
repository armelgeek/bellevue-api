import { IUseCase } from '@/domain/types/use-case.type'
import type { Currency } from '@/domain/models/currency.model'
import type { CurrencyRepositoryInterface } from '@/domain/repositories/currency.repository.interface'
import type { ActivityType } from '@/infrastructure/config/activity.config'

export class ListCurrenciesUseCase extends IUseCase<{}, { success: boolean; data: Currency[]; error?: string }> {
  log(): ActivityType {
    throw new Error('Method not implemented.')
  }
  constructor(private readonly repository: CurrencyRepositoryInterface) {
    super()
  }

  async execute(): Promise<{ success: boolean; data: Currency[]; error?: string }> {
    try {
      const currencies = await this.repository.findAll()
      return { success: true, data: currencies }
    } catch (error: any) {
      return { success: false, data: [], error: error.message }
    }
  }
}
