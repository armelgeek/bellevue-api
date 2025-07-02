import Stripe from 'stripe'
import type { PaymentBase, PaymentStatus } from '../types/payment.type'

export interface StripePaymentServiceConfig {
  apiKey: string
  webhookSecret: string
}

export class StripePaymentService {
  private stripe: Stripe
  private webhookSecret: string

  constructor(config: StripePaymentServiceConfig) {
    this.stripe = new Stripe(config.apiKey, { apiVersion: '2025-02-24.acacia' })
    this.webhookSecret = config.webhookSecret
  }

  async createPaymentIntent(payment: PaymentBase): Promise<string> {
    const intent = await this.stripe.paymentIntents.create({
      amount: Math.round(payment.amount * 100),
      currency: payment.currency,
      metadata: {
        paymentId: payment.id,
        userId: payment.userId,
        reservationId: payment.reservationId
      },
      automatic_payment_methods: { enabled: true }
    })
    return intent.client_secret as string
  }

  async verifyWebhookSignature(body: string, signature: string): Promise<Stripe.Event> {
    return await this.stripe.webhooks.constructEventAsync(body, signature, this.webhookSecret)
  }

  handleWebhookEvent(event: Stripe.Event): PaymentStatus {
    switch (event.type) {
      case 'payment_intent.succeeded':
        return 'paid'
      case 'payment_intent.payment_failed':
        return 'failed'
      case 'payment_intent.canceled':
        return 'failed'
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        return session.payment_status === 'paid' ? 'paid' : 'pending'
      }
      case 'checkout.session.expired':
        return 'failed'
      case 'payment_intent.created':
      case 'payment_intent.processing':
      case 'payment_intent.requires_action':
        return 'pending'
      default:
        console.info('Événement Stripe non géré:', event.type)
        return 'pending'
    }
  }

  extractPaymentMetadata(event: Stripe.Event): { reservationId: string; userId: string } | null {
    const eventsToIgnore = [
      'payment_intent.created',
      'payment_intent.processing',
      'payment_intent.requires_action',
      'payment_method.attached',
      'setup_intent.created'
    ]

    if (eventsToIgnore.includes(event.type)) {
      console.info(`Événement Stripe ignoré (pas de métadonnées requises): ${event.type}`)
      return null
    }

    if (event.type.startsWith('payment_intent.')) {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      const reservationId = paymentIntent.metadata?.reservationId
      const userId = paymentIntent.metadata?.userId
      if (!reservationId || !userId) {
        console.warn('Métadonnées manquantes dans le webhook Stripe:', {
          reservationId,
          userId,
          eventType: event.type,
          eventId: event.id
        })
        return null
      }
      return {
        reservationId,
        userId
      }
    }

    if (event.type.startsWith('checkout.session.')) {
      const session = event.data.object as Stripe.Checkout.Session
      const reservationId = session.metadata?.reservationId
      const userId = session.metadata?.userId
      if (!reservationId || !userId) {
        console.warn('Métadonnées manquantes dans le webhook Stripe (checkout session):', {
          reservationId,
          userId,
          eventType: event.type,
          eventId: event.id
        })
        return null
      }
      return {
        reservationId,
        userId
      }
    }
    return null
  }

  async createCheckoutSession(params: {
    amount: number
    currency: string
    metadata: Record<string, string>
    successUrl: string
    cancelUrl: string
  }): Promise<Stripe.Checkout.Session> {
    return await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: params.currency,
            product_data: {
              name: 'Reservation Payment'
            },
            unit_amount: Math.round(params.amount * 100)
          },
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      metadata: params.metadata
    })
  }

  async processRefund(params: { reservationId: string; amount?: number; reason?: string; currency: string }): Promise<{
    id: string
    amount: number
    currency: string
    status: string
  }> {
    try {
      const paymentIntents = await this.stripe.paymentIntents.list({
        limit: 10,
        expand: ['data.charges']
      })

      const paymentIntent = paymentIntents.data.find((pi) => pi.metadata?.reservationId === params.reservationId)

      if (!paymentIntent) {
        throw new Error(`Aucun paiement trouvé pour la réservation ${params.reservationId}`)
      }

      if (paymentIntent.status !== 'succeeded') {
        throw new Error(`Le paiement n'est pas en statut succeeded: ${paymentIntent.status}`)
      }

      const charges = await this.stripe.charges.list({
        payment_intent: paymentIntent.id,
        limit: 1
      })

      if (!charges.data || charges.data.length === 0) {
        throw new Error('Aucune charge trouvée pour ce paiement')
      }

      const charge = charges.data[0]
      const refundAmount = params.amount ? Math.round(params.amount * 100) : charge.amount

      const refund = await this.stripe.refunds.create({
        charge: charge.id,
        amount: refundAmount,
        reason: params.reason ? 'requested_by_customer' : 'duplicate',
        metadata: {
          reservationId: params.reservationId,
          reason: params.reason || 'Annulation de réservation'
        }
      })

      return {
        id: refund.id,
        amount: refund.amount / 100,
        currency: refund.currency,
        status: refund.status || 'pending'
      }
    } catch (error) {
      console.error('Erreur lors du remboursement Stripe:', error)
      throw error
    }
  }

  async confirmPayment(params: { paymentMethodId: string; reservationId: string }): Promise<{
    id: string
    status: string
  }> {
    try {
      const paymentIntents = await this.stripe.paymentIntents.list({
        limit: 10
      })

      const paymentIntent = paymentIntents.data.find((pi) => pi.metadata?.reservationId === params.reservationId)

      if (!paymentIntent) {
        throw new Error(`Aucun payment intent trouvé pour la réservation ${params.reservationId}`)
      }

      const confirmedIntent = await this.stripe.paymentIntents.confirm(paymentIntent.id, {
        payment_method: params.paymentMethodId
      })

      return {
        id: confirmedIntent.id,
        status: confirmedIntent.status
      }
    } catch (error) {
      console.error('Erreur lors de la confirmation de paiement Stripe:', error)
      throw error
    }
  }
}
