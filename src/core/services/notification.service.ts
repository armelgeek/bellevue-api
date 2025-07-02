import type { NotificationBase, NotificationStatus } from '../types/notification.type'

export interface NotificationService {
  send: (notification: NotificationBase) => Promise<NotificationStatus>
  getStatus: (notificationId: string) => Promise<NotificationStatus>
}

export interface ReservationNotificationService {
  sendReservationConfirmed: (userId: string, reservationId: string) => Promise<void>
  sendPaymentSuccessful: (userId: string, paymentId: string, amount: number) => Promise<void>
  sendPaymentFailed: (userId: string, paymentId: string, reason?: string) => Promise<void>
  sendReservationCancelled: (userId: string, reservationId: string) => Promise<void>
  sendPaymentSuccessNotification: (params: {
    userId: string
    paymentId: string
    reservationId: string
    amount: number
    currency: string
  }) => Promise<void>
  sendPaymentFailedNotification: (params: {
    userId: string
    paymentId: string
    reservationId: string
    reason: string
  }) => Promise<void>
}

export class EmailNotificationService implements ReservationNotificationService {
  private readonly fromEmail: string
  private readonly frontendUrl: string

  constructor() {
    this.fromEmail = Bun.env.SMTP_FROM_EMAIL || 'noreply@reservation-app.com'
  }

  sendReservationConfirmed(userId: string, reservationId: string): Promise<void> {
    console.info(`📧 Réservation ${reservationId} confirmée pour l'utilisateur ${userId}`)
    return Promise.resolve()
  }

  sendPaymentSuccessful(userId: string, paymentId: string, amount: number): Promise<void> {
    console.info(`💳 Paiement ${paymentId} de ${amount}€ réussi pour l'utilisateur ${userId}`)
    return Promise.resolve()
  }

  sendPaymentFailed(userId: string, paymentId: string, reason?: string): Promise<void> {
    console.info(`❌ Paiement ${paymentId} échoué pour l'utilisateur ${userId}${reason ? ` - ${reason}` : ''}`)
    return Promise.resolve()
  }

  sendReservationCancelled(userId: string, reservationId: string): Promise<void> {
    console.info(`🚫 Réservation ${reservationId} annulée pour l'utilisateur ${userId}`)
    return Promise.resolve()
  }

  sendPaymentSuccessNotification(params: {
    userId: string
    paymentId: string
    reservationId: string
    amount: number
    currency: string
  }): Promise<void> {
    console.info(
      `✅ Paiement réussi - Utilisateur: ${params.userId}, Paiement: ${params.paymentId}, Réservation: ${params.reservationId}, Montant: ${params.amount} ${params.currency.toUpperCase()}`
    )
    return Promise.resolve()
  }

  sendPaymentFailedNotification(params: {
    userId: string
    paymentId: string
    reservationId: string
    reason: string
  }): Promise<void> {
    console.info(
      `❌ Paiement échoué - Utilisateur: ${params.userId}, Paiement: ${params.paymentId}, Réservation: ${params.reservationId}, Raison: ${params.reason}`
    )
    return Promise.resolve()
  }

  /**
   * Envoie une notification détaillée avec email complet
   */
  sendDetailedReservationConfirmation(params: {
    userEmail: string
    userName: string
    reservationId: string
    resourceName: string
    startDate: Date
    endDate: Date
  }): Promise<void> {
    const subject = 'Confirmation de votre réservation'
    const text = `
Bonjour ${params.userName},

Votre réservation a été confirmée avec succès !

Détails de la réservation :
- Ressource : ${params.resourceName}
- Date de début : ${params.startDate.toLocaleDateString('fr-FR')} à ${params.startDate.toLocaleTimeString('fr-FR')}
- Date de fin : ${params.endDate.toLocaleDateString('fr-FR')} à ${params.endDate.toLocaleTimeString('fr-FR')}
- Référence : ${params.reservationId}

Vous pouvez consulter vos réservations sur : ${this.frontendUrl}/dashboard

Merci de votre confiance !
L'équipe Réservation
    `

    console.info(`[EMAIL] Envoi de confirmation de réservation à ${params.userEmail}`)
    console.info(`[EMAIL] Subject: ${subject}`)
    console.info(`[EMAIL] Content: ${text}`)

    return Promise.resolve()
  }

  /**
   * Envoie un rappel avant échéance
   */
  sendReservationReminder(params: {
    userEmail: string
    userName: string
    reservationId: string
    resourceName: string
    startDate: Date
    hoursBeforeStart: number
  }): Promise<void> {
    const subject = `Rappel : Votre réservation commence dans ${params.hoursBeforeStart}h`
    const text = `
Bonjour ${params.userName},

Nous vous rappelons que votre réservation commence bientôt :

- Ressource : ${params.resourceName}
- Date de début : ${params.startDate.toLocaleDateString('fr-FR')} à ${params.startDate.toLocaleTimeString('fr-FR')}
- Référence : ${params.reservationId}

N'oubliez pas votre rendez-vous !

L'équipe Réservation
    `

    console.info(`[EMAIL] Envoi de rappel de réservation à ${params.userEmail}`)
    console.info(`[EMAIL] Subject: ${subject}`)
    console.info(`[EMAIL] Content: ${text}`)

    return Promise.resolve()
  }
}
