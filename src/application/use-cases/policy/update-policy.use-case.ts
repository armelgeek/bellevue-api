import { IUseCase } from '@/domain/types/use-case.type'
import type { Policy } from '@/domain/models/policy.model'
import type { PolicyRepositoryInterface } from '@/domain/repositories/policy.repository.interface'
import type { ActivityType } from '@/infrastructure/config/activity.config'

export type UpdatePolicyParams = { id: string } & Partial<Omit<Policy, 'id' | 'createdAt' | 'updatedAt'>>
export type UpdatePolicyResponse = { success: boolean; data: Policy; error: string }

export class UpdatePolicyUseCase extends IUseCase<UpdatePolicyParams, UpdatePolicyResponse> {
  constructor(private readonly policyRepository: PolicyRepositoryInterface) {
    super()
  }

  log(): ActivityType {
    throw new Error('Method not implemented.')
  }

  async execute(params: UpdatePolicyParams): Promise<UpdatePolicyResponse> {
    try {
      const policy = await this.policyRepository.update(params.id, params)
      return { success: true, data: policy, error: '' }
    } catch (error: any) {
      return {
        success: false,
        data: {
          id: '',
          type: 'cancellation',
          description: '',
          title: '',
          createdAt: new Date(),
          updatedAt: new Date()
        } satisfies Policy,
        error: error.message
      }
    }
  }
}
