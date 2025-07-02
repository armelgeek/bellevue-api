import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import type { Policy } from '@/domain/models/policy.model'
import type { PolicyRepositoryInterface } from '@/domain/repositories/policy.repository.interface'
import { db } from '../database/db'
import { policies } from '../database/schema/policy.schema'

export class PolicyRepository implements PolicyRepositoryInterface {
  async findById(id: string): Promise<Policy | null> {
    const result = await db.select().from(policies).where(eq(policies.id, id)).limit(1)
    if (!result[0]) return null
    return this.mapToPolicy(result[0])
  }

  async findAll(): Promise<Policy[]> {
    const results = await db.select().from(policies)
    return results.map(this.mapToPolicy)
  }

  async create(data: Omit<Policy, 'id' | 'createdAt' | 'updatedAt'>): Promise<Policy> {
    const now = new Date()
    const id = uuidv4()
    const [result] = await db
      .insert(policies)
      .values({
        id,
        type: data.type,
        title: data.title,
        description: data.description,
        createdAt: now,
        updatedAt: now
      })
      .returning()
    return this.mapToPolicy(result)
  }

  async update(id: string, data: Partial<Omit<Policy, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Policy> {
    const [result] = await db
      .update(policies)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(policies.id, id))
      .returning()
    return this.mapToPolicy(result)
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(policies).where(eq(policies.id, id))
    return result.count > 0
  }

  private mapToPolicy(row: any): Policy {
    return {
      id: row.id,
      type: row.type,
      title: row.title,
      description: row.description,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    }
  }
}
