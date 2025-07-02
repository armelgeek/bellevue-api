import type { Room } from '../models/room.model'

export interface RoomRepositoryInterface {
  findById: (id: string) => Promise<Room | null>
  findAll: (pagination?: { skip: number; limit: number }) => Promise<Room[]>
  create: (data: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Room>
  update: (id: string, data: Partial<Omit<Room, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<Room>
  delete: (id: string) => Promise<boolean>
}
