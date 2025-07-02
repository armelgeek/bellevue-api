import { IUseCase } from '@/domain/types/use-case.type'
import type { RoomImage } from '@/domain/models/room-image.model'
import type { RoomImageRepositoryInterface } from '@/domain/repositories/room-image.repository.interface'
import type { ActivityType } from '@/infrastructure/config/activity.config'

export type CreateRoomImageParams = Omit<RoomImage, 'id' | 'createdAt' | 'updatedAt'>
export type CreateRoomImageResponse = { success: boolean; data?: RoomImage; error?: string }

export class CreateRoomImageUseCase extends IUseCase<CreateRoomImageParams, CreateRoomImageResponse> {
  constructor(private readonly roomImageRepository: RoomImageRepositoryInterface) {
    super()
  }

  log(): ActivityType {
    throw new Error('Method not implemented.')
  }

  async execute(params: CreateRoomImageParams): Promise<CreateRoomImageResponse> {
    try {
      const image = await this.roomImageRepository.create(params)
      return { success: true, data: image }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}
