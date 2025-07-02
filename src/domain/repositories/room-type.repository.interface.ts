import type { RoomType } from '../models/room-type.model'

export interface RoomTypeRepositoryInterface {
  findById: (id: string) => Promise<RoomType | null>
  findAll: (pagination?: { skip: number; limit: number }) => Promise<RoomType[]>
  create: (data: Omit<RoomType, 'id' | 'createdAt' | 'updatedAt'>) => Promise<RoomType>
  update: (id: string, data: Partial<Omit<RoomType, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<RoomType>
  delete: (id: string) => Promise<boolean>
}
