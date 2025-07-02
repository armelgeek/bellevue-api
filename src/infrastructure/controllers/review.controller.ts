import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { z } from 'zod'
import { CreateReviewUseCase } from '@/application/use-cases/review/create-review.use-case'
import { DeleteReviewUseCase } from '@/application/use-cases/review/delete-review.use-case'
import { GetReviewUseCase } from '@/application/use-cases/review/get-review.use-case'
import { ListReviewsUseCase } from '@/application/use-cases/review/list-reviews.use-case'
import { UpdateReviewUseCase } from '@/application/use-cases/review/update-review.use-case'
import { ReviewSchema } from '@/domain/models/review.model'
import { ReviewRepository } from '@/infrastructure/repositories/review.repository'
import type { Routes } from './types'

export class ReviewController implements Routes {
  public controller: OpenAPIHono
  private repository: ReviewRepository

  constructor() {
    this.controller = new OpenAPIHono()
    this.repository = new ReviewRepository()
    this.initRoutes()
  }

  public initRoutes() {
    // Create Review
    this.controller.openapi(
      createRoute({
        method: 'post',
        path: '/v1/reviews',
        tags: ['Reviews'],
        summary: 'Create review',
        request: {
          body: {
            content: {
              'application/json': {
                schema: ReviewSchema.omit({ id: true, createdAt: true, updatedAt: true })
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Review created',
            content: {
              'application/json': {
                schema: z.object({ success: z.boolean(), data: ReviewSchema })
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
          const useCase = new CreateReviewUseCase(this.repository)
          const result = await useCase.execute(body)
          if (!result.success) return c.json(result, 400)
          return c.json(result, 201)
        } catch (error: any) {
          return c.json({ success: false, error: error.message }, 400)
        }
      }
    )

    // List Reviews
    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/v1/reviews',
        tags: ['Reviews'],
        summary: 'List reviews',
        responses: {
          200: {
            description: 'List of reviews',
            content: {
              'application/json': {
                schema: z.object({ success: z.boolean(), data: z.array(ReviewSchema) })
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
          const useCase = new ListReviewsUseCase(this.repository)
          const result = await useCase.execute()
          if (!result.success) return c.json(result, 400)
          return c.json(result)
        } catch (error: any) {
          return c.json({ success: false, error: error.message }, 400)
        }
      }
    )

    // Get Review by ID
    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/v1/reviews/{id}',
        tags: ['Reviews'],
        summary: 'Get review by id',
        request: {
          params: z.object({ id: z.string().uuid() })
        },
        responses: {
          200: {
            description: 'Review found',
            content: {
              'application/json': {
                schema: z.object({ success: z.boolean(), data: ReviewSchema })
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
          const useCase = new GetReviewUseCase(this.repository)
          const result = await useCase.execute({ id })
          if (!result.success) return c.json(result, 404)
          return c.json(result)
        } catch (error: any) {
          return c.json({ success: false, error: error.message }, 404)
        }
      }
    )

    // Update Review
    this.controller.openapi(
      createRoute({
        method: 'put',
        path: '/v1/reviews/{id}',
        tags: ['Reviews'],
        summary: 'Update review',
        request: {
          params: z.object({ id: z.string().uuid() }),
          body: {
            content: {
              'application/json': {
                schema: ReviewSchema.omit({ id: true, createdAt: true, updatedAt: true }).partial()
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Review updated',
            content: {
              'application/json': {
                schema: z.object({ success: z.boolean(), data: ReviewSchema })
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
          const useCase = new UpdateReviewUseCase(this.repository)
          const result = await useCase.execute({ id, ...body })
          if (!result.success) return c.json(result, 400)
          return c.json(result)
        } catch (error: any) {
          return c.json({ success: false, error: error.message }, 400)
        }
      }
    )

    // Delete Review
    this.controller.openapi(
      createRoute({
        method: 'delete',
        path: '/v1/reviews/{id}',
        tags: ['Reviews'],
        summary: 'Delete review',
        request: {
          params: z.object({ id: z.string().uuid() })
        },
        responses: {
          200: {
            description: 'Review deleted',
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
          const useCase = new DeleteReviewUseCase(this.repository)
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
