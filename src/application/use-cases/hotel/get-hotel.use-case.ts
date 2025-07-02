import { IUseCase } from '@/domain/types/use-case.type'
import type { Hotel } from '@/domain/models/hotel.model'
import type { HotelRepositoryInterface } from '@/domain/repositories/hotel.repository.interface'
import type { ActivityType } from '@/infrastructure/config/activity.config'

export type GetHotelParams = {}
export type GetHotelResponse = { success: boolean; data?: Hotel; error?: string }

export class GetHotelUseCase extends IUseCase<GetHotelParams, GetHotelResponse> {
  log(): ActivityType {
    throw new Error('Method not implemented.')
  }
  constructor(private readonly hotelRepository: HotelRepositoryInterface) {
    super()
  }

  async execute(): Promise<GetHotelResponse> {
    try {
      const hotel = await this.hotelRepository.find()
      if (!hotel) return { success: false, error: 'Hotel not found' }
      return { success: true, data: hotel }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}
