import { IUseCase } from '@/domain/types/use-case.type'
import type { Policy } from '@/domain/models/policy.model'
import type { PolicyRepositoryInterface } from '@/domain/repositories/policy.repository.interface'

export type ListPoliciesResponse = { success: boolean; data: Policy[]; error: string }

export class ListPoliciesUseCase extends IUseCase<{}, ListPoliciesResponse> {
  log(): never {
    throw new Error('Method not implemented.')
  }
  constructor(private readonly policyRepository: PolicyRepositoryInterface) {
    super()
  }

  async execute(): Promise<ListPoliciesResponse> {
    try {
      const policies = await this.policyRepository.findAll()
      return { success: true, data: policies, error: '' }
    } catch (error: any) {
      return { success: false, data: [], error: error.message }
    }
  }
}
