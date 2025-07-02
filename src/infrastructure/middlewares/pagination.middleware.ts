import { z } from '@hono/zod-openapi'
import type { Context } from 'hono'

export interface PaginationParams {
  page: number
  limit: number
  skip: number
}

export const paginationSchema = z.object({
  page: z.string().regex(/^\d+$/).default('1').transform(Number),
  limit: z.string().regex(/^\d+$/).default('10').transform(Number)
})

export async function paginationMiddleware(c: Context, next: Function) {
  const query = c.req.query()

  try {
    const { page, limit } = paginationSchema.parse({
      page: query.page || '1',
      limit: query.limit || '10'
    })

    c.set('pagination', {
      page,
      limit,
      skip: (page - 1) * limit
    })

    await next()
  } catch {
    return c.json(
      {
        success: false,
        error: 'Invalid pagination parameters'
      },
      400
    )
  }
}
