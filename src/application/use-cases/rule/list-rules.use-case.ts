import { IUseCase } from '@/domain/types/use-case.type'
import type { Rule } from '@/domain/models/rule.model'
import type { RuleRepositoryInterface } from '@/domain/repositories/rule.repository.interface'
import type { ActivityType } from '@/infrastructure/config/activity.config'

export type ListRulesResponse = { success: boolean; data?: Rule[]; error?: string }

export class ListRulesUseCase extends IUseCase<{}, ListRulesResponse> {
  log(): ActivityType {
    throw new Error('Method not implemented.')
  }

  constructor(private readonly ruleRepository: RuleRepositoryInterface) {
    super()
  }

  async execute(): Promise<ListRulesResponse> {
    try {
      const rules = await this.ruleRepository.findAll()
      return { success: true, data: rules }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}
