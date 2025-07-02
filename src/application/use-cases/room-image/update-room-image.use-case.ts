import { IUseCase } from '@/domain/types/use-case.type'
import type { RoomImage } from '@/domain/models/room-image.model'
import type { RoomImageRepositoryInterface } from '@/domain/repositories/room-image.repository.interface'
import type { ActivityType } from '@/infrastructure/config/activity.config'

export type UpdateRoomImageParams = { id: string } & Partial<Omit<RoomImage, 'id' | 'createdAt' | 'updatedAt'>>
export type UpdateRoomImageResponse = { success: boolean; data?: RoomImage; error?: string }

export class UpdateRoomImageUseCase extends IUseCase<UpdateRoomImageParams, UpdateRoomImageResponse> {
  constructor(private readonly roomImageRepository: RoomImageRepositoryInterface) {
    super()
  }

  log(): ActivityType {
    throw new Error('Method not implemented.')
  }

  async execute(params: UpdateRoomImageParams): Promise<UpdateRoomImageResponse> {
    try {
      const image = await this.roomImageRepository.update(params.id, params)
      return { success: true, data: image }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}
