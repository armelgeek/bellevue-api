import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import type { Feature } from '@/domain/models/feature.model'
import type { FeatureRepositoryInterface } from '@/domain/repositories/feature.repository.interface'
import { db } from '../database/db'
import { features } from '../database/schema/feature.schema'

export class FeatureRepository implements FeatureRepositoryInterface {
  async findById(id: string): Promise<Feature | null> {
    const result = await db.select().from(features).where(eq(features.id, id)).limit(1)
    if (!result[0]) return null
    return this.mapToFeature(result[0])
  }

  async findAll(): Promise<Feature[]> {
    const results = await db.select().from(features)
    return results.map(this.mapToFeature)
  }

  async create(data: Omit<Feature, 'id' | 'createdAt' | 'updatedAt'>): Promise<Feature> {
    const now = new Date()
    const id = uuidv4()
    const [result] = await db
      .insert(features)
      .values({
        id,
        name: data.name,
        description: data.description,
        createdAt: now,
        updatedAt: now
      })
      .returning()
    return this.mapToFeature(result)
  }

  async update(id: string, data: Partial<Omit<Feature, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Feature> {
    const [result] = await db
      .update(features)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(features.id, id))
      .returning()
    return this.mapToFeature(result)
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(features).where(eq(features.id, id))
    return result.count > 0
  }

  private mapToFeature(row: any): Feature {
    return {
      id: row.id,
      name: row.name,
      description: row.description || undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    }
  }
}
