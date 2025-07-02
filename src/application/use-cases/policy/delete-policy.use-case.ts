import { IUseCase } from '@/domain/types/use-case.type'
import type { PolicyRepositoryInterface } from '@/domain/repositories/policy.repository.interface'
import type { ActivityType } from '@/infrastructure/config/activity.config'

export type DeletePolicyParams = { id: string }
export type DeletePolicyResponse = { success: boolean; error: string }

export class DeletePolicyUseCase extends IUseCase<DeletePolicyParams, DeletePolicyResponse> {
  constructor(private readonly policyRepository: PolicyRepositoryInterface) {
    super()
  }

  log(): ActivityType {
    throw new Error('Method not implemented.')
  }

  async execute(params: DeletePolicyParams): Promise<DeletePolicyResponse> {
    try {
      const deleted = await this.policyRepository.delete(params.id)
      if (!deleted) return { success: false, error: 'Policy not found' }
      return { success: true, error: '' }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}
