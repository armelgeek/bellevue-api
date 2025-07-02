import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import type { Review } from '@/domain/models/review.model'
import type { ReviewRepositoryInterface } from '@/domain/repositories/review.repository.interface'
import { db } from '../database/db'
import { reviews } from '../database/schema/review.schema'

export class ReviewRepository implements ReviewRepositoryInterface {
  async findById(id: string): Promise<Review | null> {
    const result = await db.select().from(reviews).where(eq(reviews.id, id)).limit(1)
    if (!result[0]) return null
    return this.mapToReview(result[0])
  }

  async findAll(): Promise<Review[]> {
    const results = await db.select().from(reviews)
    return results.map(this.mapToReview)
  }

  async findAllByRoom(roomId: string): Promise<Review[]> {
    const results = await db.select().from(reviews).where(eq(reviews.roomId, roomId))
    return results.map(this.mapToReview)
  }

  async create(data: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>): Promise<Review> {
    const now = new Date()
    const id = uuidv4()
    const [result] = await db
      .insert(reviews)
      .values({
        id,
        roomId: data.roomId,
        userId: data.userId,
        rating: data.rating,
        comment: data.comment,
        createdAt: now,
        updatedAt: now
      })
      .returning()
    return this.mapToReview(result)
  }

  async update(id: string, data: Partial<Omit<Review, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Review> {
    const now = new Date()
    await db
      .update(reviews)
      .set({ ...data, updatedAt: now })
      .where(eq(reviews.id, id))
    const [updated] = await db.select().from(reviews).where(eq(reviews.id, id)).limit(1)
    if (!updated) throw new Error('Review not found')
    return this.mapToReview(updated)
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(reviews).where(eq(reviews.id, id))
    return result.count > 0
  }

  private mapToReview(row: any): Review {
    return {
      id: row.id,
      roomId: row.roomId,
      userId: row.userId,
      rating: row.rating,
      comment: row.comment || undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    }
  }
}
