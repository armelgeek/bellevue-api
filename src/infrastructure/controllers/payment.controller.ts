import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { z } from 'zod'
import { CreatePaymentUseCase } from '@/application/use-cases/payment/create-payment.use-case'
import { GetPaymentUseCase } from '@/application/use-cases/payment/get-payment.use-case'
import { ListPaymentsUseCase } from '@/application/use-cases/payment/list-payments.use-case'
import { PaymentSchema } from '@/domain/models/payment.model'
import { PaymentRepository } from '../repositories/payment.repository'
import type { Routes } from './types'

export class PaymentController implements Routes {
  public controller: OpenAPIHono
  private repository: PaymentRepository

  constructor() {
    this.controller = new OpenAPIHono()
    this.repository = new PaymentRepository()
    this.initRoutes()
  }

  public initRoutes() {
    // Create Payment
    this.controller.openapi(
      createRoute({
        method: 'post',
        path: '/v1/payments',
        tags: ['Payments'],
        summary: 'Create payment',
        request: {
          body: {
            content: {
              'application/json': {
                schema: PaymentSchema.omit({ id: true, createdAt: true, updatedAt: true })
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Payment created',
            content: {
              'application/json': {
                schema: z.object({ success: z.boolean(), data: PaymentSchema })
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
          const body = await c.req.json()
          const useCase = new CreatePaymentUseCase(this.repository)
          const result = await useCase.execute(body)
          if (!result.success) return c.json(result, 400)
          return c.json(result, 201)
        } catch (error: any) {
          return c.json({ success: false, error: error.message }, 400)
        }
      }
    )

    // List Payments
    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/v1/payments',
        tags: ['Payments'],
        summary: 'List payments',
        responses: {
          200: {
            description: 'List of payments',
            content: {
              'application/json': {
                schema: z.object({ success: z.boolean(), data: z.array(PaymentSchema) })
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
          const useCase = new ListPaymentsUseCase(this.repository)
          const query = c.req.valid?.('query') ?? c.req.query?.() ?? {}
          const bookingId = query.bookingId

          if (!bookingId) {
            return c.json({ success: false, error: 'bookingId is required' }, 400)
          }

          const result = await useCase.execute({ bookingId })
          if (!result.success) return c.json(result, 400)
          return c.json(result)
        } catch (error: any) {
          return c.json({ success: false, error: error.message }, 400)
        }
      }
    )

    // Get Payment
    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/v1/payments/{id}',
        tags: ['Payments'],
        summary: 'Get payment',
        request: {
          params: z.object({ id: z.string().uuid() })
        },
        responses: {
          200: {
            description: 'Payment',
            content: {
              'application/json': {
                schema: z.object({ success: z.boolean(), data: PaymentSchema })
              }
            }
          },
          404: {
            description: 'Not found',
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
          const { id } = c.req.valid('param')
          const useCase = new GetPaymentUseCase(this.repository)
          const result = await useCase.execute({ id })
          if (!result.success) return c.json(result, 404)
          return c.json(result)
        } catch (error: any) {
          return c.json({ success: false, error: error.message }, 404)
        }
      }
    )
  }
}
