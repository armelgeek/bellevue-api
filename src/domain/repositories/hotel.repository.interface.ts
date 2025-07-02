import type { Hotel } from '../models/hotel.model'

export interface HotelRepositoryInterface {
  find: () => Promise<Hotel | null>
  update: (data: Partial<Omit<Hotel, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<Hotel>
}
