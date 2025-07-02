import { eq } from 'drizzle-orm'
import { db } from '@/infrastructure/database/db'
import { reservations } from '@/infrastructure/database/schema'
import type { StripePaymentService } from '../../../core/services/stripe-payment.service'
import type Stripe from 'stripe'

export class StripeWebhookUseCase {
  private readonly stripeService: StripePaymentService
  constructor(stripeService: StripePaymentService) {
    this.stripeService = stripeService
  }

  async execute(body: string, signature: string) {
    const event = await this.stripeService.verifyWebhookSignature(body, signature)
    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session
          const bookingId = session.metadata?.reservationId

          if (!bookingId) {
            throw new Error('Booking ID is missing in session metadata.')
          }

          await db.update(reservations).set({ status: 'completed' }).where(eq(reservations.id, bookingId))

          return { message: 'Reservation updated successfully.' }
        }
        case 'checkout.session.expired': {
          const session = event.data.object as Stripe.Checkout.Session
          const bookingId = session.metadata?.reservationId

          if (!bookingId) {
            throw new Error('Booking ID is missing in session metadata.')
          }

          await db.update(reservations).set({ status: 'cancelled' }).where(eq(reservations.id, bookingId))

          return { message: 'Reservation marked as failed.' }
        }
        default:
          return { message: 'Event not handled.' }
      }
    } catch (error) {
      console.error('Error processing Stripe webhook:', error)
      throw new Error('Failed to process Stripe webhook event.')
    }
  }
}
