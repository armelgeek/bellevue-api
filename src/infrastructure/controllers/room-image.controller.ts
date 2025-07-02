import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { z } from 'zod'
import { CreateRoomImageUseCase } from '@/application/use-cases/room-image/create-room-image.use-case'
import { DeleteRoomImageUseCase } from '@/application/use-cases/room-image/delete-room-image.use-case'
import { GetRoomImageUseCase } from '@/application/use-cases/room-image/get-room-image.use-case'
import { ListRoomImagesUseCase } from '@/application/use-cases/room-image/list-room-images.use-case'
import { UpdateRoomImageUseCase } from '@/application/use-cases/room-image/update-room-image.use-case'
import { RoomImageSchema } from '@/domain/models/room-image.model'
import { RoomImageRepository } from '../repositories/room-image.repository'
import type { Routes } from './types'

export class RoomImageController implements Routes {
  public controller: OpenAPIHono
  private repository: RoomImageRepository

  constructor() {
    this.controller = new OpenAPIHono()
    this.repository = new RoomImageRepository()
    this.initRoutes()
  }

  public initRoutes() {
    // Create RoomImage
    this.controller.openapi(
      createRoute({
        method: 'post',
        path: '/v1/admin/room-images',
        tags: ['RoomImages'],
        summary: 'Create room image',
        request: {
          body: {
            content: {
              'application/json': {
                schema: RoomImageSchema.omit({ id: true, createdAt: true, updatedAt: true })
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Room image created',
            content: {
              'application/json': {
                schema: z.object({ success: z.boolean(), data: RoomImageSchema })
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
          const useCase = new CreateRoomImageUseCase(this.repository)
          const result = await useCase.execute(body)
          if (!result.success) return c.json(result, 400)
          return c.json(result, 201)
        } catch (error: any) {
          return c.json({ success: false, error: error.message }, 400)
        }
      }
    )

    // List RoomImages
    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/v1/room-images',
        tags: ['RoomImages'],
        summary: 'List room images',
        responses: {
          200: {
            description: 'List of room images',
            content: {
              'application/json': {
                schema: z.object({ success: z.boolean(), data: z.array(RoomImageSchema) })
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
          const useCase = new ListRoomImagesUseCase(this.repository)
          const result = await useCase.execute()
          if (!result.success) return c.json(result, 400)
          return c.json(result)
        } catch (error: any) {
          return c.json({ success: false, error: error.message }, 400)
        }
      }
    )

    // Get RoomImage by ID
    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/v1/room-images/{id}',
        tags: ['RoomImages'],
        summary: 'Get room image by id',
        request: {
          params: z.object({ id: z.string().uuid() })
        },
        responses: {
          200: {
            description: 'Room image found',
            content: {
              'application/json': {
                schema: z.object({ success: z.boolean(), data: RoomImageSchema })
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
          const useCase = new GetRoomImageUseCase(this.repository)
          const result = await useCase.execute({ id })
          if (!result.success) return c.json(result, 404)
          return c.json(result)
        } catch (error: any) {
          return c.json({ success: false, error: error.message }, 404)
        }
      }
    )

    // Update RoomImage
    this.controller.openapi(
      createRoute({
        method: 'put',
        path: '/v1/admin/room-images/{id}',
        tags: ['RoomImages'],
        summary: 'Update room image',
        request: {
          params: z.object({ id: z.string().uuid() }),
          body: {
            content: {
              'application/json': {
                schema: RoomImageSchema.omit({ id: true, createdAt: true, updatedAt: true }).partial()
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Room image updated',
            content: {
              'application/json': {
                schema: z.object({ success: z.boolean(), data: RoomImageSchema })
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
          const useCase = new UpdateRoomImageUseCase(this.repository)
          const result = await useCase.execute({ id, ...body })
          if (!result.success) return c.json(result, 400)
          return c.json(result)
        } catch (error: any) {
          return c.json({ success: false, error: error.message }, 400)
        }
      }
    )

    // Delete RoomImage
    this.controller.openapi(
      createRoute({
        method: 'delete',
        path: '/v1/admin/room-images/{id}',
        tags: ['RoomImages'],
        summary: 'Delete room image',
        request: {
          params: z.object({ id: z.string().uuid() })
        },
        responses: {
          200: {
            description: 'Room image deleted',
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
          const useCase = new DeleteRoomImageUseCase(this.repository)
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
