import { db } from '@/infrastructure/database/db'
import { activityLogs } from '@/infrastructure/database/schema'
import type { ActivityType } from '@/infrastructure/config/activity.config'
import type { NewActivityLog } from './activity-log.type'

interface Obj {
  [key: string]: any
}

export abstract class IUseCase<T extends Obj = any, TRes = any> {
  abstract execute(params: T): Promise<TRes>
  abstract log(): ActivityType

  protected async logActivity(userId: string) {
    const action = this.log()
    const newActivity: NewActivityLog = {
      id: crypto.randomUUID(),
      userId,
      action,
      ipAddress: ''
    }
    await db.insert(activityLogs).values(newActivity)
  }

  async run(params: T & { currentUserId: string }): Promise<TRes> {
    const { currentUserId, ...rest } = params
    const [result] = await Promise.all([this.execute(rest as any), this.logActivity(currentUserId)])
    return result
  }
}
