import { IUseCase } from '@/domain/types/use-case.type'
import type { RoomTypeRepositoryInterface } from '@/domain/repositories/room-type.repository.interface'
import type { ActivityType } from '@/infrastructure/config/activity.config'

type Params = { id: string }

type Response = {
  success: boolean
  error?: string
}

export class DeleteRoomTypeUseCase extends IUseCase<Params, Response> {
  log(): ActivityType {
    throw new Error('Method not implemented.')
  }
  constructor(private readonly repository: RoomTypeRepositoryInterface) {
    super()
  }

  async execute(params: Params): Promise<Response> {
    try {
      const deleted = await this.repository.delete(params.id)
      if (!deleted) return { success: false, error: 'RoomType not found' }
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}
