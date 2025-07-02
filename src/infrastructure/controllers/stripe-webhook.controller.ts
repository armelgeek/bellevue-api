import type { StripeWebhookUseCase } from '@/application/use-cases/payment/stripe-webhook.use-case'

export class StripeWebhookController {
  constructor(private readonly stripeWebhookUseCase: StripeWebhookUseCase) {}

  handle(body: string, signature: string) {
    return this.stripeWebhookUseCase.execute(body, signature)
  }

  static extractWebhookData(request: any): { body: string; signature: string } {
    const signature = request.headers['stripe-signature']
    const body = request.body

    if (!signature) {
      throw new Error('Signature Stripe manquante')
    }

    return { body, signature }
  }
}
