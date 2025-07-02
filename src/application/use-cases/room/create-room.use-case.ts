import { IUseCase } from '@/domain/types/use-case.type'
import type { Room } from '@/domain/models/room.model'
import type { RoomRepositoryInterface } from '@/domain/repositories/room.repository.interface'
import type { ActivityType } from '@/infrastructure/config/activity.config'

export type CreateRoomParams = Omit<Room, 'id' | 'createdAt' | 'updatedAt'>
export type CreateRoomResponse = { success: boolean; data?: Room; error?: string }

export class CreateRoomUseCase extends IUseCase<CreateRoomParams, CreateRoomResponse> {
  log(): ActivityType {
    throw new Error('Method not implemented.')
  }
  constructor(private readonly roomRepository: RoomRepositoryInterface) {
    super()
  }

  async execute(params: CreateRoomParams): Promise<CreateRoomResponse> {
    try {
      const room = await this.roomRepository.create(params)
      return { success: true, data: room }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}
