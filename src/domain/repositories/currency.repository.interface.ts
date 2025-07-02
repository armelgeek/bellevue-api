import type { Currency } from '../models/currency.model'

export interface CurrencyRepositoryInterface {
  findById: (id: string) => Promise<Currency | null>
  findAll: (pagination?: { skip: number; limit: number }) => Promise<Currency[]>
  create: (data: Omit<Currency, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Currency>
  update: (id: string, data: Partial<Omit<Currency, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<Currency>
  delete: (id: string) => Promise<boolean>
}
