import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import type { Payment } from '@/domain/models/payment.model'
import type { PaymentRepositoryInterface } from '@/domain/repositories/payment.repository.interface'
import { db } from '../database/db'
import { payments } from '../database/schema/payment.schema'

export class PaymentRepository implements PaymentRepositoryInterface {
  async findById(id: string): Promise<Payment | null> {
    const result = await db.select().from(payments).where(eq(payments.id, id)).limit(1)
    if (!result[0]) return null
    return this.mapToPayment(result[0])
  }

  async findByBooking(bookingId: string): Promise<Payment[]> {
    const results = await db.select().from(payments).where(eq(payments.bookingId, bookingId))
    return results.map(this.mapToPayment)
  }

  async create(data: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Payment> {
    const now = new Date()
    const id = uuidv4()
    const [result] = await db
      .insert(payments)
      .values({
        id,
        bookingId: data.bookingId,
        userId: data.userId,
        amount: data.amount.toString(),
        currency: data.currency,
        status: data.status,
        provider: data.provider,
        providerPaymentId: data.providerPaymentId,
        createdAt: now,
        updatedAt: now
      })
      .returning()
    return this.mapToPayment(result)
  }

  async update(id: string, data: Partial<Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Payment> {
    const [result] = await db
      .update(payments)
      .set({
        ...data,
        amount: data.amount?.toString(),
        updatedAt: new Date()
      })
      .where(eq(payments.id, id))
      .returning()
    return this.mapToPayment(result)
  }

  private mapToPayment(row: any): Payment {
    return {
      id: row.id,
      bookingId: row.bookingId,
      userId: row.userId,
      amount: Number(row.amount),
      currency: row.currency,
      status: row.status,
      provider: row.provider,
      providerPaymentId: row.providerPaymentId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    }
  }
}
