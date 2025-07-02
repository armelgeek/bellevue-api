import type { ReservationService } from '../../../core/services/reservation.service'
import type { ReservationBase } from '../../../core/types/reservation.type'

export class CreateReservationUseCase {
  constructor(private readonly reservationService: ReservationService) {}

  execute(data: ReservationBase) {
    return this.reservationService.create(data)
  }
}
