import type { ReservationRepository } from '../repositories/base.repositories'

export interface OccupancyStats {
  resourceId: string
  period: 'day' | 'week' | 'month'
  occupancyRate: number
  totalHours: number
  bookedHours: number
  revenue: number
  reservationCount: number
  averageBookingDuration: number
}

export interface GlobalStats {
  totalReservations: number
  totalRevenue: number
  averageOccupancyRate: number
  topResources: Array<{
    resourceId: string
    reservationCount: number
    revenue: number
    occupancyRate: number
  }>
  period: string
  startDate: string
  endDate: string
}

export interface RevenueStats {
  totalRevenue: number
  averageRevenuePerReservation: number
  revenueByPeriod: Array<{
    date: string
    revenue: number
    reservationCount: number
  }>
}

export class StatisticsService {
  constructor(private readonly reservationRepository: ReservationRepository) {}

  /**
   * Calculer les statistiques d'occupation d'une ressource
   */
  async getResourceOccupancyStats(
    resourceId: string,
    period: 'day' | 'week' | 'month',
    startDate?: Date
  ): Promise<OccupancyStats> {
    const { start, end } = this.calculatePeriodDates(period, startDate)

    const reservations = await this.reservationRepository.findByResourceAndDateRange(resourceId, start, end)

    const confirmedReservations = reservations.filter((r) => r.status === 'confirmed')

    const totalHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
    let bookedHours = 0
    let totalDuration = 0

    confirmedReservations.forEach((reservation) => {
      const duration = (reservation.endDate.getTime() - reservation.startDate.getTime()) / (1000 * 60 * 60)
      bookedHours += duration
      totalDuration += duration
    })

    const occupancyRate = totalHours > 0 ? bookedHours / totalHours : 0
    const averageBookingDuration = confirmedReservations.length > 0 ? totalDuration / confirmedReservations.length : 0

    const revenue = Math.round(bookedHours * averagePrice)

    return {
      resourceId,
      period,
      occupancyRate: Math.round(occupancyRate * 1000) / 1000,
      totalHours: Math.round(totalHours * 10) / 10,
      bookedHours: Math.round(bookedHours * 10) / 10,
      revenue,
      reservationCount: confirmedReservations.length,
      averageBookingDuration: Math.round(averageBookingDuration * 10) / 10
    }
  }

  /**
   * Calculer les statistiques globales du système
   */
  getGlobalStats(period: 'day' | 'week' | 'month'): GlobalStats {
    const { start, end } = this.calculatePeriodDates(period)

    const mockStats: GlobalStats = {
      totalReservations: 1250,
      totalRevenue: 93750,
      averageOccupancyRate: 0.68,
      topResources: [
        {
          resourceId: 'room-conference-A',
          reservationCount: 45,
          revenue: 6750,
          occupancyRate: 0.85
        },
        {
          resourceId: 'room-meeting-B',
          reservationCount: 38,
          revenue: 5700,
          occupancyRate: 0.72
        },
        {
          resourceId: 'bureau-coworking-1',
          reservationCount: 52,
          revenue: 7800,
          occupancyRate: 0.91
        },
        {
          resourceId: 'salle-formation-C',
          reservationCount: 31,
          revenue: 4650,
          occupancyRate: 0.64
        }
      ],
      period,
      startDate: start.toISOString(),
      endDate: end.toISOString()
    }

    return mockStats
  }

  /**
   * Calculer les dates de début et fin pour une période
   */
  private calculatePeriodDates(period: 'day' | 'week' | 'month', startDate?: Date): { start: Date; end: Date } {
    const start = startDate ? new Date(startDate) : new Date()
    const end = new Date()

    switch (period) {
      case 'day':
        start.setHours(0, 0, 0, 0)
        end.setTime(start.getTime() + 24 * 60 * 60 * 1000)
        break
      case 'week':
        start.setHours(0, 0, 0, 0)
        end.setTime(start.getTime() + 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        start.setHours(0, 0, 0, 0)
        end.setFullYear(start.getFullYear(), start.getMonth() + 1, 1)
        break
    }

    return { start, end }
  }
}
