import { IUseCase } from '@/domain/types/use-case.type'
import type { Availability } from '@/domain/models/availability.model'
import type { AvailabilityRepositoryInterface } from '@/domain/repositories/availability.repository.interface'
import type { ActivityType } from '@/infrastructure/config/activity.config'

export type ListAvailabilitiesParams = { roomId: string }
export type ListAvailabilitiesResponse = { success: boolean; data?: Availability[]; error?: string }

export class ListAvailabilitiesUseCase extends IUseCase<ListAvailabilitiesParams, ListAvailabilitiesResponse> {
  log(): ActivityType {
    throw new Error('Method not implemented.')
  }
  constructor(private readonly availabilityRepository: AvailabilityRepositoryInterface) {
    super()
  }

  async execute(params: ListAvailabilitiesParams): Promise<ListAvailabilitiesResponse> {
    try {
      const availabilities = await this.availabilityRepository.findAllByRoom(params.roomId)
      return { success: true, data: availabilities }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}
