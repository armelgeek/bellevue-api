import { eq, inArray, sql } from 'drizzle-orm'
import { db } from '../database/db'
import { reservations, resources } from '../database/schema/schema'
import type {
  PaginatedResourceResponse,
  ResourceAvailability,
  ResourceBase,
  ResourceListFilters
} from '../../core/types/resource.type'
import type { ResourceRepository } from '../../domain/repositories/resource.repository.interface'

export class DrizzleResourceRepository implements ResourceRepository {
  async create(): Promise<ResourceBase> {
    const [created] = await db.insert(resources).values({}).returning()
    return { ...created, createdAt: created.createdAt || new Date() }
  }

  async findById(id: string): Promise<ResourceBase | null> {
    const [resource] = await db.select().from(resources).where(eq(resources.id, id))
    return resource ? { ...resource, createdAt: resource.createdAt || new Date() } : null
  }

  async findAll(): Promise<ResourceBase[]> {
    return (await db.select().from(resources)).map((resource) => ({
      ...resource,
      createdAt: resource.createdAt || new Date()
    }))
  }

  async findAllPaginated(filters: ResourceListFilters): Promise<PaginatedResourceResponse> {
    const page = filters.page || 1
    const limit = filters.limit || 10
    const offset = (page - 1) * limit

    if (filters.availableOnly && filters.startDate && filters.endDate) {
      const startDate = new Date(filters.startDate)
      const endDate = new Date(filters.endDate)

      const availableResourceIds = await this.getAvailableResourceIds(startDate, endDate)

      if (availableResourceIds.length === 0) {
        return {
          resources: [],
          pagination: {
            page,
            limit,
            total: 0,
            totalPages: 0
          }
        }
      }

      const [resourcesList, totalCount] = await Promise.all([
        db.select().from(resources).where(inArray(resources.id, availableResourceIds)).limit(limit).offset(offset),
        db
          .select({ count: sql<number>`count(*)` })
          .from(resources)
          .where(inArray(resources.id, availableResourceIds))
      ])

      const total = totalCount[0]?.count || 0
      const totalPages = Math.ceil(total / limit)

      return {
        resources: resourcesList.map((resource) => ({
          id: resource.id,
          createdAt: resource.createdAt || new Date()
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages
        }
      }
    }

    const [resourcesList, totalCount] = await Promise.all([
      db.select().from(resources).limit(limit).offset(offset),
      db.select({ count: sql<number>`count(*)` }).from(resources)
    ])

    const total = totalCount[0]?.count || 0
    const totalPages = Math.ceil(total / limit)

    return {
      resources: resourcesList.map((resource) => ({
        id: resource.id,
        createdAt: resource.createdAt || new Date()
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    }
  }

  private async getAvailableResourceIds(startDate: Date, endDate: Date): Promise<string[]> {
    const allResources = await db.select({ id: resources.id }).from(resources)
    const availableIds: string[] = []

    for (const resource of allResources) {
      const isAvailable = await this.checkAvailability(resource.id, startDate, endDate)
      if (isAvailable) {
        availableIds.push(resource.id)
      }
    }

    return availableIds
  }

  async update(id: string, data: Partial<ResourceBase>): Promise<ResourceBase | null> {
    const [updated] = await db
      .update(resources)
      .set({ ...data })
      .where(eq(resources.id, id))
      .returning()
    return updated ? { ...updated, createdAt: updated.createdAt || new Date() } : null
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(resources).where(eq(resources.id, id))
    return result.length > 0
  }

  async checkAvailability(resourceId: string, startDate: Date, endDate: Date): Promise<boolean> {
    const conflictingReservations = await db.select().from(reservations).where(eq(reservations.resourceId, resourceId))

    const hasConflict = conflictingReservations.some((reservation) => {
      const reservationStart = new Date(reservation.startDate)
      const reservationEnd = new Date(reservation.endDate)
      return (
        (startDate >= reservationStart && startDate < reservationEnd) ||
        (endDate > reservationStart && endDate <= reservationEnd) ||
        (startDate <= reservationStart && endDate >= reservationEnd)
      )
    })

    return !hasConflict
  }

  async getAvailabilities(resourceId: string, startDate: Date, endDate: Date): Promise<ResourceAvailability[]> {
    const reservationsInPeriod = await db.select().from(reservations).where(eq(reservations.resourceId, resourceId))

    const availabilities: ResourceAvailability[] = []
    let currentDate = new Date(startDate)

    while (currentDate < endDate) {
      const nextDay = new Date(currentDate)
      nextDay.setDate(nextDay.getDate() + 1)

      const isAvailable = !reservationsInPeriod.some((reservation) => {
        const reservationStart = new Date(reservation.startDate)
        const reservationEnd = new Date(reservation.endDate)
        return currentDate >= reservationStart && currentDate < reservationEnd
      })

      availabilities.push({
        resourceId,
        startDate: new Date(currentDate),
        endDate: new Date(nextDay),
        isAvailable
      })

      currentDate = nextDay
    }

    return availabilities
  }
}
