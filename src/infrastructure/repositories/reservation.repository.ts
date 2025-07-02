import { and, count, eq, gte, lte } from 'drizzle-orm'
import { db } from '../database/db'
import { reservations } from '../database/schema/schema'
import type { ReservationRepository } from '../../core/repositories/base.repositories'
import type { ReservationBase } from '../../core/types/reservation.type'

export class DrizzleReservationRepository implements ReservationRepository {
  async create(reservation: ReservationBase): Promise<ReservationBase> {
    const [created] = await db
      .insert(reservations)
      .values({
        id: reservation.id,
        userId: reservation.userId,
        resourceId: reservation.resourceId,
        startDate: reservation.startDate,
        endDate: reservation.endDate,
        status: reservation.status,
        createdAt: reservation.createdAt,
        updatedAt: reservation.updatedAt
      })
      .returning()

    return {
      id: created.id,
      userId: created.userId,
      resourceId: created.resourceId,
      startDate: created.startDate,
      endDate: created.endDate,
      status: created.status,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt
    }
  }

  async update(reservation: ReservationBase): Promise<ReservationBase> {
    const [updated] = await db
      .update(reservations)
      .set({
        userId: reservation.userId,
        resourceId: reservation.resourceId,
        startDate: reservation.startDate,
        endDate: reservation.endDate,
        status: reservation.status,
        updatedAt: new Date()
      })
      .where(eq(reservations.id, reservation.id))
      .returning()

    return {
      id: updated.id,
      userId: updated.userId,
      resourceId: updated.resourceId,
      startDate: updated.startDate,
      endDate: updated.endDate,
      status: updated.status,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt
    }
  }

  async findById(id: string): Promise<ReservationBase | null> {
    const [reservation] = await db.select().from(reservations).where(eq(reservations.id, id))

    if (!reservation) return null

    return {
      id: reservation.id,
      userId: reservation.userId,
      resourceId: reservation.resourceId,
      startDate: reservation.startDate,
      endDate: reservation.endDate,
      status: reservation.status,
      createdAt: reservation.createdAt,
      updatedAt: reservation.updatedAt
    }
  }

  async updateStatus(id: string, status: ReservationBase['status']): Promise<void> {
    await db.update(reservations).set({ status, updatedAt: new Date() }).where(eq(reservations.id, id))
  }

  async findByUserId(userId: string, page = 1, limit = 10): Promise<{ data: ReservationBase[]; total: number }> {
    const offset = (page - 1) * limit

    const [countResult] = await db
      .select({ count: count(reservations.id) })
      .from(reservations)
      .where(eq(reservations.userId, userId))

    const userReservations = await db
      .select()
      .from(reservations)
      .where(eq(reservations.userId, userId))
      .limit(limit)
      .offset(offset)
      .orderBy(reservations.createdAt)

    return {
      data: userReservations.map((reservation) => ({
        id: reservation.id,
        userId: reservation.userId,
        resourceId: reservation.resourceId,
        startDate: reservation.startDate,
        endDate: reservation.endDate,
        status: reservation.status,
        createdAt: reservation.createdAt,
        updatedAt: reservation.updatedAt
      })),
      total: countResult.count
    }
  }

  async checkResourceAvailability(
    resourceId: string,
    startDate: Date,
    endDate: Date,
    excludeReservationId?: string
  ): Promise<boolean> {
    const conditions = [
      eq(reservations.resourceId, resourceId),
      and(lte(reservations.startDate, endDate), gte(reservations.endDate, startDate)),
      eq(reservations.status, 'confirmed' as any)
    ]

    if (excludeReservationId) {
      conditions.push(eq(reservations.id, excludeReservationId))
    }

    const conflictingReservations = await db
      .select()
      .from(reservations)
      .where(and(...conditions))

    return conflictingReservations.length === 0
  }

  async findByResourceAndDateRange(resourceId: string, startDate: Date, endDate: Date): Promise<ReservationBase[]> {
    const overlappingReservations = await db
      .select()
      .from(reservations)
      .where(
        and(
          eq(reservations.resourceId, resourceId),
          lte(reservations.startDate, endDate),
          gte(reservations.endDate, startDate)
        )
      )

    return overlappingReservations.map((reservation) => ({
      id: reservation.id,
      userId: reservation.userId,
      resourceId: reservation.resourceId,
      startDate: reservation.startDate,
      endDate: reservation.endDate,
      status: reservation.status,
      createdAt: reservation.createdAt,
      updatedAt: reservation.updatedAt
    }))
  }
}
