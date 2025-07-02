import { eq } from 'drizzle-orm'
import type { Hotel } from '@/domain/models/hotel.model'
import type { HotelRepositoryInterface } from '@/domain/repositories/hotel.repository.interface'
import { db } from '../database/db'
import { hotels } from '../database/schema/hotel.schema'

export class HotelRepository implements HotelRepositoryInterface {
  async find(): Promise<Hotel | null> {
    const result = await db.select().from(hotels).limit(1)
    if (!result[0]) return null
    return this.mapToHotel(result[0])
  }

  async update(data: Partial<Omit<Hotel, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Hotel> {
    // On suppose qu'il n'y a qu'un seul hôtel (id connu ou unique)
    const hotel = await this.find()
    if (!hotel) throw new Error('Hotel not found')
    const [result] = await db
      .update(hotels)
      .set({
        ...data,
        images: data.images ? JSON.stringify(data.images) : undefined,
        updatedAt: new Date()
      })
      .where(eq(hotels.id, hotel.id))
      .returning()
    return this.mapToHotel(result)
  }

  private mapToHotel(row: any): Hotel {
    return {
      id: row.id,
      name: row.name,
      description: row.description || undefined,
      address: row.address,
      phone: row.phone || undefined,
      email: row.email || undefined,
      images: row.images ? JSON.parse(row.images) : [],
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    }
  }
}
