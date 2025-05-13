import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { z } from 'zod'
import { CreateRoomTypeUseCase } from '@/application/use-cases/room-type/create-room-type.use-case'
import { DeleteRoomTypeUseCase } from '@/application/use-cases/room-type/delete-room-type.use-case'
import { ListRoomTypesUseCase } from '@/application/use-cases/room-type/list-room-types.use-case'
import { UpdateRoomTypeUseCase } from '@/application/use-cases/room-type/update-room-type.use-case'
import { RoomTypeSchema } from '@/domain/models/room-type.model'
import { RoomTypeRepository } from '../repositories/room-type.repository'
import type { Routes } from './types'

export class RoomTypeController implements Routes {
  public controller: OpenAPIHono
  private repository: RoomTypeRepository

  constructor() {
    this.controller = new OpenAPIHono()
    this.repository = new RoomTypeRepository()
    this.initRoutes()
  }

  public initRoutes() {
    // Create RoomType
    this.controller.openapi(
      createRoute({
        method: 'post',
        path: '/v1/admin/room-types',
        tags: ['RoomTypes'],
        summary: 'Create room type',
        request: {
          body: {
            content: {
              'application/json': {
                schema: RoomTypeSchema.omit({ id: true, createdAt: true, updatedAt: true })
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Room type created',
            content: {
              'application/json': {
                schema: z.object({ success: z.boolean(), data: RoomTypeSchema })
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
          const useCase = new CreateRoomTypeUseCase(this.repository)
          const result = await useCase.execute(body)
          if (!result.success) return c.json(result, 400)
          return c.json(result, 201)
        } catch (error: any) {
          return c.json({ success: false, error: error.message }, 400)
        }
      }
    )

    // List RoomTypes
    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/v1/room-types',
        tags: ['RoomTypes'],
        summary: 'List room types',
        responses: {
          200: {
            description: 'List of room types',
            content: {
              'application/json': {
                schema: z.object({ success: z.boolean(), data: z.array(RoomTypeSchema) })
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
          const useCase = new ListRoomTypesUseCase(this.repository)
          const result = await useCase.execute()
          if (!result.success) return c.json(result, 400)
          return c.json(result)
        } catch (error: any) {
          return c.json({ success: false, error: error.message }, 400)
        }
      }
    )

    // Update RoomType
    this.controller.openapi(
      createRoute({
        method: 'put',
        path: '/v1/admin/room-types/{id}',
        tags: ['RoomTypes'],
        summary: 'Update room type',
        request: {
          params: z.object({ id: z.string().uuid() }),
          body: {
            content: {
              'application/json': {
                schema: RoomTypeSchema.omit({ id: true, createdAt: true, updatedAt: true }).partial()
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Room type updated',
            content: {
              'application/json': {
                schema: z.object({ success: z.boolean(), data: RoomTypeSchema })
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
          const { id } = c.req.valid('param')
          const body = await c.req.json()
          const useCase = new UpdateRoomTypeUseCase(this.repository)
          const result = await useCase.execute({ id, ...body })
          if (!result.success) return c.json(result, 400)
          return c.json(result)
        } catch (error: any) {
          return c.json({ success: false, error: error.message }, 400)
        }
      }
    )

    // Delete RoomType
    this.controller.openapi(
      createRoute({
        method: 'delete',
        path: '/v1/admin/room-types/{id}',
        tags: ['RoomTypes'],
        summary: 'Delete room type',
        request: {
          params: z.object({ id: z.string().uuid() })
        },
        responses: {
          200: {
            description: 'Room type deleted',
            content: {
              'application/json': {
                schema: z.object({ success: z.boolean() })
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
          const useCase = new DeleteRoomTypeUseCase(this.repository)
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
