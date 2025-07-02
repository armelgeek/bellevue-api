import { and, eq, gte, lte } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import type { Booking } from '@/domain/models/booking.model'
import type { BookingRepositoryInterface } from '@/domain/repositories/booking.repository.interface'
import { db } from '../database/db'
import { bookings } from '../database/schema/booking.schema'

export class BookingRepository implements BookingRepositoryInterface {
  async findById(id: string): Promise<Booking | null> {
    const result = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1)
    if (!result[0]) return null
    return this.mapToBooking(result[0])
  }

  async findAll(pagination?: { skip: number; limit: number }): Promise<Booking[]> {
    const query = db.select().from(bookings)
    if (pagination?.skip) query.offset(pagination.skip)
    if (pagination?.limit) query.limit(pagination.limit)
    const results = await query
    return results.map(this.mapToBooking)
  }

  async create(data: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<Booking> {
    const now = new Date()
    const id = uuidv4()
    const [result] = await db
      .insert(bookings)
      .values({
        id,
        roomId: data.roomId,
        userId: data.userId,
        startDate: data.startDate,
        endDate: data.endDate,
        guests: data.guests,
        totalPrice: data.totalPrice.toString(),
        status: data.status,
        createdAt: now,
        updatedAt: now
      })
      .returning()
    return this.mapToBooking(result)
  }

  async update(id: string, data: Partial<Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Booking> {
    const [result] = await db
      .update(bookings)
      .set({
        ...data,
        totalPrice: data.totalPrice?.toString(),
        updatedAt: new Date()
      })
      .where(eq(bookings.id, id))
      .returning()
    return this.mapToBooking(result)
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(bookings).where(eq(bookings.id, id))
    return result.count > 0
  }
  async findByRoomAndDate(roomId: string, startDate: Date, endDate: Date): Promise<Booking[]> {
    const results = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.roomId, roomId),
          lte(bookings.startDate, endDate), // La réservation commence avant la fin de la période
          gte(bookings.endDate, startDate) // La réservation se termine après le début de la période
        )
      )

    return results.map(this.mapToBooking)
  }

  private mapToBooking(row: any): Booking {
    return {
      id: row.id,
      roomId: row.roomId,
      userId: row.userId,
      startDate: row.startDate,
      endDate: row.endDate,
      guests: row.guests,
      totalPrice: Number(row.totalPrice),
      status: row.status,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    }
  }
}
