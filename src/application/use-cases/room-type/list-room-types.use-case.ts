import { IUseCase } from '@/domain/types/use-case.type'
import type { RoomType } from '@/domain/models/room-type.model'
import type { RoomTypeRepositoryInterface } from '@/domain/repositories/room-type.repository.interface'
import type { ActivityType } from '@/infrastructure/config/activity.config'

export class ListRoomTypesUseCase extends IUseCase<{}, { success: boolean; data: RoomType[]; error?: string }> {
  log(): ActivityType {
    throw new Error('Method not implemented.')
  }
  constructor(private readonly repository: RoomTypeRepositoryInterface) {
    super()
  }

  async execute(): Promise<{ success: boolean; data: RoomType[]; error?: string }> {
    try {
      const roomTypes = await this.repository.findAll()
      return { success: true, data: roomTypes }
    } catch (error: any) {
      return { success: false, data: [], error: error.message }
    }
  }
}
