import type { Policy } from '../models/policy.model'

export interface PolicyRepositoryInterface {
  findById: (id: string) => Promise<Policy | null>
  findAll: () => Promise<Policy[]>
  create: (data: Omit<Policy, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Policy>
  update: (id: string, data: Partial<Omit<Policy, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<Policy>
  delete: (id: string) => Promise<boolean>
}
