import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import type { Rule } from '@/domain/models/rule.model'
import type { RuleRepositoryInterface } from '@/domain/repositories/rule.repository.interface'
import { db } from '../database/db'
import { rules } from '../database/schema/rule.schema'

export class RuleRepository implements RuleRepositoryInterface {
  async findById(id: string): Promise<Rule | null> {
    const result = await db.select().from(rules).where(eq(rules.id, id)).limit(1)
    if (!result[0]) return null
    return this.mapToRule(result[0])
  }

  async findAll(): Promise<Rule[]> {
    const results = await db.select().from(rules)
    return results.map(this.mapToRule)
  }

  async create(data: Omit<Rule, 'id' | 'createdAt' | 'updatedAt'>): Promise<Rule> {
    const now = new Date()
    const id = uuidv4()
    const [result] = await db
      .insert(rules)
      .values({
        id,
        name: data.name,
        description: data.description,
        createdAt: now,
        updatedAt: now
      })
      .returning()
    return this.mapToRule(result)
  }

  async update(id: string, data: Partial<Omit<Rule, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Rule> {
    const [result] = await db
      .update(rules)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(rules.id, id))
      .returning()
    return this.mapToRule(result)
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(rules).where(eq(rules.id, id))
    return result.count > 0
  }

  private mapToRule(row: any): Rule {
    return {
      id: row.id,
      name: row.name,
      description: row.description || undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    }
  }
}
