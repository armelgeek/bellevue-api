import type { BaseInsertModel, BaseSelectModel, BaseTable } from '../types/drizzle.types'

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export interface BaseRepositoryInterface<T extends BaseTable> {
  findAll: () => Promise<BaseSelectModel<T>[]>
  findById: (id: string) => Promise<BaseSelectModel<T> | null>
  create: (data: BaseInsertModel<T>) => Promise<BaseSelectModel<T>>
  update: (id: string, data: Partial<BaseInsertModel<T>>) => Promise<BaseSelectModel<T> | null>
  delete: (id: string) => Promise<boolean>
}

export interface BaseRepositoryWithPaginationInterface<T extends BaseTable> extends BaseRepositoryInterface<T> {
  findWithPagination: (page: number, limit: number) => Promise<PaginatedResult<BaseSelectModel<T>>>
}
