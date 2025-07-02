import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { z } from 'zod'
import { ReservationSchema } from '@/domain/models/reservation.model'
import { DrizzleReservationRepository } from '../repositories/reservation.repository'
import type { Routes } from './types'

export class ReservationController implements Routes {
  public controller: OpenAPIHono
  private repository: DrizzleReservationRepository

  constructor() {
    this.controller = new OpenAPIHono()
    this.repository = new DrizzleReservationRepository()
    this.initRoutes()
  }

  public initRoutes() {
    // Create Reservation
    this.controller.openapi(
      createRoute({
        method: 'post',
        path: '/v1/reservations',
        tags: ['Reservations'],
        summary: 'Create reservation',
        request: {
          body: {
            content: {
              'application/json': {
                schema: ReservationSchema.omit({ id: true, createdAt: true, updatedAt: true })
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Reservation created',
            content: {
              'application/json': {
                schema: z.object({ success: z.boolean(), data: ReservationSchema })
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
          // TODO: call use case
          const reservation = await this.repository.create(body)
          return c.json({ success: true, data: reservation })
        } catch (error: any) {
          return c.json({ success: false, error: error.message }, 400)
        }
      }
    )
  }
}
