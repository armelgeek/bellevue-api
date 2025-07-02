import { relations, type InferModel } from 'drizzle-orm'
import { availabilities } from './availability.schema'
import { bookings } from './booking.schema'
import { features } from './feature.schema'
import { hotels } from './hotel.schema'
import { policies } from './policy.schema'
import { reviews } from './review.schema'
import { roomImages } from './room-image.schema'
import { roomFeatures, roomRules } from './room-relations.schema'
import { rooms } from './room.schema'
import { rules } from './rule.schema'
import { roles, userRoles } from './schema'

export * from './schema'
export * from './room-image.schema'
export * from './feature.schema'
export * from './rule.schema'
export * from './policy.schema'
export * from './hotel.schema'
export * from './room.schema'
export * from './availability.schema'
export * from './room-relations.schema'
export * from './booking.schema'
export * from './review.schema'

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(roles, {
    fields: [userRoles.userId],
    references: [roles.id]
  }),
  role: one(roles, {
    fields: [userRoles.roleId],
    references: [roles.id]
  })
}))

export type Role = InferModel<typeof roles>
export type UserRole = InferModel<typeof userRoles>
export type Feature = InferModel<typeof features>
export type Rule = InferModel<typeof rules>
export type Policy = InferModel<typeof policies>
export type Hotel = InferModel<typeof hotels>
export type Room = InferModel<typeof rooms>
export type RoomImage = InferModel<typeof roomImages>
export type Availability = InferModel<typeof availabilities>
export type RoomFeature = InferModel<typeof roomFeatures>
export type RoomRule = InferModel<typeof roomRules>
export type Booking = InferModel<typeof bookings>
export type Review = InferModel<typeof reviews>
export {
  availabilities,
  bookings,
  features,
  hotels,
  policies,
  reviews,
  roomFeatures,
  roomImages,
  roomRules,
  rooms,
  rules
}
