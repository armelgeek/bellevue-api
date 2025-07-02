import { relations, type InferModel } from 'drizzle-orm'
import { roles, userRoles } from './schema'

export * from './schema'

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

