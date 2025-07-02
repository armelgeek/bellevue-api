#!/usr/bin/env bun

/**
 * Test rapide pour l'événement payment_intent.created
 */

const testEvent = {
  id: 'evt_test_created',
  object: 'event',
  api_version: '2020-08-27',
  created: Math.floor(Date.now() / 1000),
  data: {
    object: {
      id: 'pi_test_created_1234567890',
      object: 'payment_intent',
      amount: 15000,
      currency: 'eur',
      status: 'requires_payment_method',
    }
  },
  livemode: false,
  pending_webhooks: 1,
  request: {
    id: 'req_test_created_123',
    idempotency_key: null
  },
  type: 'payment_intent.created'
}

async function testWebhook() {
  try {
    console.log("🧪 Test de l'événement payment_intent.created")

      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Stripe-Signature': 'mock_signature',
        Authorization: 'Bearer your_test_token_here'
      },
      body: JSON.stringify(testEvent)
    })

    const result = await response.json()

    console.log(`Statut HTTP: ${response.status}`)
    console.log('Réponse:', JSON.stringify(result, null, 2))

    if (response.ok && result.status === 'ignored') {
      console.log('✅ Test réussi - Événement ignoré comme attendu')
    } else {
      console.log('❌ Test échoué')
    }
  } catch (error) {
    console.error('❌ Erreur:', error)
  }
}

testWebhook()
