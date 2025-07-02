import { IUseCase } from '@/domain/types/use-case.type'
import type { RoomImageRepositoryInterface } from '@/domain/repositories/room-image.repository.interface'
import type { ActivityType } from '@/infrastructure/config/activity.config'

export type DeleteRoomImageParams = { id: string }
export type DeleteRoomImageResponse = { success: boolean; error?: string }

export class DeleteRoomImageUseCase extends IUseCase<DeleteRoomImageParams, DeleteRoomImageResponse> {
  constructor(private readonly roomImageRepository: RoomImageRepositoryInterface) {
    super()
  }

  log(): ActivityType {
    throw new Error('Method not implemented.')
  }

  async execute(params: DeleteRoomImageParams): Promise<DeleteRoomImageResponse> {
    try {
      const deleted = await this.roomImageRepository.delete(params.id)
      if (!deleted) return { success: false, error: 'Room image not found' }
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}
