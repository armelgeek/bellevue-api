import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { z } from 'zod'
import { GetAvailabilityUseCase } from '@/application/use-cases/availability/get-availability.use-case'
import { ListAvailabilitiesUseCase } from '@/application/use-cases/availability/list-availabilities.use-case'
import { SetAvailabilityUseCase } from '@/application/use-cases/availability/set-availability.use-case'
import { AvailabilitySchema } from '@/domain/models/availability.model'
import { AvailabilityRepository } from '../repositories/availability.repository'
import type { Routes } from './types'

export class AvailabilityController implements Routes {
  public controller: OpenAPIHono
  private repository: AvailabilityRepository

  constructor() {
    this.controller = new OpenAPIHono()
    this.repository = new AvailabilityRepository()
    this.initRoutes()
  }

  public initRoutes() {
    // List Availabilities
    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/v1/availabilities',
        tags: ['Availabilities'],
        summary: 'List availabilities',
        responses: {
          200: {
            description: 'List of availabilities',
            content: {
              'application/json': {
                schema: z.object({ success: z.boolean(), data: z.array(AvailabilitySchema) })
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
          const useCase = new ListAvailabilitiesUseCase(this.repository)
          const query = c.req.valid?.('query') ?? c.req.query()
          const roomId = query.roomId
          if (!roomId) {
            return c.json({ success: false, error: 'roomId is required' }, 400)
          }
          const result = await useCase.execute({ roomId })
          if (!result.success) return c.json(result, 400)
          return c.json(result)
        } catch (error: any) {
          return c.json({ success: false, error: error.message }, 400)
        }
      }
    )

    // Get Availability
    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/v1/availabilities/{roomId}/{date}',
        tags: ['Availabilities'],
        summary: 'Get availability',
        request: {
          params: z.object({
            roomId: z.string().uuid(),
            date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) // ISO date format (YYYY-MM-DD)
          })
        },
        responses: {
          200: {
            description: 'Availability',
            content: {
              'application/json': {
                schema: z.object({ success: z.boolean(), data: AvailabilitySchema })
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
          const { roomId, date } = c.req.valid('param')
          const useCase = new GetAvailabilityUseCase(this.repository)
          const result = await useCase.execute({
            roomId,
            date: new Date(date)
          })
          if (!result.success) return c.json(result, 404)
          return c.json(result)
        } catch (error: any) {
          return c.json({ success: false, error: error.message }, 404)
        }
      }
    )

    // Set Availability (create/update)
    this.controller.openapi(
      createRoute({
        method: 'post',
        path: '/v1/admin/availabilities',
        tags: ['Availabilities'],
        summary: 'Set availability',
        request: {
          body: {
            content: {
              'application/json': {
                schema: AvailabilitySchema.omit({ id: true, createdAt: true, updatedAt: true })
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Availability set',
            content: {
              'application/json': {
                schema: z.object({ success: z.boolean(), data: AvailabilitySchema })
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
          const useCase = new SetAvailabilityUseCase(this.repository)
          const result = await useCase.execute(body)
          if (!result.success) return c.json(result, 400)
          return c.json(result, 201)
        } catch (error: any) {
          return c.json({ success: false, error: error.message }, 400)
        }
      }
    )
  }
}
