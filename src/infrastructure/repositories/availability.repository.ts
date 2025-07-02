import { and, eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import type { Availability } from '@/domain/models/availability.model'
import type { AvailabilityRepositoryInterface } from '@/domain/repositories/availability.repository.interface'
import { db } from '../database/db'
import { availabilities } from '../database/schema/availability.schema'

export class AvailabilityRepository implements AvailabilityRepositoryInterface {
  async findByRoomAndDate(roomId: string, date: Date): Promise<Availability | null> {
    const result = await db
      .select()
      .from(availabilities)
      .where(and(eq(availabilities.roomId, roomId), eq(availabilities.date, date)))
      .limit(1)
    if (!result[0]) return null
    return this.mapToAvailability(result[0])
  }

  async setAvailability(roomId: string, date: Date, isAvailable: boolean): Promise<Availability> {
    // Upsert pattern
    const existing = await this.findByRoomAndDate(roomId, date)
    if (existing) {
      const [result] = await db
        .update(availabilities)
        .set({ isAvailable, updatedAt: new Date() })
        .where(eq(availabilities.id, existing.id))
        .returning()
      return this.mapToAvailability(result)
    } else {
      const now = new Date()
      const id = uuidv4()
      const [result] = await db
        .insert(availabilities)
        .values({
          id,
          roomId,
          date,
          isAvailable,
          createdAt: now,
          updatedAt: now
        })
        .returning()
      return this.mapToAvailability(result)
    }
  }

  async findAllByRoom(roomId: string): Promise<Availability[]> {
    const results = await db.select().from(availabilities).where(eq(availabilities.roomId, roomId))
    return results.map(this.mapToAvailability)
  }

  private mapToAvailability(row: any): Availability {
    return {
      id: row.id,
      roomId: row.roomId,
      date: row.date,
      isAvailable: row.isAvailable,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    }
  }
}
