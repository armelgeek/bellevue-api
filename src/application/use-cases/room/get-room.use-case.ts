import { IUseCase } from '@/domain/types/use-case.type'
import type { Room } from '@/domain/models/room.model'
import type { RoomRepositoryInterface } from '@/domain/repositories/room.repository.interface'
import type { ActivityType } from '@/infrastructure/config/activity.config'

export type GetRoomParams = { id: string }
export type GetRoomResponse = { success: boolean; data?: Room; error?: string }

export class GetRoomUseCase extends IUseCase<GetRoomParams, GetRoomResponse> {
  log(): ActivityType {
    throw new Error('Method not implemented.')
  }
  constructor(private readonly roomRepository: RoomRepositoryInterface) {
    super()
  }

  async execute(params: GetRoomParams): Promise<GetRoomResponse> {
    try {
      const room = await this.roomRepository.findById(params.id)
      if (!room) return { success: false, error: 'Room not found' }
      return { success: true, data: room }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}
