export interface Resource {
  id: string
  name: string
  description?: string
  type: string
  capacity: number
  pricePerHour: number
  currency: string
  isActive: boolean
  features?: string[]
  rules?: string[]
  location?: string
  createdAt: Date
  updatedAt: Date
}
