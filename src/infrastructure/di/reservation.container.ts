import process from 'node:process'
import { StripeWebhookUseCase } from '../../application/use-cases/payment/stripe-webhook.use-case'
import { CreateReservationWithStripeUseCase } from '../../application/use-cases/reservation/create-reservation-with-stripe.use-case'
import { AuditService } from '../../core/services/audit.service'
import { EmailNotificationService } from '../../core/services/notification.service'
import { RefundService } from '../../core/services/refund.service'
import { ReservationExtensionService } from '../../core/services/reservation-extension.service'
import { ReservationStatusService } from '../../core/services/reservation-status.service'
import { StatisticsService } from '../../core/services/statistics.service'
import { StripePaymentService } from '../../core/services/stripe-payment.service'
import { ReservationController } from '../controllers/reservation.controller'
import { ResourceController } from '../controllers/resource.controller'
import { StripeWebhookController } from '../controllers/stripe-webhook.controller'
import { DrizzleReservationRepository, DrizzleResourceRepository } from '../repositories'

export class ReservationDIContainer {
  public readonly reservationRepository = new DrizzleReservationRepository()
  public readonly resourceRepository = new DrizzleResourceRepository()

  public readonly auditService = new AuditService()
  public readonly notificationService = new EmailNotificationService()

  public readonly stripeService = new StripePaymentService({
    apiKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || ''
  })

  public readonly reservationStatusService = new ReservationStatusService(this.reservationRepository)

  public readonly createReservationWithStripeUseCase = new CreateReservationWithStripeUseCase(
    this.reservationRepository,
    this.stripeService
  )

  public readonly stripeWebhookUseCase = new StripeWebhookUseCase(this.stripeService)

  public readonly refundService = new RefundService()

  public readonly statisticsService = new StatisticsService(this.reservationRepository)

  public readonly reservationExtensionService = new ReservationExtensionService(this.reservationRepository)

  public readonly reservationController = new ReservationController(this.reservationRepository)
  public readonly resourceController = new ResourceController(this.resourceRepository)
  public readonly stripeWebhookController = new StripeWebhookController(this.stripeWebhookUseCase)
}

export const reservationContainer = new ReservationDIContainer()
