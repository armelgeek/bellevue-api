import { IUseCase } from '@/domain/types/use-case.type'
import type { Policy } from '@/domain/models/policy.model'
import type { PolicyRepositoryInterface } from '@/domain/repositories/policy.repository.interface'
import type { ActivityType } from '@/infrastructure/config/activity.config'

export type GetPolicyParams = { id: string }
export type GetPolicyResponse = { success: boolean; data: Policy; error: string }

export class GetPolicyUseCase extends IUseCase<GetPolicyParams, GetPolicyResponse> {
  constructor(private readonly policyRepository: PolicyRepositoryInterface) {
    super()
  }

  log(): ActivityType {
    throw new Error('Method not implemented.')
  }

  async execute(params: GetPolicyParams): Promise<GetPolicyResponse> {
    try {
      const policy = await this.policyRepository.findById(params.id)
      if (!policy) {
        const errorResponse: GetPolicyResponse = {
          success: false,
          data: {
            id: '',
            type: 'cancellation',
            description: '',
            title: '',
            createdAt: new Date(0),
            updatedAt: new Date(0)
          } satisfies Policy,
          error: 'Policy not found'
        }
        return errorResponse
      }
      return { success: true, data: policy, error: '' }
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        data: {
          id: '',
          type: 'cancellation',
          description: '',
          title: '',
          createdAt: new Date(0),
          updatedAt: new Date(0)
        } satisfies Policy
      }
    }
  }
}
