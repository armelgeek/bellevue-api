import { IUseCase } from '@/domain/types/use-case.type'
import type { Review } from '@/domain/models/review.model'
import type { ReviewRepositoryInterface } from '@/domain/repositories/review.repository.interface'
import type { ActivityType } from '@/infrastructure/config/activity.config'

export type CreateReviewParams = Omit<Review, 'id' | 'createdAt' | 'updatedAt'>
export type CreateReviewResponse = { success: boolean; data?: Review; error: string }

export class CreateReviewUseCase extends IUseCase<CreateReviewParams, CreateReviewResponse> {
  constructor(private readonly reviewRepository: ReviewRepositoryInterface) {
    super()
  }

  log(): ActivityType {
    throw new Error('Method not implemented.')
  }

  async execute(params: CreateReviewParams): Promise<CreateReviewResponse> {
    try {
      const review = await this.reviewRepository.create(params)
      return { success: true, data: review, error: '' }
    } catch (error: any) {
      return { success: false, error: error.message || 'Unknown error' }
    }
  }
}
