import { IUseCase } from '@/domain/types/use-case.type'
import type { Review } from '@/domain/models/review.model'
import type { ReviewRepositoryInterface } from '@/domain/repositories/review.repository.interface'
import type { ActivityType } from '@/infrastructure/config/activity.config'

export type GetReviewParams = { id: string }
export type GetReviewResponse = { success: boolean; data?: Review; error: string }

export class GetReviewUseCase extends IUseCase<GetReviewParams, GetReviewResponse> {
  constructor(private readonly reviewRepository: ReviewRepositoryInterface) {
    super()
  }

  log(): ActivityType {
    throw new Error('Method not implemented.')
  }

  async execute(params: GetReviewParams): Promise<GetReviewResponse> {
    try {
      const review = await this.reviewRepository.findById(params.id)
      if (!review) return { success: false, error: 'Review not found' }
      return { success: true, data: review, error: '' }
    } catch (error: any) {
      return { success: false, error: error.message || 'Unknown error' }
    }
  }
}
