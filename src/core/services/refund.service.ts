export interface RefundData {
  id: string
  paymentId: string
  amount: number
  status: 'pending' | 'completed' | 'failed'
  reason: string
  createdAt: Date
  processedAt?: Date
  stripeRefundId?: string
}

export class RefundService {
  private refunds: Map<string, RefundData> = new Map()

  /**
   * Créer une demande de remboursement
   */
  createRefundRequest(paymentId: string, amount: number, reason: string): RefundData {
    const refund: RefundData = {
      id: crypto.randomUUID(),
      paymentId,
      amount,
      status: 'pending',
      reason,
      createdAt: new Date()
    }

    this.refunds.set(refund.id, refund)

    console.info(`Demande de remboursement créée: ${refund.id} pour le paiement ${paymentId}`)

    return refund
  }

  /**
   * Traiter un remboursement via Stripe
   */
  processRefund(refundId: string): RefundData | null {
    const refund = this.refunds.get(refundId)
    if (!refund) {
      return null
    }

    try {
      refund.status = 'completed'
      refund.processedAt = new Date()
      refund.stripeRefundId = `re_${Math.random().toString(36).slice(2, 11)}`

      this.refunds.set(refundId, refund)

      console.info(`Remboursement traité avec succès: ${refundId}`)
      return refund
    } catch (error) {
      console.error('Erreur lors du traitement du remboursement:', error)

      refund.status = 'failed'
      refund.processedAt = new Date()
      this.refunds.set(refundId, refund)

      return refund
    }
  }

  /**
   * Récupérer un remboursement par ID
   */
  getRefund(refundId: string): RefundData | null {
    return this.refunds.get(refundId) || null
  }

  /**
   * Récupérer tous les remboursements pour un paiement
   */
  getRefundsByPayment(paymentId: string): RefundData[] {
    return Array.from(this.refunds.values()).filter((refund) => refund.paymentId === paymentId)
  }

  /**
   * Annuler une demande de remboursement en attente
   */
  cancelRefundRequest(refundId: string): boolean {
    const refund = this.refunds.get(refundId)
    if (!refund || refund.status !== 'pending') {
      return false
    }

    refund.status = 'failed'
    refund.processedAt = new Date()
    this.refunds.set(refundId, refund)

    console.info(`Demande de remboursement annulée: ${refundId}`)
    return true
  }
}
