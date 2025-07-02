import { IUseCase } from '@/domain/types/use-case.type'
import type { ReviewRepositoryInterface } from '@/domain/repositories/review.repository.interface'
import type { ActivityType } from '@/infrastructure/config/activity.config'

export type DeleteReviewParams = { id: string }
export type DeleteReviewResponse = { success: boolean; error: string }

export class DeleteReviewUseCase extends IUseCase<DeleteReviewParams, DeleteReviewResponse> {
  constructor(private readonly reviewRepository: ReviewRepositoryInterface) {
    super()
  }

  log(): ActivityType {
    throw new Error('Method not implemented.')
  }

  async execute(params: DeleteReviewParams): Promise<DeleteReviewResponse> {
    try {
      const deleted = await this.reviewRepository.delete(params.id)
      if (!deleted) return { success: false, error: 'Review not found' }
      return { success: true, error: '' }
    } catch (error: any) {
      return { success: false, error: error.message || 'Unknown error' }
    }
  }
}
