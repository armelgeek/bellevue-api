import { IUseCase } from '@/domain/types/use-case.type'
import type { Policy } from '@/domain/models/policy.model'
import type { PolicyRepositoryInterface } from '@/domain/repositories/policy.repository.interface'
import type { ActivityType } from '@/infrastructure/config/activity.config'

export type CreatePolicyParams = Omit<Policy, 'id' | 'createdAt' | 'updatedAt'>
export type CreatePolicyResponse = { success: boolean; data: Policy; error: string }

export class CreatePolicyUseCase extends IUseCase<CreatePolicyParams, CreatePolicyResponse> {
  constructor(private readonly policyRepository: PolicyRepositoryInterface) {
    super()
  }

  log(): ActivityType {
    throw new Error('Method not implemented.')
  }

  async execute(params: CreatePolicyParams): Promise<CreatePolicyResponse> {
    try {
      const policy = await this.policyRepository.create(params)
      return { success: true, data: policy, error: '' }
    } catch (error: any) {
      const emptyPolicy: Policy = {
        id: '',
        type: 'cancellation',
        description: '',
        title: '',
        createdAt: new Date(),
        updatedAt: new Date()
      } satisfies Policy
      return { success: false, data: emptyPolicy, error: error.message }
    }
  }
}
