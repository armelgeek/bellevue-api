import process from 'node:process'
import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import type { Routes } from '@/domain/types/route.type'
import { reservationContainer } from '../di/reservation.container'
import { authMiddleware } from '../middlewares/auth.middleware'
import type { PaymentBase } from '../../core/types/payment.type'
import type { ReservationBase } from '../../core/types/reservation.type'

export class ReservationRoutes implements Routes {
  public controller = new OpenAPIHono()

  public initRoutes() {
    this.controller.use('*', authMiddleware)

    const ReservationSchema = z.object({
      id: z.string().openapi({ example: 'res_abc123' }),
      userId: z.string().openapi({ example: 'user-123' }),
      resourceId: z.string().openapi({ example: 'room-456' }),
      startDate: z.string().datetime().openapi({ example: '2025-06-25T09:00:00Z' }),
      endDate: z.string().datetime().openapi({ example: '2025-06-25T17:00:00Z' }),
      status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']).openapi({ example: 'pending' }),
      createdAt: z.string().datetime(),
      updatedAt: z.string().datetime()
    })

    const CreateReservationWithStripeSchema = z.object({
      resourceId: z.string().openapi({ example: 'conference-room-A' }),
      startDate: z.string().datetime().openapi({ example: '2025-06-26T14:00:00Z' }),
      endDate: z.string().datetime().openapi({ example: '2025-06-26T18:00:00Z' }),
      amount: z.number().openapi({ example: 200 }),
      currency: z.string().default('eur').openapi({ example: 'eur' })
    })

    const UpdateStatusSchema = z.object({
      status: z.string().openapi({ example: 'confirmed' })
    })

    const ErrorSchema = z.object({
      message: z.string()
    })

    const WebhookResponseSchema = z.object({
      received: z.boolean().openapi({ example: true }),
      status: z.string().openapi({ example: 'payment_success' })
    })

    const SuccessSchema = z.object({
      success: z.boolean().openapi({ example: true }),
      message: z.string().openapi({ example: 'Operation completed successfully' })
    })

    const DebugContainerSchema = z.object({
      repositories: z.array(z.string()),
      services: z.array(z.string()),
      useCases: z.array(z.string()),
      controllers: z.array(z.string())
    })

    const HealthSchema = z.object({
      status: z.string().openapi({ example: 'OK' }),
      timestamp: z.string().datetime(),
      version: z.string().openapi({ example: '1.0.0' }),
      services: z.object({
        database: z.string().openapi({ example: 'Drizzle ORM' }),
        payment: z.string().openapi({ example: 'Stripe' }),
        notifications: z.string().openapi({ example: 'Email' }),
        audit: z.string().openapi({ example: 'Active' })
      })
    })

    const CancelReservationSchema = z.object({
      reason: z.string().optional().openapi({ example: 'Changement de programme' })
    })

    const UpdateReservationSchema = z.object({
      startDate: z.string().datetime().optional().openapi({ example: '2025-06-26T10:00:00Z' }),
      endDate: z.string().datetime().optional().openapi({ example: '2025-06-26T16:00:00Z' })
    })

    const ResourceAvailabilityCheckSchema = z.object({
      resourceId: z.string().openapi({ example: 'room-456' }),
      startDate: z.string().datetime().openapi({ example: '2025-06-25T09:00:00Z' }),
      endDate: z.string().datetime().openapi({ example: '2025-06-25T17:00:00Z' })
    })

    const AvailabilityResultSchema = z.object({
      isAvailable: z.boolean().openapi({ example: true }),
      conflictingReservations: z
        .array(
          z.object({
            id: z.string(),
            startDate: z.string().datetime(),
            endDate: z.string().datetime(),
            userId: z.string()
          })
        )
        .optional(),
      nextAvailableSlot: z
        .object({
          startDate: z.string().datetime(),
          endDate: z.string().datetime()
        })
        .optional()
    })

    const OccupancyStatsSchema = z.object({
      resourceId: z.string().openapi({ example: 'room-456' }),
      period: z.string().openapi({ example: 'week' }),
      occupancyRate: z.number().openapi({ example: 0.75 }),
      totalHours: z.number().openapi({ example: 168 }),
      bookedHours: z.number().openapi({ example: 126 }),
      revenue: z.number().openapi({ example: 3150 })
    })

    const ExtensionCostSchema = z.object({
      canExtend: z.boolean().openapi({ example: true }),
      additionalCost: z.number().openapi({ example: 50 }),
      currency: z.string().openapi({ example: 'eur' }),
      newEndDate: z.string().datetime(),
      conflictingReservations: z.array(z.string()).optional()
    })

    const CancelWithRefundSchema = z.object({
      reason: z.string().openapi({ example: 'Annulation par le client' }),
      refundAmount: z.number().optional().openapi({
        example: 150,
        description: 'Montant à rembourser. Si omis, remboursement total'
      }),
      refundReason: z.string().optional().openapi({
        example: 'Changement de programme'
      })
    })

    const RefundResultSchema = z.object({
      success: z.boolean().openapi({ example: true }),
      refundId: z.string().openapi({ example: 'ref_1234567890' }),
      amount: z.number().openapi({ example: 150 }),
      currency: z.string().openapi({ example: 'eur' }),
      status: z.enum(['pending', 'succeeded', 'failed']).openapi({ example: 'succeeded' }),
      message: z.string().openapi({ example: 'Remboursement effectué avec succès' }),
      estimatedArrival: z.string().optional().openapi({
        example: '5-10 jours ouvrés',
        description: 'Délai estimé pour recevoir le remboursement'
      })
    })

    const RetryCheckoutSchema = z.object({
      paymentMethodId: z.string().optional().openapi({
        example: 'pm_1234567890',
        description: 'ID de la méthode de paiement à utiliser pour le retry'
      }),
      useNewPaymentMethod: z.boolean().default(false).openapi({
        example: false,
        description: 'Si true, créer une nouvelle session de paiement'
      })
    })

    const CheckoutRetryResultSchema = z.object({
      success: z.boolean().openapi({ example: true }),
      paymentUrl: z.string().url().optional().openapi({
        description: 'URL de checkout si une nouvelle session est créée'
      }),
      paymentIntentId: z.string().optional().openapi({
        example: 'pi_1234567890',
        description: 'ID du payment intent pour le suivi'
      }),
      status: z.enum(['requires_payment_method', 'requires_confirmation', 'succeeded', 'failed']).openapi({
        example: 'requires_payment_method'
      }),
      message: z.string().openapi({
        example: 'Nouvelle tentative de paiement initiée'
      }),
      expiresAt: z.string().datetime().optional().openapi({
        example: '2025-06-23T15:30:00Z',
        description: "Date d'expiration de la session de paiement"
      })
    })

    const checkResourceAvailabilityRoute = createRoute({
      method: 'post',
      path: '/resources/check-availability',
      tags: ['Resources'],
      summary: "Vérifier disponibilité d'une ressource",
      description: 'Vérifier si une ressource est disponible pour un créneau donné',
      request: {
        body: {
          content: {
            'application/json': {
              schema: ResourceAvailabilityCheckSchema
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Résultat de la vérification de disponibilité',
          content: {
            'application/json': {
              schema: AvailabilityResultSchema
            }
          }
        },
        404: {
          description: 'Ressource non trouvée',
          content: {
            'application/json': {
              schema: ErrorSchema
            }
          }
        }
      }
    })

    const getReservationHistoryRoute = createRoute({
      method: 'get',
      path: '/reservations/{id}/history',
      tags: ['Reservations'],
      summary: "Historique d'une réservation",
      description: "Obtenir l'historique des modifications d'une réservation",
      request: {
        params: z.object({
          id: z.string().openapi({ example: 'res_abc123' })
        })
      },
      responses: {
        200: {
          description: 'Historique de la réservation',
          content: {
            'application/json': {
              schema: z.object({
                reservationId: z.string(),
                history: z.array(
                  z.object({
                    timestamp: z.string().datetime(),
                    action: z.string().openapi({ example: 'status_changed' }),
                    oldValue: z.string().optional(),
                    newValue: z.string().optional(),
                    userId: z.string(),
                    details: z.string().optional()
                  })
                )
              })
            }
          }
        }
      }
    })

    const healthRoute = createRoute({
      method: 'get',
      path: '/health',
      tags: ['Health'],
      summary: "État de l'API",
      description: "Vérification de l'état de l'API et des services",
      responses: {
        200: {
          description: "État de l'API",
          content: {
            'application/json': {
              schema: HealthSchema
            }
          }
        }
      }
    })

    const debugContainerRoute = createRoute({
      method: 'get',
      path: '/debug/container',
      tags: ['Health'],
      summary: 'Services disponibles',
      description: 'Afficher les services disponibles dans le DI container',
      responses: {
        200: {
          description: 'Services disponibles',
          content: {
            'application/json': {
              schema: DebugContainerSchema
            }
          }
        }
      }
    })

    const getReservationRoute = createRoute({
      method: 'get',
      path: '/reservations/{id}',
      tags: ['Reservations'],
      summary: 'Récupérer une réservation',
      description: 'Récupérer une réservation par son ID',
      request: {
        params: z.object({
          id: z.string().openapi({ example: 'res_abc123' })
        })
      },
      responses: {
        200: {
          description: 'Réservation trouvée',
          content: {
            'application/json': {
              schema: ReservationSchema
            }
          }
        },
        404: {
          description: 'Réservation non trouvée',
          content: {
            'application/json': {
              schema: ErrorSchema
            }
          }
        }
      }
    })

    const updateReservationStatusRoute = createRoute({
      method: 'put',
      path: '/reservations/{id}/status',
      tags: ['Reservations'],
      summary: "Mettre à jour le statut d'une réservation",
      description: "Mettre à jour le statut d'une réservation existante",
      request: {
        params: z.object({
          id: z.string().openapi({ example: 'res_abc123' })
        }),
        body: {
          content: {
            'application/json': {
              schema: UpdateStatusSchema
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Statut mis à jour',
          content: {
            'application/json': {
              schema: SuccessSchema
            }
          }
        },
        404: {
          description: 'Réservation non trouvée',
          content: {
            'application/json': {
              schema: ErrorSchema
            }
          }
        }
      }
    })

    const cancelReservationRoute = createRoute({
      method: 'put',
      path: '/reservations/{id}/cancel',
      tags: ['Reservations'],
      summary: 'Annuler une réservation',
      description: 'Annuler sa propre réservation avec une raison optionnelle',
      request: {
        params: z.object({
          id: z.string().openapi({ example: 'res_abc123' })
        }),
        body: {
          content: {
            'application/json': {
              schema: CancelReservationSchema
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Réservation annulée avec succès',
          content: {
            'application/json': {
              schema: SuccessSchema
            }
          }
        },
        403: {
          description: 'Non autorisé à annuler cette réservation',
          content: {
            'application/json': {
              schema: ErrorSchema
            }
          }
        },
        404: {
          description: 'Réservation non trouvée',
          content: {
            'application/json': {
              schema: ErrorSchema
            }
          }
        }
      }
    })

    const updateReservationRoute = createRoute({
      method: 'put',
      path: '/reservations/{id}',
      tags: ['Reservations'],
      summary: 'Modifier une réservation',
      description: "Modifier les dates d'une réservation (si autorisé)",
      request: {
        params: z.object({
          id: z.string().openapi({ example: 'res_abc123' })
        }),
        body: {
          content: {
            'application/json': {
              schema: UpdateReservationSchema
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Réservation modifiée avec succès',
          content: {
            'application/json': {
              schema: ReservationSchema
            }
          }
        },
        400: {
          description: 'Dates non disponibles ou modification non autorisée',
          content: {
            'application/json': {
              schema: ErrorSchema
            }
          }
        },
        403: {
          description: 'Non autorisé à modifier cette réservation',
          content: {
            'application/json': {
              schema: ErrorSchema
            }
          }
        }
      }
    })

    const createReservationWithStripeRoute = createRoute({
      method: 'post',
      path: '/reservations',
      tags: ['Reservations'],
      summary: 'Créer une réservation avec paiement Stripe',
      description: 'Créer une réservation avec paiement Stripe intégré',
      request: {
        body: {
          content: {
            'application/json': {
              schema: CreateReservationWithStripeSchema
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Réservation et paiement créés',
          content: {
            'application/json': {
              schema: z.object({
                reservation: ReservationSchema,
                payment: z.object({
                  id: z.string(),
                  clientSecret: z.string(),
                  amount: z.number(),
                  currency: z.string()
                })
              })
            }
          }
        },
        500: {
          description: 'Erreur serveur',
          content: {
            'application/json': {
              schema: ErrorSchema
            }
          }
        }
      }
    })

    const stripeWebhookRoute = createRoute({
      method: 'post',
      path: '/stripe/webhook',
      tags: ['Stripe'],
      summary: 'Webhook Stripe',
      description: 'Webhook pour recevoir les événements de paiement Stripe',
      request: {
        headers: z.object({
          'stripe-signature': z.string()
        }),
        body: {
          content: {
            'text/plain': {
              schema: z.string()
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Webhook traité avec succès',
          content: {
            'application/json': {
              schema: WebhookResponseSchema
            }
          }
        },
        400: {
          description: 'Erreur dans le webhook',
          content: {
            'application/json': {
              schema: ErrorSchema
            }
          }
        }
      }
    })

    const listReservationsRoute = createRoute({
      method: 'get',
      path: '/reservations',
      tags: ['Reservations'],
      summary: 'Lister les réservations',
      description: 'Récupérer une liste de réservations avec pagination',
      request: {
        query: z.object({
          page: z.string().optional().openapi({ example: '1' }),
          limit: z.string().optional().openapi({ example: '10' }),
          status: z.string().optional().openapi({ example: 'pending' }),
          userId: z.string().optional().openapi({ example: 'user-123' })
        })
      },
      responses: {
        200: {
          description: 'Liste des réservations',
          content: {
            'application/json': {
              schema: z.object({
                reservations: z.array(ReservationSchema),
                pagination: z.object({
                  page: z.number(),
                  limit: z.number(),
                  total: z.number(),
                  totalPages: z.number()
                })
              })
            }
          }
        }
      }
    })

    const getGlobalStatsRoute = createRoute({
      method: 'get',
      path: '/stats/global',
      tags: ['Statistics'],
      summary: 'Statistiques globales',
      description: 'Obtenir les statistiques globales du système',
      request: {
        query: z.object({
          period: z.enum(['day', 'week', 'month']).default('week')
        })
      },
      responses: {
        200: {
          description: 'Statistiques globales',
          content: {
            'application/json': {
              schema: z.object({
                totalReservations: z.number().openapi({ example: 1250 }),
                totalRevenue: z.number().openapi({ example: 45000 }),
                averageOccupancyRate: z.number().openapi({ example: 0.68 }),
                topResources: z.array(
                  z.object({
                    resourceId: z.string().openapi({ example: 'room-conference-A' }),
                    reservationCount: z.number().openapi({ example: 45 }),
                    revenue: z.number().openapi({ example: 6750 }),
                    occupancyRate: z.number().openapi({ example: 0.85 })
                  })
                ),
                period: z.string().openapi({ example: 'week' }),
                startDate: z.string().datetime().openapi({ example: '2025-06-18T00:00:00Z' }),
                endDate: z.string().datetime().openapi({ example: '2025-06-25T00:00:00Z' })
              })
            }
          }
        }
      }
    })

    const getOccupancyStatsRoute = createRoute({
      method: 'get',
      path: '/stats/occupancy/{resourceId}',
      tags: ['Statistics'],
      summary: 'Statistiques occupation',
      description: "Statistiques d'occupation d'une ressource",
      request: {
        params: z.object({
          resourceId: z.string()
        }),
        query: z.object({
          period: z.enum(['day', 'week', 'month']).default('week')
        })
      },
      responses: {
        200: {
          description: 'Statistiques',
          content: {
            'application/json': {
              schema: OccupancyStatsSchema
            }
          }
        }
      }
    })

    const getExtensionCostRoute = createRoute({
      method: 'get',
      path: '/reservations/{id}/extension-cost',
      tags: ['Reservations'],
      summary: "Coût d'extension",
      description: 'Calculer le coût pour prolonger une réservation',
      request: {
        params: z.object({
          id: z.string().openapi({ example: 'res_abc123' })
        }),
        query: z.object({
          newEndDate: z.string().datetime().openapi({ example: '2025-06-26T20:00:00Z' })
        })
      },
      responses: {
        200: {
          description: "Coût d'extension calculé",
          content: {
            'application/json': {
              schema: ExtensionCostSchema
            }
          }
        },
        400: {
          description: 'Extension impossible',
          content: {
            'application/json': {
              schema: ErrorSchema
            }
          }
        },
        404: {
          description: 'Réservation non trouvée',
          content: {
            'application/json': {
              schema: ErrorSchema
            }
          }
        }
      }
    })

    const cancelWithRefundRoute = createRoute({
      method: 'post',
      path: '/reservations/{id}/cancel-with-refund',
      tags: ['Reservations', 'Payment'],
      summary: 'Annuler avec remboursement',
      description: 'Annuler une réservation et traiter le remboursement automatiquement',
      request: {
        params: z.object({
          id: z.string().openapi({ example: 'res_abc123' })
        }),
        body: {
          content: {
            'application/json': {
              schema: CancelWithRefundSchema
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Annulation et remboursement effectués',
          content: {
            'application/json': {
              schema: RefundResultSchema
            }
          }
        },
        400: {
          description: 'Remboursement impossible ou déjà traité',
          content: {
            'application/json': {
              schema: ErrorSchema
            }
          }
        },
        404: {
          description: 'Réservation non trouvée',
          content: {
            'application/json': {
              schema: ErrorSchema
            }
          }
        },
        500: {
          description: 'Erreur lors du traitement du remboursement',
          content: {
            'application/json': {
              schema: ErrorSchema
            }
          }
        }
      }
    })

    const retryCheckoutRoute = createRoute({
      method: 'post',
      path: '/reservations/{id}/retry-checkout',
      tags: ['Reservations', 'Payment'],
      summary: 'Relancer le paiement',
      description: 'Relancer une tentative de paiement pour une réservation en échec',
      request: {
        params: z.object({
          id: z.string().openapi({ example: 'res_abc123' })
        }),
        body: {
          content: {
            'application/json': {
              schema: RetryCheckoutSchema
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Nouvelle tentative de paiement créée',
          content: {
            'application/json': {
              schema: CheckoutRetryResultSchema
            }
          }
        },
        400: {
          description: 'Retry impossible (réservation déjà payée ou annulée)',
          content: {
            'application/json': {
              schema: ErrorSchema
            }
          }
        },
        404: {
          description: 'Réservation non trouvée',
          content: {
            'application/json': {
              schema: ErrorSchema
            }
          }
        },
        500: {
          description: 'Erreur lors de la création de la nouvelle session de paiement',
          content: {
            'application/json': {
              schema: ErrorSchema
            }
          }
        }
      }
    })

    this.controller.openapi(healthRoute, (c: any) => {
      return c.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        services: {
          database: 'Drizzle ORM',
          payment: 'Stripe',
          notifications: 'Email',
          audit: 'Active'
        }
      })
    })

    this.controller.openapi(debugContainerRoute, (c: any) => {
      return c.json({
        repositories: ['reservationRepository', 'paymentRepository'],
        services: ['stripeService', 'auditService', 'notificationService'],
        useCases: ['createReservationWithStripeUseCase', 'stripeWebhookUseCase'],
        controllers: ['reservationController', 'paymentController', 'stripeWebhookController']
      })
    })

    this.controller.openapi(getReservationRoute, async (c: any) => {
      try {
        const { id } = c.req.valid('param')
        const reservation = await reservationContainer.reservationController.getReservationById(id)

        if (!reservation) {
          return c.json({ message: 'Réservation non trouvée' }, 404)
        }

        return c.json(reservation)
      } catch (error) {
        console.error('Erreur GET /reservations/:id:', error)
        return c.json({ message: 'Erreur interne du serveur' }, 500)
      }
    })

    this.controller.openapi(updateReservationStatusRoute, async (c: any) => {
      try {
        const { id } = c.req.valid('param')
        const { status } = c.req.valid('json')

        await reservationContainer.reservationController.updateReservationStatus(id, status)

        return c.json({ success: true, message: 'Statut mis à jour avec succès' })
      } catch (error) {
        console.error('Erreur PUT /reservations/:id/status:', error)
        return c.json({ message: 'Erreur lors de la mise à jour du statut' }, 500)
      }
    })

    this.controller.openapi(cancelReservationRoute, async (c: any) => {
      try {
        const { id } = c.req.valid('param')

        await reservationContainer.reservationController.cancelReservation(id)

        return c.json({ success: true, message: 'Réservation annulée avec succès' })
      } catch (error) {
        console.error('Erreur DELETE /reservations/:id:', error)
        return c.json({ message: "Erreur lors de l'annulation de la réservation" }, 500)
      }
    })

    this.controller.openapi(createReservationWithStripeRoute, async (c: any) => {
      try {
        const user = c.get('user')
        if (!user) {
          return c.json({ message: 'Authentication required' }, 401)
        }

        const body = c.req.valid('json')

        const reservationData: ReservationBase = {
          id: crypto.randomUUID(),
          userId: user.id,
          resourceId: body.resourceId,
          startDate: new Date(body.startDate),
          endDate: new Date(body.endDate),
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date()
        }

        const paymentData: PaymentBase = {
          id: crypto.randomUUID(),
          reservationId: reservationData.id,
          amount: body.amount,
          currency: body.currency || 'eur',
          status: 'pending',
          method: 'stripe',
          createdAt: new Date(),
          updatedAt: new Date()
        }

        const result = await reservationContainer.createReservationWithStripeUseCase.execute(
          reservationData,
          paymentData
        )

        return c.json(
          {
            reservation: result.reservation,
            payment: {
              id: paymentData.id,
              paymentUrl: result.checkoutUrl,
              amount: paymentData.amount,
              currency: paymentData.currency
            }
          },
          201
        )
      } catch (error) {
        console.error('Erreur POST /reservations/with-stripe:', error)
        return c.json({ message: 'Erreur lors de la création de la réservation avec Stripe' }, 500)
      }
    })

    this.controller.openapi(stripeWebhookRoute, async (c: any) => {
      try {
        const body = await c.req.text()
        const signature = c.req.header('stripe-signature')

        console.info('[Stripe Webhook] Headers:', JSON.stringify(c.req.raw.headers))
        console.info('[Stripe Webhook] Signature:', signature)
        console.info('[Stripe Webhook] Body:', body.slice(0, 500))

        if (!signature) {
          console.warn('[Stripe Webhook] Signature Stripe manquante')
          return c.json({ message: 'Signature Stripe manquante' }, 400)
        }
        if (!body) {
          console.warn('[Stripe Webhook] Body vide ou non lisible')
          return c.json({ message: 'Body vide ou non lisible' }, 400)
        }

        const result = await reservationContainer.stripeWebhookUseCase.execute(body, signature)

        return c.json({ received: true, status: result })
      } catch (error) {
        console.error('Erreur POST /stripe/webhook', error)
        return c.json(
          { message: error instanceof Error ? error.message : 'Erreur lors du traitement du webhook Stripe' },
          500
        )
      }
    })

    this.controller.openapi(listReservationsRoute, async (c: any) => {
      try {
        const user = c.get('user')
        if (!user) {
          return c.json({ message: 'Authentication required' }, 401)
        }

        const query = c.req.valid('query')
        const page = Number.parseInt(query.page || '1')
        const limit = Number.parseInt(query.limit || '10')

        const result = await reservationContainer.reservationRepository.findByUserId(user.id, page, limit)

        return c.json({
          reservations: result.data,
          pagination: {
            page,
            limit,
            total: result.total,
            totalPages: Math.ceil(result.total / limit)
          }
        })
      } catch (error) {
        console.error('Erreur GET /reservations:', error)
        return c.json({ message: 'Erreur lors de la récupération des réservations' }, 500)
      }
    })

    this.controller.openapi(cancelReservationRoute, async (c: any) => {
      try {
        const user = c.get('user')
        if (!user) {
          return c.json({ message: 'Authentication required' }, 401)
        }

        const { id } = c.req.valid('param')

        const reservation = await reservationContainer.reservationRepository.findById(id)
        if (!reservation) {
          return c.json({ message: 'Réservation non trouvée' }, 404)
        }

        if (reservation.userId !== user.id) {
          return c.json({ message: 'Non autorisé à annuler cette réservation' }, 403)
        }

        const result = await reservationContainer.reservationStatusService.updateStatus(id, 'cancelled', user.id)

        if (!result.success) {
          return c.json({ message: result.message }, 400)
        }

        return c.json({ success: true, message: 'Réservation annulée avec succès' })
      } catch (error) {
        console.error('Erreur PUT /reservations/:id/cancel:', error)
        return c.json({ message: "Erreur lors de l'annulation de la réservation" }, 500)
      }
    })

    this.controller.openapi(updateReservationRoute, async (c: any) => {
      try {
        const user = c.get('user')
        if (!user) {
          return c.json({ message: 'Authentication required' }, 401)
        }

        const { id } = c.req.valid('param')
        const { startDate, endDate } = c.req.valid('json')

        const reservation = await reservationContainer.reservationRepository.findById(id)
        if (!reservation) {
          return c.json({ message: 'Réservation non trouvée' }, 404)
        }

        if (reservation.userId !== user.id) {
          return c.json({ message: 'Non autorisé à modifier cette réservation' }, 403)
        }

        if (!['pending', 'confirmed'].includes(reservation.status)) {
          return c.json({ message: 'Cette réservation ne peut plus être modifiée' }, 400)
        }

        const newStartDate = startDate ? new Date(startDate) : reservation.startDate
        const newEndDate = endDate ? new Date(endDate) : reservation.endDate

        const isAvailable = await reservationContainer.reservationRepository.checkResourceAvailability(
          reservation.resourceId,
          newStartDate,
          newEndDate,
        )

        if (!isAvailable) {
          return c.json({ message: "La ressource n'est pas disponible pour ces nouvelles dates" }, 400)
        }

        const updatedReservation = await reservationContainer.reservationRepository.update({
          ...reservation,
          startDate: newStartDate,
          endDate: newEndDate,
          updatedAt: new Date()
        })

        return c.json(updatedReservation)
      } catch (error) {
        console.error('Erreur PUT /reservations/:id:', error)
        return c.json({ message: 'Erreur lors de la modification de la réservation' }, 500)
      }
    })

    this.controller.openapi(checkResourceAvailabilityRoute, async (c: any) => {
      try {
        const { resourceId, startDate, endDate } = c.req.valid('json')

        const isAvailable = await reservationContainer.reservationRepository.checkResourceAvailability(
          resourceId,
          new Date(startDate),
          new Date(endDate)
        )

        if (!isAvailable) {
          const conflicting = await reservationContainer.reservationRepository.findByResourceAndDateRange(
            resourceId,
            new Date(startDate),
            new Date(endDate)
          )

          return c.json({
            isAvailable: false,
            conflictingReservations: conflicting.map((r) => ({
              id: r.id,
              startDate: r.startDate.toISOString(),
              endDate: r.endDate.toISOString(),
              userId: r.userId
            }))
          })
        }

        return c.json({ isAvailable: true })
      } catch (error) {
        console.error('Erreur POST /resources/check-availability:', error)
        return c.json({ message: 'Erreur lors de la vérification de disponibilité' }, 500)
      }
    })

    this.controller.openapi(getReservationHistoryRoute, async (c: any) => {
      try {
        const user = c.get('user')
        if (!user) {
          return c.json({ message: 'Authentication required' }, 401)
        }

        const { id } = c.req.valid('param')

        const reservation = await reservationContainer.reservationRepository.findById(id)
        if (!reservation) {
          return c.json({ message: 'Réservation non trouvée' }, 404)
        }

        if (reservation.userId !== user.id) {
          return c.json({ message: 'Non autorisé à accéder à cette réservation' }, 403)
        }

        const history = [
          {
            timestamp: reservation.createdAt.toISOString(),
            action: 'reservation_created',
            newValue: 'pending',
            userId: reservation.userId,
            details: 'Réservation créée'
          },
          {
            timestamp: reservation.updatedAt.toISOString(),
            action: 'status_changed',
            oldValue: 'pending',
            newValue: reservation.status,
            userId: reservation.userId,
            details: `Statut changé vers ${reservation.status}`
          }
        ]

        return c.json({
          reservationId: id,
          history
        })
      } catch (error) {
        console.error('Erreur GET /reservations/:id/history:', error)
        return c.json({ message: "Erreur lors de la récupération de l'historique" }, 500)
      }
    })

    this.controller.openapi(getOccupancyStatsRoute, async (c: any) => {
      try {
        const user = c.get('user')
        if (!user) {
          return c.json({ message: 'Authentication required' }, 401)
        }

        const { resourceId } = c.req.valid('param')
        const { period, startDate } = c.req.valid('query')

        let start = new Date()
        let end = new Date()

        if (startDate) {
          start = new Date(startDate)
        }

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
            end = new Date(start.getFullYear(), start.getMonth() + 1, 1)
            break
        }

        const reservations = await reservationContainer.reservationRepository.findByResourceAndDateRange(
          resourceId,
          start,
          end
        )

        const confirmedReservations = reservations.filter((r) => r.status === 'confirmed')

        const totalHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
        let bookedHours = 0

        confirmedReservations.forEach((reservation) => {
          const duration = (reservation.endDate.getTime() - reservation.startDate.getTime()) / (1000 * 60 * 60)
          bookedHours += duration
        })

        const occupancyRate = totalHours > 0 ? bookedHours / totalHours : 0


        return c.json({
          resourceId,
          period,
          occupancyRate: Math.round(occupancyRate * 100) / 100,
          totalHours: Math.round(totalHours),
          bookedHours: Math.round(bookedHours),
          revenue
        })
      } catch (error) {
        console.error('Erreur GET /stats/occupancy/:resourceId:', error)
        return c.json({ message: 'Erreur lors de la récupération des statistiques' }, 500)
      }
    })

    this.controller.openapi(getGlobalStatsRoute, (c: any) => {
      try {
        const user = c.get('user')
        if (!user) {
          return c.json({ message: 'Authentication required' }, 401)
        }

        const isAdmin = user?.role === 'admin' || user?.email?.endsWith('@admin.com')
        if (!isAdmin) {
          return c.json({ message: 'Accès refusé - droits administrateur requis' }, 403)
        }

        const { period } = c.req.valid('query')

        const startDate = new Date()
        let endDate = new Date()

        switch (period) {
          case 'day':
            startDate.setHours(0, 0, 0, 0)
            endDate.setTime(startDate.getTime() + 24 * 60 * 60 * 1000)
            break
          case 'week':
            startDate.setDate(startDate.getDate() - startDate.getDay())
            startDate.setHours(0, 0, 0, 0)
            endDate.setTime(startDate.getTime() + 7 * 24 * 60 * 60 * 1000)
            break
          case 'month':
            startDate.setDate(1)
            startDate.setHours(0, 0, 0, 0)
            endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1)
            break
        }

        const stats = {
          totalReservations: 1250,
          totalRevenue: 45000,
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
            }
          ],
          period,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }

        return c.json(stats)
      } catch (error) {
        console.error('Erreur GET /stats/global:', error)
        return c.json({ message: 'Erreur lors de la récupération des statistiques globales' }, 500)
      }
    })

    this.controller.openapi(getExtensionCostRoute, async (c: any) => {
      try {
        const user = c.get('user')
        if (!user) {
          return c.json({ message: 'Authentication required' }, 401)
        }

        const { id } = c.req.valid('param')
        const { newEndDate } = c.req.valid('query')

        const reservation = await reservationContainer.reservationRepository.findById(id)
        if (!reservation) {
          return c.json({ message: 'Réservation non trouvée' }, 404)
        }

        if (reservation.userId !== user.id) {
          return c.json({ message: 'Non autorisé à accéder à cette réservation' }, 403)
        }

        const currentEndDate = reservation.endDate
        const requestedEndDate = new Date(newEndDate)

        if (requestedEndDate <= currentEndDate) {
          return c.json(
            {
              message: 'La nouvelle date de fin doit être postérieure à la date de fin actuelle'
            },
            400
          )
        }

        const extendedDurationHours = (requestedEndDate.getTime() - currentEndDate.getTime()) / (1000 * 60 * 60)
        const isAvailable = await reservationContainer.reservationRepository.checkResourceAvailability(
          reservation.resourceId,
          currentEndDate,
          requestedEndDate,
          id
        )

        if (!isAvailable) {
          const conflictingReservations = await reservationContainer.reservationRepository.findByResourceAndDateRange(
            reservation.resourceId,
            currentEndDate,
            requestedEndDate
          )

          return c.json({
            canExtend: false,
            additionalCost: 0,
            currency: 'eur',
            newEndDate,
            conflictingReservations: conflictingReservations.map((r) => r.id)
          })
        }

        const hourlyRate = 25
        const additionalCost = Math.ceil(extendedDurationHours * hourlyRate)

        return c.json({
          canExtend: true,
          additionalCost,
          currency: 'eur',
          newEndDate,
          conflictingReservations: []
        })
      } catch (error) {
        console.error('Erreur GET /reservations/:id/extension-cost:', error)
        return c.json({ message: "Erreur lors du calcul du coût d'extension" }, 500)
      }
    })

    this.controller.openapi(cancelWithRefundRoute, async (c: any) => {
      try {
        const { id } = c.req.valid('param')
        const body = await c.req.json()
        const { reason, refundAmount, refundReason } = body

        const reservation = await reservationContainer.reservationRepository.findById(id)
        if (!reservation) {
          return c.json({ message: 'Réservation non trouvée' }, 404)
        }

        if (reservation.status === 'cancelled') {
          return c.json({ message: 'Réservation déjà annulée' }, 400)
        }

        try {
          const refundResult = await reservationContainer.stripeService.processRefund({
            reservationId: id,
            amount: refundAmount,
            reason: refundReason || reason,
            currency: 'eur'
          })

          await reservationContainer.reservationRepository.updateStatus(id, 'cancelled')

          return c.json({
            success: true,
            refundId: refundResult.id,
            amount: refundResult.amount,
            currency: refundResult.currency,
            status: refundResult.status,
            message: 'Réservation annulée et remboursement traité avec succès',
            estimatedArrival: '5-10 jours ouvrés'
          })
        } catch (stripeError) {
          console.error('Erreur lors du remboursement Stripe:', stripeError)
          return c.json({ message: 'Erreur lors du traitement du remboursement' }, 500)
        }
      } catch (error) {
        console.error('Erreur POST /reservations/:id/cancel-with-refund:', error)
        return c.json({ message: "Erreur lors de l'annulation avec remboursement" }, 500)
      }
    })

    this.controller.openapi(retryCheckoutRoute, async (c: any) => {
      try {
        const { id } = c.req.valid('param')
        const body = await c.req.json()
        const { paymentMethodId, useNewPaymentMethod } = body

        const reservation = await reservationContainer.reservationRepository.findById(id)
        if (!reservation) {
          return c.json({ message: 'Réservation non trouvée' }, 404)
        }

        if (reservation.status === 'confirmed') {
          return c.json({ message: 'Réservation déjà confirmée et payée' }, 400)
        }

        try {
          let result
          if (useNewPaymentMethod || !paymentMethodId) {
            const checkoutSession = await reservationContainer.stripeService.createCheckoutSession({
              amount: 200,
              currency: 'eur',
              metadata: {
                reservationId: id,
                userId: reservation.userId
              },
              successUrl: `${process.env.FRONTEND_URL}/reservations/${id}/success`,
              cancelUrl: `${process.env.FRONTEND_URL}/reservations/${id}/cancel`
            })

            result = {
              success: true,
              paymentUrl: checkoutSession.url,
              paymentIntentId: checkoutSession.payment_intent as string,
              status: 'requires_payment_method',
              message: 'Nouvelle session de paiement créée',
              expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString()
            }
          } else {
            const paymentResult = await reservationContainer.stripeService.confirmPayment({
              paymentMethodId,
              reservationId: id
            })

            result = {
              success: paymentResult.status === 'succeeded',
              paymentIntentId: paymentResult.id,
              status: paymentResult.status,
              message:
                paymentResult.status === 'succeeded'
                  ? 'Paiement confirmé avec succès'
                  : 'Paiement en attente de confirmation'
            }

            if (paymentResult.status === 'succeeded') {
              await reservationContainer.reservationRepository.updateStatus(id, 'confirmed')
            }
          }

          return c.json(result)
        } catch (stripeError) {
          console.error('Erreur lors du retry Stripe:', stripeError)
          return c.json({ message: 'Erreur lors de la relance du paiement' }, 500)
        }
      } catch (error) {
        console.error('Erreur POST /reservations/:id/retry-checkout:', error)
        return c.json({ message: 'Erreur lors de la relance du checkout' }, 500)
      }
    })
  }
}
