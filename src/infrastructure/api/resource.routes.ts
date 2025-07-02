import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { z } from 'zod'
import type { Routes } from '@/domain/types/route.type'
import { reservationContainer } from '../di/reservation.container'
import { authMiddleware } from '../middlewares/auth.middleware'

export class ResourceRoutes implements Routes {
  public controller = new OpenAPIHono()

  public initRoutes() {
    this.controller.use('*', authMiddleware)

    const ResourceSchema = z.object({
      id: z.string().uuid(),
      createdAt: z.string().datetime()
    })

    const ResourceAvailabilitySchema = z.object({
      resourceId: z.string().uuid(),
      startDate: z.string().datetime(),
      endDate: z.string().datetime(),
      isAvailable: z.boolean()
    })

    const ResourceAvailabilityResponseSchema = z.object({
      isAvailable: z.boolean()
    })

    const PaginatedResourceResponseSchema = z.object({
      resources: z.array(ResourceSchema),
      pagination: z.object({
        page: z.number(),
        limit: z.number(),
        total: z.number(),
        totalPages: z.number()
      })
    })

    const createResourceRoute = createRoute({
      method: 'post',
      path: '/resources',
      tags: ['Resources'],
      summary: 'Créer une ressource',
      description: 'Créer une nouvelle ressource dans le système',
      responses: {
        200: {
          content: {
            'application/json': {
              schema: ResourceSchema
            }
          },
          description: 'Ressource créée avec succès'
        }
      }
    })

    const getResourceRoute = createRoute({
      method: 'get',
      path: '/resources/{id}',
      tags: ['Resources'],
      summary: 'Récupérer une ressource',
      description: 'Récupérer une ressource par son ID',
      request: {
        params: z.object({
          id: z.string().uuid()
        })
      },
      responses: {
        200: {
          content: {
            'application/json': {
              schema: ResourceSchema
            }
          },
          description: 'Ressource trouvée'
        },
        404: {
          content: {
            'application/json': {
              schema: z.object({ message: z.string() })
            }
          },
          description: 'Ressource non trouvée'
        }
      }
    })

    const getAllResourcesRoute = createRoute({
      method: 'get',
      path: '/resources',
      tags: ['Resources'],
      summary: 'Lister toutes les ressources avec pagination',
      description: 'Récupérer la liste paginée des ressources avec filtres de disponibilité',
      request: {
        query: z.object({
          page: z.string().optional().openapi({ example: '1' }),
          limit: z.string().optional().openapi({ example: '10' }),
          startDate: z.string().datetime().optional(),
          endDate: z.string().datetime().optional(),
          availableOnly: z.string().optional().openapi({ example: 'true' })
        })
      },
      responses: {
        200: {
          content: {
            'application/json': {
              schema: PaginatedResourceResponseSchema
            }
          },
          description: 'Liste paginée des ressources'
        }
      }
    })

    const checkAvailabilityRoute = createRoute({
      method: 'get',
      path: '/resources/{id}/availability',
      tags: ['Resources'],
      summary: 'Vérifier la disponibilité',
      description: 'Vérifier si une ressource est disponible pour une période donnée',
      request: {
        params: z.object({
          id: z.string().uuid()
        }),
        query: z.object({
          startDate: z.string().datetime(),
          endDate: z.string().datetime()
        })
      },
      responses: {
        200: {
          content: {
            'application/json': {
              schema: ResourceAvailabilityResponseSchema
            }
          },
          description: 'Statut de disponibilité'
        }
      }
    })

    const getAvailabilitiesRoute = createRoute({
      method: 'get',
      path: '/resources/{id}/availabilities',
      tags: ['Resources'],
      summary: 'Récupérer les disponibilités',
      description: 'Récupérer les créneaux de disponibilité pour une période donnée',
      request: {
        params: z.object({
          id: z.string().uuid()
        }),
        query: z.object({
          startDate: z.string().datetime(),
          endDate: z.string().datetime()
        })
      },
      responses: {
        200: {
          content: {
            'application/json': {
              schema: z.array(ResourceAvailabilitySchema)
            }
          },
          description: 'Liste des disponibilités'
        }
      }
    })

    this.controller.openapi(createResourceRoute, async (c: any) => {
      const resourceController = reservationContainer.resourceController
      const resource = await resourceController.createResource()
      return c.json(resource)
    })

    this.controller.openapi(getResourceRoute, async (c: any) => {
      const resourceController = reservationContainer.resourceController
      const { id } = c.req.valid('param')
      const resource = await resourceController.getResourceById(id)

      if (!resource) {
        return c.json({ message: 'Resource not found' }, 404)
      }

      return c.json(resource)
    })

    this.controller.openapi(getAllResourcesRoute, async (c: any) => {
      const resourceController = reservationContainer.resourceController
      const query = c.req.valid('query')

      const filters = {
        page: query.page ? Number.parseInt(query.page) : 1,
        limit: query.limit ? Number.parseInt(query.limit) : 10,
        startDate: query.startDate,
        endDate: query.endDate,
        availableOnly: query.availableOnly === 'true'
      }

      const result = await resourceController.getAllResourcesPaginated(filters)
      return c.json(result)
    })

    this.controller.openapi(checkAvailabilityRoute, async (c: any) => {
      const resourceController = reservationContainer.resourceController
      const { id } = c.req.valid('param')
      const { startDate, endDate } = c.req.valid('query')

      const result = await resourceController.checkResourceAvailability({
        resourceId: id,
        startDate,
        endDate
      })

      return c.json(result)
    })

    this.controller.openapi(getAvailabilitiesRoute, async (c: any) => {
      const resourceController = reservationContainer.resourceController
      const { id } = c.req.valid('param')
      const { startDate, endDate } = c.req.valid('query')

      const availabilities = await resourceController.getResourceAvailabilities(id, startDate, endDate)
      return c.json(availabilities)
    })
  }
}
