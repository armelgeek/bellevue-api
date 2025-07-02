import type { ReservationRepository } from '../../core/repositories/base.repositories'
import type { ReservationBase } from '../../core/types/reservation.type'

export class ReservationController {
  constructor(private readonly reservationRepository: ReservationRepository) {}

  async createReservation(data: ReservationBase) {
    return await this.reservationRepository.create(data)
  }

  async updateReservation(data: ReservationBase) {
    return await this.reservationRepository.update(data)
  }

  async cancelReservation(id: string) {
    await this.reservationRepository.updateStatus(id, 'cancelled')
    return { message: 'Réservation annulée', id }
  }

  async getReservationById(id: string) {
    return await this.reservationRepository.findById(id)
  }

  async updateReservationStatus(id: string, status: ReservationBase['status']) {
    await this.reservationRepository.updateStatus(id, status)
    return { message: 'Statut mis à jour', id, status }
  }
}
