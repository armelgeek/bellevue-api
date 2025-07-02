import type { MiddlewareHandler } from 'hono'
import type { ContentfulStatusCode, StatusCode } from 'hono/utils/http-status'

export const responseMiddleware = (): MiddlewareHandler => {
  return async (c, next) => {
    c.successResponse = <T>(data: T, message?: string, statusCode: StatusCode = 200) => {
      return c.json(
        {
          success: true,
          data,
          message
        },
        statusCode as unknown as ContentfulStatusCode
      )
    }

    c.paginatedResponse = <T>(
      data: T,
      pagination: { page: number; limit: number; totalItems: number; totalPages: number },
      message?: string,
      statusCode: StatusCode = 200
    ) => {
      return c.json(
        {
          success: true,
          data,
          pagination,
          message
        },
        statusCode as unknown as ContentfulStatusCode
      )
    }

    c.errorResponse = (message: string, statusCode: StatusCode = 400) => {
      return c.json(
        {
          success: false,
          message
        },
        statusCode as unknown as ContentfulStatusCode
      )
    }
    await next()
  }
}

declare module 'hono' {
  interface Context {
    successResponse: <T>(data: T, message?: string, statusCode?: StatusCode) => Response
    paginatedResponse: <T>(
      data: T,
      pagination: { page: number; limit: number; totalItems: number; totalPages: number },
      message?: string,
      statusCode?: StatusCode
    ) => Response
    errorResponse: (message: string, statusCode?: StatusCode) => Response
  }
}
