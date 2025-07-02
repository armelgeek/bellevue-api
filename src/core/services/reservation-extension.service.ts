import type { ReservationRepository } from '../repositories/base.repositories'
import type { ReservationBase } from '../types/reservation.type'

export interface ExtensionCost {
  canExtend: boolean
  additionalCost: number
  currency: string
  newEndDate: Date
  conflictingReservations: string[]
  extendedDurationHours: number
}

export interface ExtensionResult {
  success: boolean
  reservation?: ReservationBase
  paymentRequired: boolean
  paymentUrl?: string
  additionalCost: number
  message?: string
}

export class ReservationExtensionService {

  constructor(private readonly reservationRepository: ReservationRepository) {}

  /**
   * Calculer le coût d'extension d'une réservation
   */
  async calculateExtensionCost(reservationId: string, newEndDate: Date): Promise<ExtensionCost> {
    const reservation = await this.reservationRepository.findById(reservationId)
    if (!reservation) {
      throw new Error('Réservation non trouvée')
    }

    const currentEndDate = reservation.endDate

    if (newEndDate <= currentEndDate) {
      throw new Error('La nouvelle date de fin doit être postérieure à la date de fin actuelle')
    }

    const extendedDurationHours = (newEndDate.getTime() - currentEndDate.getTime()) / (1000 * 60 * 60)

    const isAvailable = await this.reservationRepository.checkResourceAvailability(
      reservation.resourceId,
      currentEndDate,
      newEndDate,
    )

    let conflictingReservations: string[] = []
    if (!isAvailable) {
      const conflicts = await this.reservationRepository.findByResourceAndDateRange(
        reservation.resourceId,
        currentEndDate,
        newEndDate
      )
      conflictingReservations = conflicts.map((r) => r.id)
    }

    const additionalCost = isAvailable ? Math.ceil(extendedDurationHours * this.hourlyRate) : 0

    return {
      canExtend: isAvailable,
      additionalCost,
      currency: 'eur',
      newEndDate,
      conflictingReservations,
      extendedDurationHours
    }
  }

  /**
   * Valider qu'une réservation peut être étendue
   */
  validateExtension(
    reservation: ReservationBase,
    newEndDate: Date,
    userId: string
  ): { valid: boolean; message?: string } {
    if (reservation.userId !== userId) {
      return { valid: false, message: 'Non autorisé à modifier cette réservation' }
    }

    if (!['pending', 'confirmed'].includes(reservation.status)) {
      return { valid: false, message: 'Cette réservation ne peut plus être modifiée' }
    }

    const now = new Date()
    if (newEndDate <= now) {
      return { valid: false, message: 'La nouvelle date de fin doit être dans le futur' }
    }

    const maxExtensionHours = 24
    const extendedDurationHours = (newEndDate.getTime() - reservation.endDate.getTime()) / (1000 * 60 * 60)

    if (extendedDurationHours > maxExtensionHours) {
      return {
        valid: false,
        message: `L'extension ne peut pas dépasser ${maxExtensionHours} heures`
      }
    }

    const maxFutureDays = 30
    const daysDifference = (newEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)

    if (daysDifference > maxFutureDays) {
      return {
        valid: false,
        message: `La réservation ne peut pas être programmée au-delà de ${maxFutureDays} jours`
      }
    }

    return { valid: true }
  }

  /**
   * Calculer le prix par heure en fonction de différents facteurs
   */
  private calculateHourlyRate(reservation: ReservationBase, extensionDate: Date): number {
    let rate = this.hourlyRate

    const hoursUntilExtension = (extensionDate.getTime() - Date.now()) / (1000 * 60 * 60)
    if (hoursUntilExtension < 24) {
    }

    if (extensionDate.getHours() >= 18) {
    }

    const dayOfWeek = extensionDate.getDay()
    if (dayOfWeek === 0 || dayOfWeek === 6) {
    }

    return Math.ceil(rate)
  }

  /**
   * Obtenir des suggestions d'heures d'extension alternatives
   */
  async getSuggestedExtensions(reservationId: string, requestedEndDate: Date): Promise<Date[]> {
    const reservation = await this.reservationRepository.findById(reservationId)
    if (!reservation) {
      return []
    }

    const suggestions: Date[] = []
    const currentEndDate = reservation.endDate

    for (let hours = 1; hours <= 4; hours++) {
      const suggestedDate = new Date(currentEndDate)
      suggestedDate.setHours(suggestedDate.getHours() + hours)

      const isAvailable = await this.reservationRepository.checkResourceAvailability(
        reservation.resourceId,
        currentEndDate,
        suggestedDate,
        reservationId
      )

      if (isAvailable && suggestedDate <= requestedEndDate) {
        suggestions.push(suggestedDate)
      }
    }

    return suggestions
  }
}
