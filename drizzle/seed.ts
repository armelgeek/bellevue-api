import { randomUUID } from 'node:crypto'
import process from 'node:process'
import { db } from '../src/infrastructure/database/db'
import { currencies, roomTypes } from '../src/infrastructure/database/schema'
import { features } from '../src/infrastructure/database/schema/feature.schema'
import { hotels } from '../src/infrastructure/database/schema/hotel.schema'
import { policies } from '../src/infrastructure/database/schema/policy.schema'
import { roomFeatures, roomRules } from '../src/infrastructure/database/schema/room-relations.schema'
import { rooms } from '../src/infrastructure/database/schema/room.schema'
import { rules } from '../src/infrastructure/database/schema/rule.schema'

async function main() {
  // Room Types
  const roomTypeSimpleId = randomUUID()
  const roomTypeDoubleId = randomUUID()
  const roomTypeSuiteId = randomUUID()
  await db.insert(roomTypes).values([
    {
      id: roomTypeSimpleId,
      name: 'Simple',
      description: 'Chambre simple',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: roomTypeDoubleId,
      name: 'Double',
      description: 'Chambre double',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    { id: roomTypeSuiteId, name: 'Suite', description: 'Suite luxueuse', createdAt: new Date(), updatedAt: new Date() }
  ])
  console.info('✅ RoomTypes seeded')

  // Features
  const featureWifiId = randomUUID()
  const featureTvId = randomUUID()
  const featureBalconId = randomUUID()
  await db.insert(features).values([
    { id: featureWifiId, name: 'WiFi', description: 'Internet sans fil', createdAt: new Date(), updatedAt: new Date() },
    { id: featureTvId, name: 'TV', description: 'Télévision', createdAt: new Date(), updatedAt: new Date() },
    {
      id: featureBalconId,
      name: 'Balcon',
      description: 'Petit balcon privé',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ])
  console.info('✅ Features seeded')

  // Rules
  const ruleNonFumeurId = randomUUID()
  const ruleAnimauxId = randomUUID()
  await db.insert(rules).values([
    {
      id: ruleNonFumeurId,
      name: 'Non-fumeur',
      description: 'Interdiction de fumer',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: ruleAnimauxId,
      name: 'Animaux acceptés',
      description: 'Animaux acceptés sur demande',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ])
  console.info('✅ Rules seeded')

  // Currencies
  const currencyEurId = randomUUID()
  const currencyUsdId = randomUUID()
  await db.insert(currencies).values([
    { id: currencyEurId, code: 'EUR', symbol: '€', name: 'Euro', createdAt: new Date(), updatedAt: new Date() },
    { id: currencyUsdId, code: 'USD', symbol: '$', name: 'Dollar US', createdAt: new Date(), updatedAt: new Date() }
  ])
  console.info('✅ Currencies seeded')

  // Policies
  const policyAnnulationId = randomUUID()
  await db.insert(policies).values([
    {
      id: policyAnnulationId,
      title: 'Annulation gratuite',
      description: 'Annulation gratuite jusqu’à 24h avant',
      type: 'cancellation',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ])
  console.info('✅ Policies seeded')

  // Hotel
  const hotelId = randomUUID()
  await db.insert(hotels).values([
    {
      id: hotelId,
      name: 'Hôtel Bellevue',
      description: 'Un hôtel de test',
      address: '123 rue de la Paix',
      phone: '0102030405',
      email: 'contact@bellevue.com',
      images: JSON.stringify([]),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ])
  console.info('✅ Hotel seeded')

  // Rooms
  const room1Id = randomUUID()
  const room2Id = randomUUID()
  const room3Id = randomUUID()
  const room1 = {
    id: room1Id,
    name: 'Chambre 101',
    description: 'Chambre simple avec vue sur jardin',
    type: 'single',
    capacity: 1,
    pricePerNight: '80',
    currency: 'EUR',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  const room2 = {
    id: room2Id,
    name: 'Chambre 102',
    description: 'Chambre double avec balcon',
    type: 'double',
    capacity: 2,
    pricePerNight: '120',
    currency: 'EUR',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  const room3 = {
    id: room3Id,
    name: 'Suite 201',
    description: 'Suite luxueuse avec terrasse',
    type: 'suite',
    capacity: 4,
    pricePerNight: '250',
    currency: 'EUR',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  await db.insert(rooms).values(room1)
  await db.insert(rooms).values(room2)
  await db.insert(rooms).values(room3)
  console.info('✅ Rooms seeded')

  // Room Features (jointure)
  await db.insert(roomFeatures).values([
    { roomId: room1Id, featureId: featureWifiId },
    { roomId: room1Id, featureId: featureTvId },
    { roomId: room2Id, featureId: featureWifiId },
    { roomId: room2Id, featureId: featureTvId },
    { roomId: room2Id, featureId: featureBalconId },
    { roomId: room3Id, featureId: featureWifiId },
    { roomId: room3Id, featureId: featureTvId },
    { roomId: room3Id, featureId: featureBalconId }
  ])
  console.info('✅ RoomFeatures seeded')

  // Room Rules (jointure)
  await db.insert(roomRules).values([
    { roomId: room1Id, ruleId: ruleNonFumeurId },
    { roomId: room2Id, ruleId: ruleNonFumeurId },
    { roomId: room2Id, ruleId: ruleAnimauxId },
    { roomId: room3Id, ruleId: ruleNonFumeurId }
  ])
  console.info('✅ RoomRules seeded')
}
main().catch((error) => {
  console.error('❌ Seed error:', error)
  process.exit(1)
})
