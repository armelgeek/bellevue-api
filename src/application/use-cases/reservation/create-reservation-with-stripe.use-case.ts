import type { ReservationRepository } from '../../../core/repositories/base.repositories'
import type { StripePaymentService } from '../../../core/services/stripe-payment.service'
import type { PaymentBase } from '../../../core/types/payment.type'
import type { ReservationBase } from '../../../core/types/reservation.type'

export class CreateReservationWithStripeUseCase {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    private readonly stripeService: StripePaymentService
  ) {}

  async execute(reservation: ReservationBase, payment: PaymentBase) {
    const isAvailable = await this.reservationRepository.checkResourceAvailability(
      reservation.resourceId,
      reservation.startDate,
      reservation.endDate
    )

    if (!isAvailable) {
      throw new Error("La ressource n'est pas disponible pour ces dates")
    }

    const createdReservation = await this.reservationRepository.create(reservation)
    const checkoutSession = await this.stripeService.createCheckoutSession({
      amount: payment.amount,
      currency: payment.currency,
      metadata: {
        reservationId: createdReservation.id,
        userId: reservation.userId
      },
      successUrl: `${Bun.env.REACT_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${Bun.env.REACT_APP_URL}/cancel`
    })

    return { reservation: createdReservation, checkoutUrl: checkoutSession.url }
  }
}
