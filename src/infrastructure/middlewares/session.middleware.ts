import { auth } from '../config/auth.config'
import type { Context, Next } from 'hono'

const addSession = async (c: Context, next: Next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers })

  if (!session) {
    c.set('user', null as unknown as { id: string; email: string; permissions: []; isAdmin?: boolean })
    c.set('session', null)
    return next()
  }

  const authUser = {
    id: session.user.id,
    email: session.user.email,
    permissions: [],
    isAdmin: session.user.isAdmin
  }
  c.set('user', authUser)
  c.set('session', session.session)

  return next()
}

export default addSession
