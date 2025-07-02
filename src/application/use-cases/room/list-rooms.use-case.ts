import { IUseCase } from '@/domain/types/use-case.type'
import type { Room } from '@/domain/models/room.model'
import type { RoomRepositoryInterface } from '@/domain/repositories/room.repository.interface'
import type { ActivityType } from '@/infrastructure/config/activity.config'

export type ListRoomsParams = { skip?: number; limit?: number }
export type ListRoomsResponse = { success: boolean; data?: Room[]; error?: string }

export class ListRoomsUseCase extends IUseCase<ListRoomsParams, ListRoomsResponse> {
  log(): ActivityType {
    throw new Error('Method not implemented.')
  }
  constructor(private readonly roomRepository: RoomRepositoryInterface) {
    super()
  }

  async execute(params: ListRoomsParams): Promise<ListRoomsResponse> {
    try {
      const rooms = await this.roomRepository.findAll({ skip: params.skip ?? 0, limit: params.limit ?? 20 })
      return { success: true, data: rooms }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}
