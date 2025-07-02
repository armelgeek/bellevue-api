import { IUseCase } from '@/domain/types/use-case.type'
import type { Hotel } from '@/domain/models/hotel.model'
import type { HotelRepositoryInterface } from '@/domain/repositories/hotel.repository.interface'
import type { ActivityType } from '@/infrastructure/config/activity.config'

export type UpdateHotelParams = Partial<Omit<Hotel, 'id' | 'createdAt' | 'updatedAt'>>
export type UpdateHotelResponse = { success: boolean; data?: Hotel; error?: string }

export class UpdateHotelUseCase extends IUseCase<UpdateHotelParams, UpdateHotelResponse> {
  log(): ActivityType {
    throw new Error('Method not implemented.')
  }
  constructor(private readonly hotelRepository: HotelRepositoryInterface) {
    super()
  }

  async execute(params: UpdateHotelParams): Promise<UpdateHotelResponse> {
    try {
      const hotel = await this.hotelRepository.update(params)
      return { success: true, data: hotel }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}
