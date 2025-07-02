#!/usr/bin/env bun

/**
 * Script de test pour simuler un webhook Stripe
 * Usage: bun run scripts/test-stripe-webhook.ts
 */


const mockPaymentIntentSucceeded = {
  id: 'evt_test_webhook',
  object: 'event',
  api_version: '2020-08-27',
  created: Math.floor(Date.now() / 1000),
  data: {
    object: {
      id: 'pi_test_1234567890',
      object: 'payment_intent',
      currency: 'eur',
      status: 'succeeded',
      metadata: {
        paymentId: 'pay_test_123',
        reservationId: 'res_test_456',
        userId: 'user_test_789'
      }
    }
  },
  livemode: false,
  pending_webhooks: 1,
  request: {
    id: 'req_test_123',
    idempotency_key: null
  },
  type: 'payment_intent.succeeded'
}

const mockPaymentIntentFailed = {
  id: 'evt_test_webhook_failed',
  object: 'event',
  api_version: '2020-08-27',
  created: Math.floor(Date.now() / 1000),
  data: {
    object: {
      id: 'pi_test_failed_1234567890',
      object: 'payment_intent',
      amount: 15000,
      currency: 'eur',
      status: 'requires_payment_method',
      last_payment_error: {
        code: 'card_declined',
        message: 'Your card was declined.'
      },
      metadata: {
        paymentId: 'pay_test_failed_123',
        reservationId: 'res_test_failed_456',
        userId: 'user_test_failed_789'
      }
    }
  },
  livemode: false,
  pending_webhooks: 1,
  request: {
    id: 'req_test_failed_123',
    idempotency_key: null
  },
  type: 'payment_intent.payment_failed'
}

const mockCheckoutSessionCompleted = {
  id: 'evt_test_checkout_webhook',
  object: 'event',
  api_version: '2020-08-27',
  created: Math.floor(Date.now() / 1000),
  data: {
    object: {
      id: 'cs_test_1234567890',
      object: 'checkout.session',
      amount_total: 15000,
      currency: 'eur',
      payment_status: 'paid',
      metadata: {
        paymentId: 'pay_test_checkout_123',
        reservationId: 'res_test_checkout_456',
        userId: 'user_test_checkout_789'
      }
    }
  },
  livemode: false,
  pending_webhooks: 1,
  request: {
    id: 'req_test_checkout_123',
    idempotency_key: null
  },
  type: 'checkout.session.completed'
}

const mockPaymentIntentCreated = {
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

async function testWebhook(eventData: any, description: string) {
  console.log(`\n🧪 Test: ${description}`)
  console.log('─'.repeat(50))

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData)
    })

    const result = await response.json()

    console.log(`Statut HTTP: ${response.status}`)
    console.log('Réponse:', JSON.stringify(result, null, 2))

    if (response.ok) {
      console.log('✅ Test réussi')
    } else {
      console.log('❌ Test échoué')
    }
  } catch (error) {
    console.error('❌ Erreur lors du test:', error)
  }
}

async function runTests() {
  console.log('🚀 Démarrage des tests webhook Stripe')
  console.log(`📡 URL cible: ${WEBHOOK_URL}`)

  await testWebhook(mockPaymentIntentSucceeded, 'Payment Intent Succeeded')

  await testWebhook(mockPaymentIntentFailed, 'Payment Intent Failed')

  await testWebhook(mockCheckoutSessionCompleted, 'Checkout Session Completed')

  await testWebhook(mockPaymentIntentCreated, 'Payment Intent Created (Should be ignored)')

  console.log('\n✨ Tests webhook terminés!')
  console.log('\n💡 Notes:')
  console.log('   - Assurez-vous que le serveur est démarré (bun run dev)')
  console.log('   - Remplacez "your_test_token_here" par un vrai token')
  console.log('   - En production, la signature Stripe est vérifiée')
  console.log('   - Les événements payment_intent.created sont ignorés silencieusement')
}

if (import.meta.main) {
  runTests()
}

export { runTests }
