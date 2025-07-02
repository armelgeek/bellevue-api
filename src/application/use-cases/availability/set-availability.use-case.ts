import { IUseCase } from '@/domain/types/use-case.type'
import type { Availability } from '@/domain/models/availability.model'
import type { AvailabilityRepositoryInterface } from '@/domain/repositories/availability.repository.interface'
import type { ActivityType } from '@/infrastructure/config/activity.config'

export type SetAvailabilityParams = { roomId: string; date: Date; isAvailable: boolean }
export type SetAvailabilityResponse = { success: boolean; data?: Availability; error?: string }

export class SetAvailabilityUseCase extends IUseCase<SetAvailabilityParams, SetAvailabilityResponse> {
  log(): ActivityType {
    throw new Error('Method not implemented.')
  }
  constructor(private readonly availabilityRepository: AvailabilityRepositoryInterface) {
    super()
  }

  async execute(params: SetAvailabilityParams): Promise<SetAvailabilityResponse> {
    try {
      const availability = await this.availabilityRepository.setAvailability(
        params.roomId,
        params.date,
        params.isAvailable
      )
      return { success: true, data: availability }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}
