import { eq, sql } from 'drizzle-orm'

import type {
  BaseRepositoryWithPaginationInterface,
  PaginatedResult
} from '@/domain/repositories/base.repository.interface'
import type { BaseInsertModel, BaseSelectModel, BaseTable } from '@/domain/types/drizzle.types'
import { db } from '../database/db'

export abstract class BaseRepository<T extends BaseTable> implements BaseRepositoryWithPaginationInterface<T> {
  constructor(protected readonly table: T) {}

  async findAll(): Promise<BaseSelectModel<T>[]> {
    const result = await db.select().from(this.table as any)
    return result as BaseSelectModel<T>[]
  }

  async findById(id: string): Promise<BaseSelectModel<T> | null> {
    const [result] = await db
      .select()
      .from(this.table as any)
      .where(eq(this.table.id as any, id))
    return result ? (result as BaseSelectModel<T>) : null
  }

  async create(data: BaseInsertModel<T>): Promise<BaseSelectModel<T>> {
    const [result] = await db
      .insert(this.table as any)
      .values(data as any)
      .returning()
    return result as BaseSelectModel<T>
  }

  async update(id: string, data: Partial<BaseInsertModel<T>>): Promise<BaseSelectModel<T> | null> {
    const [result] = await db
      .update(this.table as any)
      .set(data as any)
      .where(eq(this.table.id as any, id))
      .returning()
    return result as BaseSelectModel<T> | null
  }

  async delete(id: string): Promise<boolean> {
    const result = await db
      .delete(this.table as any)
      .where(eq(this.table.id as any, id))
      .returning()
    return result.length > 0
  }

  async findWithPagination(page: number, limit: number): Promise<PaginatedResult<BaseSelectModel<T>>> {
    const offset = (page - 1) * limit
    const [countResult] = await db.select({ count: sql<number>`count(*)::int` }).from(this.table as any)
    const count = Number(countResult?.count ?? 0)

    const result = await db
      .select()
      .from(this.table as any)
      .limit(limit)
      .offset(offset)

    return {
      data: result as BaseSelectModel<T>[],
      total: count,
      page,
      limit,
      hasMore: offset + result.length < count
    }
  }
}
