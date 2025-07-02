import { IUseCase } from '@/domain/types/use-case.type'
import type { Feature } from '@/domain/models/feature.model'
import type { FeatureRepositoryInterface } from '@/domain/repositories/feature.repository.interface'
import type { ActivityType } from '@/infrastructure/config/activity.config'

export type UpdateFeatureParams = { id: string } & Partial<Omit<Feature, 'id' | 'createdAt' | 'updatedAt'>>
export type UpdateFeatureResponse = { success: boolean; data?: Feature; error: string }

export class UpdateFeatureUseCase extends IUseCase<UpdateFeatureParams, UpdateFeatureResponse> {
  constructor(private readonly featureRepository: FeatureRepositoryInterface) {
    super()
  }

  log(): ActivityType {
    throw new Error('Method not implemented.')
  }

  async execute(params: UpdateFeatureParams): Promise<UpdateFeatureResponse> {
    try {
      const feature = await this.featureRepository.update(params.id, params)
      return { success: true, data: feature, error: '' }
    } catch (error: any) {
      return { success: false, error: error.message || 'Unknown error' }
    }
  }
}
