import type { RoomImage } from '../models/room-image.model'

export interface RoomImageRepositoryInterface {
  findById: (id: string) => Promise<RoomImage | null>
  findAll: () => Promise<RoomImage[]>
  findAllByRoom: (roomId: string) => Promise<RoomImage[]>
  create: (data: Omit<RoomImage, 'id' | 'createdAt' | 'updatedAt'>) => Promise<RoomImage>
  update: (id: string, data: Partial<Omit<RoomImage, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<RoomImage>
  delete: (id: string) => Promise<boolean>
}
