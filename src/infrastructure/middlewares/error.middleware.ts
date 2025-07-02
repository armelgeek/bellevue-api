import { HTTPException } from 'hono/http-exception'
import type { ErrorHandler, NotFoundHandler } from 'hono'
import type { ContentfulStatusCode, StatusCode } from 'hono/utils/http-status'

export const errorHandler: ErrorHandler = (err, c) => {
  const currentStatus = 'status' in err ? err.status : c.newResponse(null).status

  const statusCode = currentStatus !== 200 ? (currentStatus as StatusCode) : 500
  const env = c.env?.NODE_ENV
  return c.json(
    {
      success: false,
      message: err?.message || 'Internal Server Error',
      stack: env ? null : err?.stack
    },
    statusCode as ContentfulStatusCode
  )
}

export const notFound: NotFoundHandler = (c) => {
  return c.json(
    {
      success: false,
      message: `Not Found - [${c.req.method}]:[${c.req.url}]`
    },
    404
  )
}

export class ValidationError extends HTTPException {
  details: Record<string, any>
  message: string

  constructor(message: string, details: Record<string, any> = {}, statusCode: ContentfulStatusCode = 500) {
    const errorResponse = new Response(
      JSON.stringify({
        error: 'Validation Error',
        message,
        details
      }),
      {
        status: statusCode
      }
    )
    super(statusCode, { res: errorResponse })
    this.details = details
    this.message = message
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UnauthorizedError'
  }
}

export function errorMiddleware(err: Error) {
  if (err instanceof UnauthorizedError) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  console.error(err)
  return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' }
  })
}

export default errorHandler

