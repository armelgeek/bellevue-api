export interface AuditLog {
  id: string
  userId: string
  action: string
  entityType?: 'reservation' | 'payment' | 'system'
  entityId?: string
  oldValue?: any
  newValue?: any
  details?: any
  timestamp: Date
  ipAddress?: string
  userAgent?: string
  metadata?: Record<string, any>
}

export class AuditService {
  private logs: AuditLog[] = []

  logActivity(activity: {
    userId: string
    action: string
    details?: any
    metadata?: Record<string, any>
    entityType?: 'reservation' | 'payment' | 'system'
    entityId?: string
  }) {
    this.addLog({
      id: crypto.randomUUID(),
      userId: activity.userId,
      action: activity.action,
      entityType: activity.entityType || 'system',
      entityId: activity.entityId,
      details: activity.details,
      timestamp: new Date(),
      metadata: activity.metadata
    })
  }

  logReservationCreated(params: {
    userId: string
    reservationId: string
    resourceId: string
    startDate: Date
    endDate: Date
    amount: number
  }): Promise<void> {
    const logEntry = {
      timestamp: new Date().toISOString(),
      action: 'RESERVATION_CREATED',
      userId: params.userId,
      entityType: 'RESERVATION',
      entityId: params.reservationId,
      details: {
        resourceId: params.resourceId,
        startDate: params.startDate.toISOString(),
        endDate: params.endDate.toISOString(),
        amount: params.amount
      }
    }

    console.info('[AUDIT]', JSON.stringify(logEntry))
    return Promise.resolve()
  }

  logReservationStatusChanged(params: {
    userId: string
    reservationId: string
    oldStatus: string
    newStatus: string
    reason?: string
  }): Promise<void> {
    const logEntry = {
      timestamp: new Date().toISOString(),
      action: 'RESERVATION_STATUS_CHANGED',
      userId: params.userId,
      entityType: 'RESERVATION',
      entityId: params.reservationId,
      details: {
        oldStatus: params.oldStatus,
        newStatus: params.newStatus,
        reason: params.reason
      }
    }

    console.info('[AUDIT]', JSON.stringify(logEntry))
    return Promise.resolve()
  }

  logPaymentProcessed(params: {
    userId: string
    paymentId: string
    reservationId: string
    amount: number
    currency: string
    status: string
    method: string
  }): Promise<void> {
    const logEntry = {
      timestamp: new Date().toISOString(),
      action: 'PAYMENT_PROCESSED',
      userId: params.userId,
      entityType: 'PAYMENT',
      entityId: params.paymentId,
      details: {
        reservationId: params.reservationId,
        amount: params.amount,
        currency: params.currency,
        status: params.status,
        method: params.method
      }
    }

    console.info('[AUDIT]', JSON.stringify(logEntry))
    return Promise.resolve()
  }

  logResourceAccessAttempt(params: {
    userId: string
    resourceId: string
    action: string
    success: boolean
    reason?: string
  }): Promise<void> {
    const logEntry = {
      timestamp: new Date().toISOString(),
      action: 'RESOURCE_ACCESS_ATTEMPT',
      userId: params.userId,
      entityType: 'RESOURCE',
      entityId: params.resourceId,
      details: {
        action: params.action,
        success: params.success,
        reason: params.reason
      }
    }

    console.info('[AUDIT]', JSON.stringify(logEntry))
    return Promise.resolve()
  }

  private addLog(log: AuditLog) {
    this.logs.push(log)
    console.info('📝 Audit:', log)
  }

  getLogs(entityId?: string): AuditLog[] {
    return entityId ? this.logs.filter((log) => log.entityId === entityId) : this.logs
  }
}
