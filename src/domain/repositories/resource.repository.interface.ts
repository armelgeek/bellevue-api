import type {
  PaginatedResourceResponse,
  ResourceAvailability,
  ResourceBase,
  ResourceListFilters
} from '../../core/types/resource.type'

export interface ResourceRepository {
  create: (data: Omit<ResourceBase, 'id' | 'createdAt'>) => Promise<ResourceBase>
  findById: (id: string) => Promise<ResourceBase | null>
  findAll: () => Promise<ResourceBase[]>
  findAllPaginated: (filters: ResourceListFilters) => Promise<PaginatedResourceResponse>
  update: (id: string, data: Partial<ResourceBase>) => Promise<ResourceBase | null>
  delete: (id: string) => Promise<boolean>
  checkAvailability: (resourceId: string, startDate: Date, endDate: Date) => Promise<boolean>
  getAvailabilities: (resourceId: string, startDate: Date, endDate: Date) => Promise<ResourceAvailability[]>
}
