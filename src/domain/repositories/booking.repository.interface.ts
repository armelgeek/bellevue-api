import type { Booking } from '../models/booking.model'

export interface BookingRepositoryInterface {
  findById: (id: string) => Promise<Booking | null>
  findAll: (pagination?: { skip: number; limit: number }) => Promise<Booking[]>
  create: (data: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Booking>
  update: (id: string, data: Partial<Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<Booking>
  delete: (id: string) => Promise<boolean>
  findByRoomAndDate: (roomId: string, startDate: Date, endDate: Date) => Promise<Booking[]>
}
