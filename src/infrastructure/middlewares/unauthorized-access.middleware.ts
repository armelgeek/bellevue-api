import { ValidationError } from './error.middleware'
import type { Context, Next } from 'hono'

const sessionValidator = (c: Context, next: Next) => {
  const user = c.get('user')
  const path = c.req.path

  if (path.startsWith('/api/v1') && !user) {
    throw new ValidationError(
      'Unauthorized access attempt detected.',
      {
        action: 'access_protected_resource',
        requiredPermission: 'user',
        receivedPermission: 'unauthorized'
      },
      401
    )
  }

  return next()
}

export default sessionValidator
