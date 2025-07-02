import { IUseCase } from '@/domain/types/use-case.type'
import type { FeatureRepositoryInterface } from '@/domain/repositories/feature.repository.interface'
import type { ActivityType } from '@/infrastructure/config/activity.config'

export type DeleteFeatureParams = { id: string }
export type DeleteFeatureResponse = { success: boolean; error: string }

export class DeleteFeatureUseCase extends IUseCase<DeleteFeatureParams, DeleteFeatureResponse> {
  constructor(private readonly featureRepository: FeatureRepositoryInterface) {
    super()
  }

  log(): ActivityType {
    throw new Error('Method not implemented.')
  }

  async execute(params: DeleteFeatureParams): Promise<DeleteFeatureResponse> {
    try {
      const deleted = await this.featureRepository.delete(params.id)
      if (!deleted) return { success: false, error: 'Feature not found' }
      return { success: true, error: '' }
    } catch (error: any) {
      return { success: false, error: error.message || 'Unknown error' }
    }
  }
}
