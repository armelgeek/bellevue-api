import { IUseCase } from '@/domain/types/use-case.type'
import type { Feature } from '@/domain/models/feature.model'
import type { FeatureRepositoryInterface } from '@/domain/repositories/feature.repository.interface'
import type { ActivityType } from '@/infrastructure/config/activity.config'

export type ListFeaturesResponse = { success: boolean; data?: Feature[]; error: string }

export class ListFeaturesUseCase extends IUseCase<{}, ListFeaturesResponse> {
  log(): ActivityType {
    throw new Error('Method not implemented.')
  }
  constructor(private readonly featureRepository: FeatureRepositoryInterface) {
    super()
  }

  async execute(): Promise<ListFeaturesResponse> {
    try {
      const features = await this.featureRepository.findAll()
      return { success: true, data: features, error: '' }
    } catch (error: any) {
      return { success: false, error: error.message || 'Unknown error' }
    }
  }
}
