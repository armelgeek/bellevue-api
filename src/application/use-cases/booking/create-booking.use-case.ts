import { IUseCase } from '@/domain/types/use-case.type'
import type { Booking } from '@/domain/models/booking.model'
import type { BookingRepositoryInterface } from '@/domain/repositories/booking.repository.interface'
import type { ActivityType } from '@/infrastructure/config/activity.config'

export type CreateBookingParams = Omit<Booking, 'id' | 'createdAt' | 'updatedAt' | 'status'>
export type CreateBookingResponse = { success: boolean; data?: Booking; error?: string }

export class CreateBookingUseCase extends IUseCase<CreateBookingParams, CreateBookingResponse> {
  log(): ActivityType {
    throw new Error('Method not implemented.')
  }
  constructor(private readonly bookingRepository: BookingRepositoryInterface) {
    super()
  }

  async execute(params: CreateBookingParams): Promise<CreateBookingResponse> {
    try {
      // Vérifier qu'il n'y a pas de réservation qui se chevauche
      const overlaps = await this.bookingRepository.findByRoomAndDate(params.roomId, params.startDate, params.endDate)
      if (overlaps.length > 0) {
        return { success: false, error: 'Room is not available for the selected dates' }
      }
      const booking = await this.bookingRepository.create({ ...params, status: 'pending' })
      return { success: true, data: booking }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}
