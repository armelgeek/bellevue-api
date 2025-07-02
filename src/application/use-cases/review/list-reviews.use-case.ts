import { IUseCase } from '@/domain/types/use-case.type'
import type { Review } from '@/domain/models/review.model'
import type { ReviewRepositoryInterface } from '@/domain/repositories/review.repository.interface'
import type { ActivityType } from '@/infrastructure/config/activity.config'

export type ListReviewsResponse = { success: boolean; data?: Review[]; error: string }

export class ListReviewsUseCase extends IUseCase<{}, ListReviewsResponse> {
  constructor(private readonly reviewRepository: ReviewRepositoryInterface) {
    super()
  }

  log(): ActivityType {
    throw new Error('Method not implemented.')
  }

  async execute(): Promise<ListReviewsResponse> {
    try {
      const reviews = await this.reviewRepository.findAll()
      return { success: true, data: reviews, error: '' }
    } catch (error: any) {
      return { success: false, error: error.message || 'Unknown error' }
    }
  }
}
