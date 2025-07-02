import { IUseCase } from '@/domain/types/use-case.type'
import type { Feature } from '@/domain/models/feature.model'
import type { FeatureRepositoryInterface } from '@/domain/repositories/feature.repository.interface'
import type { ActivityType } from '@/infrastructure/config/activity.config'

export type CreateFeatureParams = Omit<Feature, 'id' | 'createdAt' | 'updatedAt'>
export type CreateFeatureResponse = { success: boolean; data?: Feature; error: string }

export class CreateFeatureUseCase extends IUseCase<CreateFeatureParams, CreateFeatureResponse> {
  constructor(private readonly featureRepository: FeatureRepositoryInterface) {
    super()
  }

  log(): ActivityType {
    throw new Error('Method not implemented.')
  }

  async execute(params: CreateFeatureParams): Promise<CreateFeatureResponse> {
    try {
      const feature = await this.featureRepository.create(params)
      return { success: true, data: feature, error: '' }
    } catch (error: any) {
      return { success: false, error: error.message || 'Unknown error' }
    }
  }
}
