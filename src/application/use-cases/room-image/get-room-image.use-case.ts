import { IUseCase } from '@/domain/types/use-case.type'
import type { RoomImage } from '@/domain/models/room-image.model'
import type { RoomImageRepositoryInterface } from '@/domain/repositories/room-image.repository.interface'
import type { ActivityType } from '@/infrastructure/config/activity.config'

export type GetRoomImageParams = { id: string }
export type GetRoomImageResponse = { success: boolean; data?: RoomImage; error?: string }

export class GetRoomImageUseCase extends IUseCase<GetRoomImageParams, GetRoomImageResponse> {
  constructor(private readonly roomImageRepository: RoomImageRepositoryInterface) {
    super()
  }

  log(): ActivityType {
    throw new Error('Method not implemented.')
  }

  async execute(params: GetRoomImageParams): Promise<GetRoomImageResponse> {
    try {
      const image = await this.roomImageRepository.findById(params.id)
      if (!image) return { success: false, error: 'Room image not found' }
      return { success: true, data: image }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}
