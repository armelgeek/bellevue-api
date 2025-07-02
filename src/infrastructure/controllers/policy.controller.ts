import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { z } from 'zod'
import { CreatePolicyUseCase } from '@/application/use-cases/policy/create-policy.use-case'
import { DeletePolicyUseCase } from '@/application/use-cases/policy/delete-policy.use-case'
import { GetPolicyUseCase } from '@/application/use-cases/policy/get-policy.use-case'
import { ListPoliciesUseCase } from '@/application/use-cases/policy/list-policies.use-case'
import { UpdatePolicyUseCase } from '@/application/use-cases/policy/update-policy.use-case'
import { PolicySchema } from '@/domain/models/policy.model'
import { PolicyRepository } from '@/infrastructure/repositories/policy.repository'
import type { Routes } from './types'

export class PolicyController implements Routes {
  public controller: OpenAPIHono
  private repository: PolicyRepository

  constructor() {
    this.controller = new OpenAPIHono()
    this.repository = new PolicyRepository()
    this.initRoutes()
  }

  public initRoutes() {
    // Create Policy
    this.controller.openapi(
      createRoute({
        method: 'post',
        path: '/v1/admin/policies',
        tags: ['Policies'],
        summary: 'Create policy',
        request: {
          body: {
            content: {
              'application/json': {
                schema: PolicySchema.omit({ id: true, createdAt: true, updatedAt: true })
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Policy created',
            content: {
              'application/json': {
                schema: z.object({ success: z.boolean(), data: PolicySchema })
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
      async (c) => {
        try {
          const body = await c.req.json()
          const useCase = new CreatePolicyUseCase(this.repository)
          const result = await useCase.execute(body)
          if (!result.success) return c.json(result, 400)
          return c.json(result, 201)
        } catch (error: any) {
          return c.json({ success: false, error: error.message }, 400)
        }
      }
    )

    // List Policies
    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/v1/policies',
        tags: ['Policies'],
        summary: 'List policies',
        responses: {
          200: {
            description: 'List of policies',
            content: {
              'application/json': {
                schema: z.object({ success: z.boolean(), data: z.array(PolicySchema) })
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
      async (c) => {
        try {
          const useCase = new ListPoliciesUseCase(this.repository)
          const result = await useCase.execute()
          if (!result.success) return c.json(result, 400)
          return c.json(result)
        } catch (error: any) {
          return c.json({ success: false, error: error.message }, 400)
        }
      }
    )

    // Get Policy by ID
    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/v1/policies/{id}',
        tags: ['Policies'],
        summary: 'Get policy by id',
        request: {
          params: z.object({ id: z.string().uuid() })
        },
        responses: {
          200: {
            description: 'Policy found',
            content: {
              'application/json': {
                schema: z.object({ success: z.boolean(), data: PolicySchema })
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
      async (c) => {
        try {
          const { id } = c.req.valid('param')
          const useCase = new GetPolicyUseCase(this.repository)
          const result = await useCase.execute({ id })
          if (!result.success) return c.json(result, 404)
          return c.json(result)
        } catch (error: any) {
          return c.json({ success: false, error: error.message }, 404)
        }
      }
    )

    // Update Policy
    this.controller.openapi(
      createRoute({
        method: 'put',
        path: '/v1/admin/policies/{id}',
        tags: ['Policies'],
        summary: 'Update policy',
        request: {
          params: z.object({ id: z.string().uuid() }),
          body: {
            content: {
              'application/json': {
                schema: PolicySchema.omit({ id: true, createdAt: true, updatedAt: true }).partial()
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Policy updated',
            content: {
              'application/json': {
                schema: z.object({ success: z.boolean(), data: PolicySchema })
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
      async (c) => {
        try {
          const { id } = c.req.valid('param')
          const body = await c.req.json()
          const useCase = new UpdatePolicyUseCase(this.repository)
          const result = await useCase.execute({ id, ...body })
          if (!result.success) return c.json(result, 400)
          return c.json(result)
        } catch (error: any) {
          return c.json({ success: false, error: error.message }, 400)
        }
      }
    )

    // Delete Policy
    this.controller.openapi(
      createRoute({
        method: 'delete',
        path: '/v1/admin/policies/{id}',
        tags: ['Policies'],
        summary: 'Delete policy',
        request: {
          params: z.object({ id: z.string().uuid() })
        },
        responses: {
          200: {
            description: 'Policy deleted',
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
      async (c) => {
        try {
          const { id } = c.req.valid('param')
          const useCase = new DeletePolicyUseCase(this.repository)
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
