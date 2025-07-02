import type { Review } from '../models/review.model'

export interface ReviewRepositoryInterface {
  findById: (id: string) => Promise<Review | null>
  findAll: () => Promise<Review[]>
  findAllByRoom: (roomId: string) => Promise<Review[]>
  create: (data: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Review>
  update: (id: string, data: Partial<Omit<Review, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<Review>
  delete: (id: string) => Promise<boolean>
}
