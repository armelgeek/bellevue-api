import { pgTable, text } from 'drizzle-orm/pg-core'

export const roomImagesRelations = pgTable('room_images_relations', {
  roomId: text('room_id').notNull(),
  imageId: text('image_id').notNull()
})
