import type { Rule } from '../models/rule.model'

export interface RuleRepositoryInterface {
  findById: (id: string) => Promise<Rule | null>
  findAll: () => Promise<Rule[]>
  create: (data: Omit<Rule, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Rule>
  update: (id: string, data: Partial<Omit<Rule, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<Rule>
  delete: (id: string) => Promise<boolean>
}
