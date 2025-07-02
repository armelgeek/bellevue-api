import { IUseCase } from '@/domain/types/use-case.type'
import type { Review } from '@/domain/models/review.model'
import type { ReviewRepositoryInterface } from '@/domain/repositories/review.repository.interface'
import type { ActivityType } from '@/infrastructure/config/activity.config'

export type UpdateReviewParams = { id: string } & Partial<Omit<Review, 'id' | 'createdAt' | 'updatedAt'>>
export type UpdateReviewResponse = { success: boolean; data?: Review; error: string }

export class UpdateReviewUseCase extends IUseCase<UpdateReviewParams, UpdateReviewResponse> {
  constructor(private readonly reviewRepository: ReviewRepositoryInterface) {
    super()
  }

  log(): ActivityType {
    throw new Error('Method not implemented.')
  }

  async execute(params: UpdateReviewParams): Promise<UpdateReviewResponse> {
    try {
      const review = await this.reviewRepository.update(params.id, params)
      return { success: true, data: review, error: '' }
    } catch (error: any) {
      return { success: false, error: error.message || 'Unknown error' }
    }
  }
}
