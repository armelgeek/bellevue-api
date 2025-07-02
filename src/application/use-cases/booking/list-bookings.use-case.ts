import { IUseCase } from '@/domain/types/use-case.type'
import type { Booking } from '@/domain/models/booking.model'
import type { BookingRepositoryInterface } from '@/domain/repositories/booking.repository.interface'
import type { ActivityType } from '@/infrastructure/config/activity.config'

export type ListBookingsParams = { skip?: number; limit?: number }
export type ListBookingsResponse = { success: boolean; data?: Booking[]; error?: string }

export class ListBookingsUseCase extends IUseCase<ListBookingsParams, ListBookingsResponse> {
  log(): ActivityType {
    throw new Error('Method not implemented.')
  }
  constructor(private readonly bookingRepository: BookingRepositoryInterface) {
    super()
  }

  async execute(params: ListBookingsParams): Promise<ListBookingsResponse> {
    try {
      const bookings = await this.bookingRepository.findAll({ skip: params.skip ?? 0, limit: params.limit ?? 20 })
      return { success: true, data: bookings }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}
