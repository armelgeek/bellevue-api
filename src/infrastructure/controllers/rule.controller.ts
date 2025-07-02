import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { z } from 'zod'
import { ListRulesUseCase } from '@/application/use-cases/rule/list-rules.use-case'
import { RuleSchema } from '@/domain/models/rule.model'
import { RuleRepository } from '../repositories/rule.repository'
import type { Routes } from './types'

export class RuleController implements Routes {
  public controller: OpenAPIHono
  private repository: RuleRepository

  constructor() {
    this.controller = new OpenAPIHono()
    this.repository = new RuleRepository()
    this.initRoutes()
  }

  public initRoutes() {
    // List Rules
    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/v1/rules',
        tags: ['Rules'],
        summary: 'List rules',
        responses: {
          200: {
            description: 'List of rules',
            content: {
              'application/json': {
                schema: z.object({ success: z.boolean(), data: z.array(RuleSchema) })
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
          const useCase = new ListRulesUseCase(this.repository)
          const result = await useCase.execute()
          if (!result.success) return c.json(result, 400)
          return c.json(result)
        } catch (error: any) {
          return c.json({ success: false, error: error.message }, 400)
        }
      }
    )
  }
}
