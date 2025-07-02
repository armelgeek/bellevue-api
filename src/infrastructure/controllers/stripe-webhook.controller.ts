import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { z } from 'zod'
import { StripeWebhookUseCase } from '@/application/use-cases/payment/stripe-webhook.use-case'
import { StripePaymentService } from '@/core/services/stripe-payment.service'
import type { Routes } from './types'

export class StripeWebhookController implements Routes {
  public controller: OpenAPIHono
  private useCase: StripeWebhookUseCase

  constructor() {
    this.controller = new OpenAPIHono()
    this.useCase = new StripeWebhookUseCase(
      new StripePaymentService({
        apiKey: Bun.env.STRIPE_SECRET_KEY!,
        webhookSecret: Bun.env.STRIPE_WEBHOOK_SECRET!
      })
    )
    this.initRoutes()
  }

  public initRoutes() {
    this.controller.openapi(
      createRoute({
        method: 'post',
        path: '/v1/webhooks/stripe',
        tags: ['Webhooks'],
        summary: 'Stripe webhook',
        request: {
          body: {
            content: {
              'application/json': {
                schema: z.any()
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Webhook processed',
            content: {
              'application/json': {
                schema: z.object({ success: z.boolean() })
              }
            }
          },
          400: {
            description: 'Error',
            content: {
              'application/json': {
                schema: z.object({ success: z.boolean(), error: z.string() })
              }
            }
          }
        }
      }),
      async (c: any) => {
        try {
          const signature = c.req.header('stripe-signature')
          const body = await c.req.text()
          if (!signature) {
            return c.json({ success: false, error: 'Signature Stripe manquante' }, 400)
          }
          await this.useCase.execute(body, signature)
          return c.json({ success: true })
        } catch (error: any) {
          return c.json({ success: false, error: error.message }, 400)
        }
      }
    )
  }
}
