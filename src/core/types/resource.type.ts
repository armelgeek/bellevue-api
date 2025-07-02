export interface ResourceBase {
  id: string
  createdAt: Date
}

export interface ResourceAvailability {
  resourceId: string
  startDate: Date
  endDate: Date
  isAvailable: boolean
}

export interface ResourceAvailabilityCheck {
  resourceId: string
  startDate: string
  endDate: string
}

export interface ResourceListFilters {
  page?: number
  limit?: number
  startDate?: string
  endDate?: string
  availableOnly?: boolean
}

export interface PaginatedResourceResponse {
  resources: ResourceBase[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
