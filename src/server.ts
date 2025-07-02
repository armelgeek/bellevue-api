import { App } from './app'
import { ReservationRoutes } from './infrastructure/api/reservation.route'
import { ResourceRoutes } from './infrastructure/api/resource.routes'

const app = new App([new ReservationRoutes(), new ResourceRoutes()]).getApp()

const PORT = Bun.env.PORT || 3000

console.info(`
\u001B[34m╔══════════════════════════════════════════════════════╗
║               \u001B[1mBOILER HONO API\u001B[0m\u001B[34m                ║
╠══════════════════════════════════════════════════════╣
║                                                      ║
║  \u001B[0m🚀 Server started successfully                   \u001B[34m║
║                                                      ║
╚══════════════════════════════════════════════════════╝\u001B[0m
`)

export default app
