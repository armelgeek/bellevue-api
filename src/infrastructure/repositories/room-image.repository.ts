import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { db } from '@/infrastructure/database/db'
import { roomImages } from '@/infrastructure/database/schema'
import type { RoomImage } from '@/domain/models/room-image.model'
import type { RoomImageRepositoryInterface } from '@/domain/repositories/room-image.repository.interface'

export class RoomImageRepository implements RoomImageRepositoryInterface {
  async findById(id: string): Promise<RoomImage | null> {
    const result = await db.query.roomImages.findFirst({ where: eq(roomImages.id, id) })
    if (!result) return null
    return this.mapToRoomImage(result)
  }

  async findAll(): Promise<RoomImage[]> {
    const results = await db.query.roomImages.findMany()
    return results.map(this.mapToRoomImage)
  }

  async findAllByRoom(roomId: string): Promise<RoomImage[]> {
    const results = await db.query.roomImages.findMany({ where: eq(roomImages.roomId, roomId) })
    return results.map(this.mapToRoomImage)
  }

  async create(data: Omit<RoomImage, 'id' | 'createdAt' | 'updatedAt'>): Promise<RoomImage> {
    const now = new Date()
    const id = uuidv4()
    const toInsert = { ...data, id, createdAt: now, updatedAt: now }
    await db.insert(roomImages).values(toInsert)
    return { ...toInsert }
  }

  async update(id: string, data: Partial<Omit<RoomImage, 'id' | 'createdAt' | 'updatedAt'>>): Promise<RoomImage> {
    const now = new Date()
    await db
      .update(roomImages)
      .set({ ...data, updatedAt: now })
      .where(eq(roomImages.id, id))
    const updated = await db.query.roomImages.findFirst({ where: eq(roomImages.id, id) })
    if (!updated) throw new Error('Room image not found')
    return this.mapToRoomImage(updated)
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await db.delete(roomImages).where(eq(roomImages.id, id))
    return deleted.count > 0
  }

  private mapToRoomImage(row: any): RoomImage {
    return {
      id: row.id,
      roomId: row.roomId,
      url: row.url,
      alt: row.alt || undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    }
  }
}
