import { randomUUID } from 'node:crypto'
import { eq } from 'drizzle-orm'
import type { Currency } from '@/domain/models/currency.model'
import type { CurrencyRepositoryInterface } from '@/domain/repositories/currency.repository.interface'
import { db } from '../database/db'
import { currencies } from '../database/schema/schema'

export class CurrencyRepository implements CurrencyRepositoryInterface {
  async findById(id: string): Promise<Currency | null> {
    const result = await db.query.currencies.findFirst({ where: eq(currencies.id, id) })
    if (!result) return null
    return this.mapToCurrency(result)
  }

  async findAll(): Promise<Currency[]> {
    const results = await db.query.currencies.findMany()
    return results.map(this.mapToCurrency)
  }

  async create(data: Omit<Currency, 'id' | 'createdAt' | 'updatedAt'>): Promise<Currency> {
    const now = new Date()
    const toInsert = { ...data, id: randomUUID(), createdAt: now, updatedAt: now }
    const [result] = await db.insert(currencies).values(toInsert).returning()
    return this.mapToCurrency(result)
  }

  async update(id: string, data: Partial<Omit<Currency, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Currency> {
    const [result] = await db
      .update(currencies)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(currencies.id, id))
      .returning()
    return this.mapToCurrency(result)
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(currencies).where(eq(currencies.id, id)).returning()
    return result.length > 0
  }

  private mapToCurrency(row: any): Currency {
    return {
      id: row.id,
      code: row.code,
      name: row.name,
      symbol: row.symbol,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    }
  }
}
