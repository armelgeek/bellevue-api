import type { Feature } from '../models/feature.model'

export interface FeatureRepositoryInterface {
  findById: (id: string) => Promise<Feature | null>
  findAll: () => Promise<Feature[]>
  create: (data: Omit<Feature, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Feature>
  update: (id: string, data: Partial<Omit<Feature, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<Feature>
  delete: (id: string) => Promise<boolean>
}
