import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { z } from 'zod'
import { CreateFeatureUseCase } from '@/application/use-cases/feature/create-feature.use-case'
import { DeleteFeatureUseCase } from '@/application/use-cases/feature/delete-feature.use-case'
import { ListFeaturesUseCase } from '@/application/use-cases/feature/list-features.use-case'
import { UpdateFeatureUseCase } from '@/application/use-cases/feature/update-feature.use-case'
import { FeatureSchema } from '@/domain/models/feature.model'
import { FeatureRepository } from '../repositories/feature.repository'
import type { Routes } from './types'

export class FeatureController implements Routes {
  public controller: OpenAPIHono
  private repository: FeatureRepository

  constructor() {
    this.controller = new OpenAPIHono()
    this.repository = new FeatureRepository()
    this.initRoutes()
  }

  public initRoutes() {
    // Create Feature
    this.controller.openapi(
      createRoute({
        method: 'post',
        path: '/v1/admin/features',
        tags: ['Features'],
        summary: 'Create feature',
        request: {
          body: {
            content: {
              'application/json': {
                schema: FeatureSchema.omit({ id: true, createdAt: true, updatedAt: true })
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Feature created',
            content: {
              'application/json': {
                schema: z.object({ success: z.boolean(), data: FeatureSchema })
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
          const useCase = new CreateFeatureUseCase(this.repository)
          const result = await useCase.execute(body)
          if (!result.success) return c.json(result, 400)
          return c.json(result, 201)
        } catch (error: any) {
          return c.json({ success: false, error: error.message }, 400)
        }
      }
    )

    // List Features
    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/v1/features',
        tags: ['Features'],
        summary: 'List features',
        responses: {
          200: {
            description: 'List of features',
            content: {
              'application/json': {
                schema: z.object({ success: z.boolean(), data: z.array(FeatureSchema) })
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
          const useCase = new ListFeaturesUseCase(this.repository)
          const result = await useCase.execute()
          if (!result.success) return c.json(result, 400)
          return c.json(result)
        } catch (error: any) {
          return c.json({ success: false, error: error.message }, 400)
        }
      }
    )

    // Update Feature
    this.controller.openapi(
      createRoute({
        method: 'put',
        path: '/v1/admin/features/{id}',
        tags: ['Features'],
        summary: 'Update feature',
        request: {
          params: z.object({ id: z.string().uuid() }),
          body: {
            content: {
              'application/json': {
                schema: FeatureSchema.omit({ id: true, createdAt: true, updatedAt: true }).partial()
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Feature updated',
            content: {
              'application/json': {
                schema: z.object({ success: z.boolean(), data: FeatureSchema })
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
          const useCase = new UpdateFeatureUseCase(this.repository)
          const result = await useCase.execute({ id, ...body })
          if (!result.success) return c.json(result, 400)
          return c.json(result)
        } catch (error: any) {
          return c.json({ success: false, error: error.message }, 400)
        }
      }
    )

    // Delete Feature
    this.controller.openapi(
      createRoute({
        method: 'delete',
        path: '/v1/admin/features/{id}',
        tags: ['Features'],
        summary: 'Delete feature',
        request: {
          params: z.object({ id: z.string().uuid() })
        },
        responses: {
          200: {
            description: 'Feature deleted',
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
          const useCase = new DeleteFeatureUseCase(this.repository)
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
