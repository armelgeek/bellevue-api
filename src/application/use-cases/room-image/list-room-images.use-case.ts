import { IUseCase } from '@/domain/types/use-case.type'
import type { RoomImage } from '@/domain/models/room-image.model'
import type { RoomImageRepositoryInterface } from '@/domain/repositories/room-image.repository.interface'
import type { ActivityType } from '@/infrastructure/config/activity.config'

export type ListRoomImagesResponse = { success: boolean; data?: RoomImage[]; error?: string }

export class ListRoomImagesUseCase extends IUseCase<{}, ListRoomImagesResponse> {
  constructor(private readonly roomImageRepository: RoomImageRepositoryInterface) {
    super()
  }

  log(): ActivityType {
    throw new Error('Method not implemented.')
  }

  async execute(): Promise<ListRoomImagesResponse> {
    try {
      const images = await this.roomImageRepository.findAll()
      return { success: true, data: images }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}
