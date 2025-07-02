import { IUseCase } from '@/domain/types/use-case.type'
import type { Booking } from '@/domain/models/booking.model'
import type { BookingRepositoryInterface } from '@/domain/repositories/booking.repository.interface'
import type { ActivityType } from '@/infrastructure/config/activity.config'

export type GetBookingParams = { id: string }
export type GetBookingResponse = { success: boolean; data?: Booking; error?: string }

export class GetBookingUseCase extends IUseCase<GetBookingParams, GetBookingResponse> {
  log(): ActivityType {
    throw new Error('Method not implemented.')
  }
  constructor(private readonly bookingRepository: BookingRepositoryInterface) {
    super()
  }

  async execute(params: GetBookingParams): Promise<GetBookingResponse> {
    try {
      const booking = await this.bookingRepository.findById(params.id)
      if (!booking) return { success: false, error: 'Booking not found' }
      return { success: true, data: booking }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}
