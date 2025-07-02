import { IUseCase } from '@/domain/types/use-case.type'
import type { Availability } from '@/domain/models/availability.model'
import type { AvailabilityRepositoryInterface } from '@/domain/repositories/availability.repository.interface'
import type { ActivityType } from '@/infrastructure/config/activity.config'

export type GetAvailabilityParams = { roomId: string; date: Date }
export type GetAvailabilityResponse = { success: boolean; data?: Availability; error?: string }

export class GetAvailabilityUseCase extends IUseCase<GetAvailabilityParams, GetAvailabilityResponse> {
  log(): ActivityType {
    throw new Error('Method not implemented.')
  }
  constructor(private readonly availabilityRepository: AvailabilityRepositoryInterface) {
    super()
  }

  async execute(params: GetAvailabilityParams): Promise<GetAvailabilityResponse> {
    try {
      const availability = await this.availabilityRepository.findByRoomAndDate(params.roomId, params.date)
      if (!availability) return { success: false, error: 'No availability found' }
      return { success: true, data: availability }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}
