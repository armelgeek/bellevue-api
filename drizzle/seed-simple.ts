#!/usr/bin/env bun
import process from 'node:process'
import { db } from '../src/infrastructure/database/db'
import { resources } from '../src/infrastructure/database/schema/schema'

/**
 * Script de seed pour insérer uniquement des ressources de test
 * Usage: bun run drizzle/seed-resources.ts
 */

function generateId(length: number = 15): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

const testResourcesData = [
  {
    id: generateId(15),
    name: 'Salle de réunion A',
    description: "Grande salle de réunion équipée d'un vidéoprojecteur et de 12 places",
    type: 'meeting_room',
    capacity: 12,
    pricePerHour: '25.00',
    currency: 'eur',
    isActive: true,
    features: ['vidéoprojecteur', 'tableau blanc', 'wifi', 'climatisation'],
    rules: ['Pas de nourriture', 'Réservation min 1h', 'Annulation 2h avant'],
    location: 'Bâtiment A - Étage 1 - Salle 101',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: generateId(15),
    name: 'Salle de réunion B',
    description: 'Petite salle de réunion intime pour 6 personnes',
    type: 'meeting_room',
    capacity: 6,
    pricePerHour: '15.00',
    currency: 'eur',
    isActive: true,
    features: ['écran TV', 'wifi'],
    rules: ['Réservation min 30min', 'Annulation 1h avant'],
    location: 'Bâtiment A - Étage 2 - Salle 201',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: generateId(15),
    name: 'Espace de coworking',
    description: 'Espace ouvert avec 20 postes de travail flexibles',
    type: 'workspace',
    capacity: 20,
    pricePerHour: '10.00',
    currency: 'eur',
    isActive: true,
    features: ['wifi', 'prises électriques', 'café gratuit', 'imprimante'],
    rules: ['Pas de téléphone', 'Silence de rigueur'],
    location: 'Bâtiment B - Rez-de-chaussée',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: generateId(15),
    name: 'Auditorium',
    description: 'Grand amphithéâtre pour conférences et présentations',
    type: 'auditorium',
    capacity: 100,
    pricePerHour: '75.00',
    currency: 'eur',
    isActive: true,
    features: ['sonorisation', 'éclairage scène', 'vidéoprojecteur', 'micros'],
    rules: ['Réservation min 2h', 'Technicien obligatoire', 'Annulation 24h avant'],
    location: 'Bâtiment C - Rez-de-chaussée',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: generateId(15),
    name: 'Laboratoire informatique',
    description: 'Salle équipée de 15 ordinateurs pour formations',
    type: 'computer_lab',
    capacity: 15,
    pricePerHour: '40.00',
    currency: 'eur',
    isActive: true,
    features: ['15 PC', 'vidéoprojecteur', 'logiciels développement', 'wifi'],
    rules: ['Formateur requis', 'Pas de nourriture', 'Réservation min 2h'],
    location: 'Bâtiment A - Étage 3 - Salle 301',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: generateId(15),
    name: 'Salle de créativité',
    description: 'Espace modulable pour brainstorming et ateliers créatifs',
    type: 'creative_space',
    capacity: 8,
    pricePerHour: '20.00',
    currency: 'eur',
    isActive: true,
    features: ['tableaux mobiles', 'matériel créatif', 'mobilier modulable'],
    rules: ['Rangement obligatoire', 'Matériel à rendre'],
    location: 'Bâtiment B - Étage 1 - Salle 105',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

async function seedResources() {
  console.log('🌱 Début du seeding des ressources...')

  try {
    const existingResources = await db.select().from(resources)

    if (existingResources.length > 0) {
      console.log(`   ⚠️  ${existingResources.length} ressources existantes trouvées`)
      console.log('   💡 Vous pouvez utiliser le script reset.ts pour nettoyer la base avant le seeding')
    }

    console.log('🏢 Création des ressources...')

    let insertedCount = 0
    for (const resource of testResourcesData) {
      try {
        await db.insert(resources).values(resource)
        console.log(`   ✅ Ressource créée: ${resource.name}`)
        insertedCount++
      } catch (error) {
        console.log(`   ❌ Erreur lors de la création de "${resource.name}":`, error)
      }
    }

    console.log('\n✨ Seeding des ressources terminé!')
    console.log(`📋 Résumé: ${insertedCount}/${testResourcesData.length} ressources créées`)

    if (insertedCount > 0) {
      console.log('\n🎯 Ressources disponibles:')
      testResourcesData.forEach((resource, index) => {
        if (index < insertedCount) {
          console.log(
            `   • ${resource.name} (${resource.type}) - ${resource.pricePerHour}€/h - Capacité: ${resource.capacity}`
          )
        }
      })
    }

    process.exit(0)
  } catch (error) {
    console.error('❌ Erreur lors du seeding des ressources:', error)
    process.exit(1)
  }
}

if (import.meta.main) {
  seedResources()
}

export { seedResources }
