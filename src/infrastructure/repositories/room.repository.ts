import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import type { Room } from '@/domain/models/room.model'
import type { RoomRepositoryInterface } from '@/domain/repositories/room.repository.interface'
import { db } from '../database/db'
import { rooms } from '../database/schema/room.schema'

export class RoomRepository implements RoomRepositoryInterface {
  async findById(id: string): Promise<Room | null> {
    const result = await db.select().from(rooms).where(eq(rooms.id, id)).limit(1)
    if (!result[0]) return null
    return this.mapToRoom(result[0])
  }

  async findAll(pagination?: { skip: number; limit: number }): Promise<Room[]> {
    const query = db.select().from(rooms)
    if (pagination?.skip) query.offset(pagination.skip)
    if (pagination?.limit) query.limit(pagination.limit)
    const results = await query
    return results.map(this.mapToRoom)
  }

  async create(data: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>): Promise<Room> {
    const now = new Date()
    const id = uuidv4()
    const [result] = await db
      .insert(rooms)
      .values({
        id,
        name: data.name,
        description: data.description,
        type: data.type,
        capacity: data.capacity,
        pricePerNight: data.pricePerNight.toString(),
        currency: data.currency,
        isActive: data.isActive ?? true,
        createdAt: now,
        updatedAt: now
      })
      .returning()
    return this.mapToRoom(result)
  }

  async update(id: string, data: Partial<Omit<Room, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Room> {
    const [result] = await db
      .update(rooms)
      .set({
        ...data,
        pricePerNight: data.pricePerNight?.toString(),
        updatedAt: new Date()
      })
      .where(eq(rooms.id, id))
      .returning()
    return this.mapToRoom(result)
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(rooms).where(eq(rooms.id, id))
    return result.count > 0
  }

  private mapToRoom(row: any): Room {
    return {
      id: row.id,
      name: row.name,
      description: row.description || undefined,
      type: row.type,
      capacity: row.capacity,
      pricePerNight: Number(row.pricePerNight),
      currency: row.currency,
      isActive: row.isActive,
      features: [], // à compléter avec la table de relation
      rules: [], // à compléter avec la table de relation
      images: [], // à compléter avec la table de relation
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    }
  }
}
