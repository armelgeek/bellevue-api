
export interface NotificationBase {
  id: string
  userId: string
  type: 'email' | 'sms' | 'push'
  title: string
  message: string
  status: 'pending' | 'sent' | 'failed'
  createdAt: Date
  sentAt?: Date
}

export type NotificationStatus = NotificationBase['status']
