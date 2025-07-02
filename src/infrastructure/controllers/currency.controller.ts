import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { z } from 'zod'
import { CreateCurrencyUseCase } from '@/application/use-cases/currency/create-currency.use-case'
import { DeleteCurrencyUseCase } from '@/application/use-cases/currency/delete-currency.use-case'
import { ListCurrenciesUseCase } from '@/application/use-cases/currency/list-currencies.use-case'
import { UpdateCurrencyUseCase } from '@/application/use-cases/currency/update-currency.use-case'
import { CurrencySchema } from '@/domain/models/currency.model'
import { CurrencyRepository } from '../repositories/currency.repository'
import type { Routes } from './types'

export class CurrencyController implements Routes {
  public controller: OpenAPIHono
  private repository: CurrencyRepository

  constructor() {
    this.controller = new OpenAPIHono()
    this.repository = new CurrencyRepository()
    this.initRoutes()
  }

  public initRoutes() {
    // Create Currency
    this.controller.openapi(
      createRoute({
        method: 'post',
        path: '/v1/admin/currencies',
        tags: ['Currencies'],
        summary: 'Create currency',
        request: {
          body: {
            content: {
              'application/json': {
                schema: CurrencySchema.omit({ id: true, createdAt: true, updatedAt: true })
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Currency created',
            content: {
              'application/json': {
                schema: z.object({ success: z.boolean(), data: CurrencySchema })
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
          const useCase = new CreateCurrencyUseCase(this.repository)
          const result = await useCase.execute(body)
          if (!result.success) return c.json(result, 400)
          return c.json(result, 201)
        } catch (error: any) {
          return c.json({ success: false, error: error.message }, 400)
        }
      }
    )

    // List Currencies
    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/v1/currencies',
        tags: ['Currencies'],
        summary: 'List currencies',
        responses: {
          200: {
            description: 'List of currencies',
            content: {
              'application/json': {
                schema: z.object({ success: z.boolean(), data: z.array(CurrencySchema) })
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
          const useCase = new ListCurrenciesUseCase(this.repository)
          const result = await useCase.execute()
          if (!result.success) return c.json(result, 400)
          return c.json(result)
        } catch (error: any) {
          return c.json({ success: false, error: error.message }, 400)
        }
      }
    )

    // Update Currency
    this.controller.openapi(
      createRoute({
        method: 'put',
        path: '/v1/admin/currencies/{id}',
        tags: ['Currencies'],
        summary: 'Update currency',
        request: {
          params: z.object({ id: z.string().uuid() }),
          body: {
            content: {
              'application/json': {
                schema: CurrencySchema.omit({ id: true, createdAt: true, updatedAt: true }).partial()
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Currency updated',
            content: {
              'application/json': {
                schema: z.object({ success: z.boolean(), data: CurrencySchema })
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
          const useCase = new UpdateCurrencyUseCase(this.repository)
          const result = await useCase.execute({ id, ...body })
          if (!result.success) return c.json(result, 400)
          return c.json(result)
        } catch (error: any) {
          return c.json({ success: false, error: error.message }, 400)
        }
      }
    )

    // Delete Currency
    this.controller.openapi(
      createRoute({
        method: 'delete',
        path: '/v1/admin/currencies/{id}',
        tags: ['Currencies'],
        summary: 'Delete currency',
        request: {
          params: z.object({ id: z.string().uuid() })
        },
        responses: {
          200: {
            description: 'Currency deleted',
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
          const useCase = new DeleteCurrencyUseCase(this.repository)
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
