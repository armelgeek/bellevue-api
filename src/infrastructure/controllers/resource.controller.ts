import type {
  PaginatedResourceResponse,
  ResourceAvailabilityCheck,
  ResourceBase,
  ResourceListFilters
} from '../../core/types/resource.type'
import type { ResourceRepository } from '../../domain/repositories/resource.repository.interface'

export class ResourceController {
  constructor(private readonly resourceRepository: ResourceRepository) {}

  async createResource(): Promise<ResourceBase> {
    return await this.resourceRepository.create({})
  }

  async getResourceById(id: string): Promise<ResourceBase | null> {
    return await this.resourceRepository.findById(id)
  }

  async getAllResources(): Promise<ResourceBase[]> {
    return await this.resourceRepository.findAll()
  }

  async getAllResourcesPaginated(filters: ResourceListFilters): Promise<PaginatedResourceResponse> {
    return await this.resourceRepository.findAllPaginated(filters)
  }

  async updateResource(id: string, data: Partial<ResourceBase>): Promise<ResourceBase | null> {
    return await this.resourceRepository.update(id, data)
  }

  async deleteResource(id: string): Promise<{ message: string; success: boolean }> {
    const success = await this.resourceRepository.delete(id)
    return {
      message: success ? 'Resource deleted successfully' : 'Resource not found',
      success
    }
  }

  async checkResourceAvailability(params: ResourceAvailabilityCheck): Promise<{ isAvailable: boolean }> {
    const startDate = new Date(params.startDate)
    const endDate = new Date(params.endDate)
    const isAvailable = await this.resourceRepository.checkAvailability(params.resourceId, startDate, endDate)
    return { isAvailable }
  }

  async getResourceAvailabilities(resourceId: string, startDate: string, endDate: string) {
    const start = new Date(startDate)
    const end = new Date(endDate)
    return await this.resourceRepository.getAvailabilities(resourceId, start, end)
  }
}
