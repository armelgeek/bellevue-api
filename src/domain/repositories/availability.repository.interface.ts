import type { Availability } from '../models/availability.model'

export interface AvailabilityRepositoryInterface {
  findByRoomAndDate: (roomId: string, date: Date) => Promise<Availability | null>
  setAvailability: (roomId: string, date: Date, isAvailable: boolean) => Promise<Availability>
  findAllByRoom: (roomId: string) => Promise<Availability[]>
}
