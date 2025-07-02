import { auth } from '../config/auth.config'
import type { Context, Next } from 'hono'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: string
  isAdmin: boolean
}

export interface AuthContext extends Context {
  user?: AuthUser
}

export async function authMiddleware(c: Context, next: Next) {
  try {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers
    })

    if (session?.user) {
      c.set('user', {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role || 'user',
        isAdmin: session.user.isAdmin || false
      })
    }

    await next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    await next()
  }
}

export function requireAuth(c: Context, next: Next) {
  const user = c.get('user')

  if (!user) {
    return c.json({ message: 'Authentication required' }, 401)
  }

  return next()
}
