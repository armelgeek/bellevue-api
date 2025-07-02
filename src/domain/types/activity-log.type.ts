import type { activityLogs } from '@/infrastructure/database/schema'

export type NewActivityLog = typeof activityLogs.$inferInsert
