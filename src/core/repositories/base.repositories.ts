import type { ReservationBase } from '../types/reservation.type'

export interface ReservationRepository {
  create: (reservation: ReservationBase) => Promise<ReservationBase>
  update: (reservation: ReservationBase) => Promise<ReservationBase>
  findById: (id: string) => Promise<ReservationBase | null>
  updateStatus: (id: string, status: ReservationBase['status']) => Promise<void>
  findByUserId: (userId: string, page?: number, limit?: number) => Promise<{ data: ReservationBase[]; total: number }>
  checkResourceAvailability: (
    resourceId: string,
    startDate: Date,
    endDate: Date,
    excludeReservationId?: string
  ) => Promise<boolean>
  findByResourceAndDateRange: (resourceId: string, startDate: Date, endDate: Date) => Promise<ReservationBase[]>
}
