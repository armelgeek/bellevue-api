import { randomUUID } from 'node:crypto'
import { eq } from 'drizzle-orm'
import type { RoomType } from '@/domain/models/room-type.model'
import type { RoomTypeRepositoryInterface } from '@/domain/repositories/room-type.repository.interface'
import { db } from '../database/db'
import { roomTypes } from '../database/schema/schema'

export class RoomTypeRepository implements RoomTypeRepositoryInterface {
  async findById(id: string): Promise<RoomType | null> {
    const result = await db.query.roomTypes.findFirst({ where: eq(roomTypes.id, id) })
    if (!result) return null
    return this.mapToRoomType(result)
  }

  async findAll(): Promise<RoomType[]> {
    const results = await db.query.roomTypes.findMany()
    return results.map(this.mapToRoomType)
  }

  async create(data: Omit<RoomType, 'id' | 'createdAt' | 'updatedAt'>): Promise<RoomType> {
    const now = new Date()
    const toInsert = {
      id: randomUUID(),
      name: data.name,
      description: data.description ?? null,
      createdAt: now,
      updatedAt: now
    }
    const [result] = await db.insert(roomTypes).values(toInsert).returning()
    return this.mapToRoomType(result)
  }

  async update(id: string, data: Partial<Omit<RoomType, 'id' | 'createdAt' | 'updatedAt'>>): Promise<RoomType> {
    const [result] = await db
      .update(roomTypes)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(roomTypes.id, id))
      .returning()
    return this.mapToRoomType(result)
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(roomTypes).where(eq(roomTypes.id, id)).returning()
    return result.length > 0
  }

  private mapToRoomType(row: any): RoomType {
    return {
      id: row.id,
      name: row.name,
      description: row.description || undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    }
  }
}
