import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { z } from 'zod'
import { GetHotelUseCase } from '@/application/use-cases/hotel/get-hotel.use-case'
import { UpdateHotelUseCase } from '@/application/use-cases/hotel/update-hotel.use-case'
import { HotelSchema } from '@/domain/models/hotel.model'
import { HotelRepository } from '../repositories/hotel.repository'
import type { Routes } from './types'

export class HotelController implements Routes {
  public controller: OpenAPIHono
  private repository: HotelRepository

  constructor() {
    this.controller = new OpenAPIHono()
    this.repository = new HotelRepository()
    this.initRoutes()
  }

  public initRoutes() {
    // Get Hotel
    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/v1/hotel',
        tags: ['Hotel'],
        summary: 'Get hotel',
        responses: {
          200: {
            description: 'Hotel',
            content: {
              'application/json': {
                schema: z.object({ success: z.boolean(), data: HotelSchema })
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
          const useCase = new GetHotelUseCase(this.repository)
          const result = await useCase.execute()
          if (!result.success) return c.json(result, 404)
          return c.json(result)
        } catch (error: any) {
          return c.json({ success: false, error: error.message }, 404)
        }
      }
    )

    // Update Hotel
    this.controller.openapi(
      createRoute({
        method: 'put',
        path: '/v1/admin/hotel',
        tags: ['Hotel'],
        summary: 'Update hotel',
        request: {
          body: {
            content: {
              'application/json': {
                schema: HotelSchema.omit({ id: true, createdAt: true, updatedAt: true }).partial()
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Hotel updated',
            content: {
              'application/json': {
                schema: z.object({ success: z.boolean(), data: HotelSchema })
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
          const useCase = new UpdateHotelUseCase(this.repository)
          const result = await useCase.execute(body)
          if (!result.success) return c.json(result, 400)
          return c.json(result)
        } catch (error: any) {
          return c.json({ success: false, error: error.message }, 400)
        }
      }
    )
  }
}
