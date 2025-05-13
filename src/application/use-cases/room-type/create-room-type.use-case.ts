import { IUseCase } from '@/domain/types/use-case.type'
import type { RoomType } from '@/domain/models/room-type.model'
import type { RoomTypeRepositoryInterface } from '@/domain/repositories/room-type.repository.interface'
import type { ActivityType } from '@/infrastructure/config/activity.config'

type Params = Omit<RoomType, 'id' | 'createdAt' | 'updatedAt'>

type Response = {
  data: RoomType | null
  success: boolean
  error?: string
}

export class CreateRoomTypeUseCase extends IUseCase<Params, Response> {
  log(): ActivityType {
    throw new Error('Method not implemented.')
  }
  constructor(private readonly repository: RoomTypeRepositoryInterface) {
    super()
  }

  async execute(params: Params): Promise<Response> {
    try {
      const roomType = await this.repository.create(params)
      return { data: roomType, success: true }
    } catch (error: any) {
      return { success: false, error: error.message, data: null }
    }
  }
}
