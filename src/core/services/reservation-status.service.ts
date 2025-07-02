import type { ReservationRepository } from '../repositories/base.repositories'
import type { ReservationBase } from '../types/reservation.type'

export class ReservationStatusService {
  constructor(private readonly reservationRepository: ReservationRepository) {}

  private isValidStatusTransition(
    currentStatus: ReservationBase['status'],
    newStatus: ReservationBase['status']
  ): boolean {
    const validTransitions: Record<ReservationBase['status'], ReservationBase['status'][]> = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['completed', 'cancelled']
    }

    return validTransitions[currentStatus]?.includes(newStatus) ?? false
  }

  async updateStatus(
    reservationId: string,
    newStatus: ReservationBase['status'],
    userId?: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const reservation = await this.reservationRepository.findById(reservationId)

      if (!reservation) {
        return { success: false, message: 'Réservation non trouvée' }
      }

      if (userId && reservation.userId !== userId) {
        return { success: false, message: 'Accès non autorisé à cette réservation' }
      }

      if (!this.isValidStatusTransition(reservation.status, newStatus)) {
        return {
          success: false,
          message: `Transition de statut invalide: ${reservation.status} -> ${newStatus}`
        }
      }

      await this.reservationRepository.updateStatus(reservationId, newStatus)

      return { success: true, message: 'Statut mis à jour avec succès' }
    } catch {
      return { success: false, message: 'Erreur interne lors de la mise à jour' }
    }
  }

  async cancelForFailedPayment(reservationId: string): Promise<void> {
    try {
      const reservation = await this.reservationRepository.findById(reservationId)

      if (reservation && reservation.status === 'pending') {
        await this.reservationRepository.updateStatus(reservationId, 'cancelled')
      }
    } catch {}
  }

  async confirmForSuccessfulPayment(reservationId: string): Promise<void> {
    try {
      const reservation = await this.reservationRepository.findById(reservationId)

      if (reservation && reservation.status === 'pending') {
        await this.reservationRepository.updateStatus(reservationId, 'confirmed')
      }
    } catch {}
  }
}
