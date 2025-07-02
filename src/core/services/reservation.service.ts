import type { ReservationBase, ReservationStatus } from '../types/reservation.type'

export interface ReservationService {
  create: (reservation: ReservationBase) => Promise<ReservationBase>
  update: (reservation: ReservationBase) => Promise<ReservationBase>
  cancel: (reservationId: string) => Promise<ReservationStatus>
  getStatus: (reservationId: string) => Promise<ReservationStatus>
}
