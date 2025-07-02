import { IUseCase } from '@/domain/types/use-case.type'
import type { CurrencyRepositoryInterface } from '@/domain/repositories/currency.repository.interface'
import type { ActivityType } from '@/infrastructure/config/activity.config'

type Params = { id: string }

type Response = {
  success: boolean
  error?: string
}

export class DeleteCurrencyUseCase extends IUseCase<Params, Response> {
  log(): ActivityType {
    throw new Error('Method not implemented.')
  }
  constructor(private readonly repository: CurrencyRepositoryInterface) {
    super()
  }

  async execute(params: Params): Promise<Response> {
    try {
      const deleted = await this.repository.delete(params.id)
      if (!deleted) return { success: false, error: 'Currency not found' }
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}
