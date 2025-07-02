import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { z } from 'zod'
import { CreateBookingUseCase } from '@/application/use-cases/booking/create-booking.use-case'
import { GetBookingUseCase } from '@/application/use-cases/booking/get-booking.use-case'
import { ListBookingsUseCase } from '@/application/use-cases/booking/list-bookings.use-case'
import { BookingSchema } from '@/domain/models/booking.model'
import { BookingRepository } from '../repositories/booking.repository'
import type { Routes } from './types'

export class BookingController implements Routes {
  public controller: OpenAPIHono
  private repository: BookingRepository

  constructor() {
    this.controller = new OpenAPIHono()
    this.repository = new BookingRepository()
    this.initRoutes()
  }

  public initRoutes() {
    // Create Booking
    this.controller.openapi(
      createRoute({
        method: 'post',
        path: '/v1/bookings',
        tags: ['Bookings'],
        summary: 'Create booking',
        request: {
          body: {
            content: {
              'application/json': {
                schema: BookingSchema.omit({ id: true, createdAt: true, updatedAt: true })
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Booking created',
            content: {
              'application/json': {
                schema: z.object({ success: z.boolean(), data: BookingSchema })
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
          const useCase = new CreateBookingUseCase(this.repository)
          const result = await useCase.execute(body)
          if (!result.success) return c.json(result, 400)
          return c.json(result, 201)
        } catch (error: any) {
          return c.json({ success: false, error: error.message }, 400)
        }
      }
    )

    // List Bookings
    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/v1/bookings',
        tags: ['Bookings'],
        summary: 'List bookings',
        responses: {
          200: {
            description: 'List of bookings',
            content: {
              'application/json': {
                schema: z.object({ success: z.boolean(), data: z.array(BookingSchema) })
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
          const useCase = new ListBookingsUseCase(this.repository)
          // You can extract pagination from query params if needed
          const query = c.req.valid?.('query') ?? c.req.query?.() ?? {}
          const skip = query.skip ? Number(query.skip) : 0
          const limit = query.limit ? Number(query.limit) : 20
          const result = await useCase.execute({ skip, limit })
          if (!result.success) return c.json(result, 400)
          return c.json(result)
        } catch (error: any) {
          return c.json({ success: false, error: error.message }, 400)
        }
      }
    )

    // Get Booking
    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/v1/bookings/{id}',
        tags: ['Bookings'],
        summary: 'Get booking',
        request: {
          params: z.object({ id: z.string().uuid() })
        },
        responses: {
          200: {
            description: 'Booking',
            content: {
              'application/json': {
                schema: z.object({ success: z.boolean(), data: BookingSchema })
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
          const useCase = new GetBookingUseCase(this.repository)
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
