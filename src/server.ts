import { App } from './app'
import {
  AvailabilityController,
  BookingController,
  CurrencyController,
  FeatureController,
  HotelController,
  PaymentController,
  PolicyController,
  ReservationController,
  ReviewController,
  RoomImageController,
  RoomTypeController,
  RuleController,
  StripeWebhookController
} from './infrastructure/controllers'

const app = new App([
  new ReservationController(),
  new StripeWebhookController(),
  new PolicyController(),
  new FeatureController(),
  new CurrencyController(),
  new RoomTypeController(),
  new RoomImageController(),
  new ReviewController(),
  new RuleController(),
  new AvailabilityController(),
  new BookingController(),
  new PaymentController(),
  new HotelController()
]).getApp()

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
