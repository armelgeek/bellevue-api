# 🧪 Guide de Test API - Système de Réservation

Ce guide contient des exemples d'appels API pour tester toutes les fonctionnalités de l'API de réservation.

## 📋 Prérequis

1. **Serveur démarré** : `bun run dev`
2. **Base de données seedée** : `bun run drizzle/seed-simple.ts`
3. **Port par défaut** : `http://localhost:3000`

## 🔧 Configuration

### Variables d'environnement
```bash
# .env
DATABASE_URL="postgresql://user:password@localhost:5432/reservation_db"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
REACT_APP_URL="http://localhost:3001"
```

### Headers obligatoires
```bash
Authorization: Bearer <token>
Content-Type: application/json
```

---

## 🏥 **1. Health & Debug**

### Vérifier l'état de l'API
```bash
curl -X GET "http://localhost:3000/health" \
  -H "Authorization: Bearer <token>"
```

**Réponse attendue :**
```json
{
  "status": "OK",
  "timestamp": "2025-06-21T10:30:00Z",
  "version": "1.0.0",
  "services": {
    "database": "Drizzle ORM",
    "payment": "Stripe",
    "notifications": "Email",
    "audit": "Active"
  }
}
```

### Debug du container DI
```bash
curl -X GET "http://localhost:3000/debug/container" \
  -H "Authorization: Bearer <token>"
```

---

## 🏢 **2. Gestion des Ressources**

### Lister toutes les ressources
```bash
curl -X GET "http://localhost:3000/resources" \
  -H "Authorization: Bearer <token>"
```

### Obtenir une ressource spécifique
```bash
curl -X GET "http://localhost:3000/resources/{resource-id}" \
  -H "Authorization: Bearer <token>"
```

### Vérifier la disponibilité d'une ressource
```bash
curl -X GET "http://localhost:3000/resources/{resource-id}/availability?startDate=2025-06-25T09:00:00Z&endDate=2025-06-25T17:00:00Z" \
  -H "Authorization: Bearer <token>"
```

**Réponse attendue :**
```json
{
  "isAvailable": true,
  "conflictingReservations": []
}
```

### Obtenir les créneaux disponibles
```bash
curl -X GET "http://localhost:3000/resources/{resource-id}/slots?date=2025-06-25" \
  -H "Authorization: Bearer <token>"
```

**Réponse attendue :**
```json
{
  "resourceId": "resource-123",
  "date": "2025-06-25",
  "slots": [
    {
      "startTime": "09:00",
      "endTime": "10:00",
      "isAvailable": true,
      "reservationId": null
    },
    {
      "startTime": "10:00",
      "endTime": "11:00",
      "isAvailable": false,
      "reservationId": "res_abc123"
    }
  ]
}
```

---

## 📅 **3. Gestion des Réservations**

### Créer une réservation simple
```bash
curl -X POST "http://localhost:3000/reservations" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "resourceId": "resource-123",
    "startDate": "2025-06-25T09:00:00Z",
    "endDate": "2025-06-25T17:00:00Z"
  }'
```

### Créer une réservation avec paiement Stripe
```bash
curl -X POST "http://localhost:3000/reservations/with-stripe" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "resourceId": "resource-123",
    "startDate": "2025-06-26T14:00:00Z",
    "endDate": "2025-06-26T18:00:00Z",
    "amount": 200,
    "currency": "eur"
  }'
```

**Réponse attendue :**
```json
{
  "reservation": {
    "id": "res_abc123",
    "status": "pending",
    "startDate": "2025-06-26T14:00:00Z",
    "endDate": "2025-06-26T18:00:00Z"
  },
  "payment": {
    "id": "pay_def456",
    "amount": 200,
    "currency": "eur",
    "status": "pending"
  },
  "checkoutUrl": "https://checkout.stripe.com/pay/cs_test_..."
}
```

### Lister mes réservations
```bash
curl -X GET "http://localhost:3000/reservations?page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

### Obtenir une réservation spécifique
```bash
curl -X GET "http://localhost:3000/reservations/{reservation-id}" \
  -H "Authorization: Bearer <token>"
```

### Modifier une réservation
```bash
curl -X PUT "http://localhost:3000/reservations/{reservation-id}" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "startDate": "2025-06-26T10:00:00Z",
    "endDate": "2025-06-26T16:00:00Z"
  }'
```

### Annuler une réservation
```bash
curl -X PUT "http://localhost:3000/reservations/{reservation-id}/cancel" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Changement de programme"
  }'
```

### Changer le statut d'une réservation
```bash
curl -X PUT "http://localhost:3000/reservations/{reservation-id}/status" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "confirmed"
  }'
```

---

## ⏰ **4. Extension de Réservation**

### Calculer le coût d'extension
```bash
curl -X GET "http://localhost:3000/reservations/{reservation-id}/extension-cost?newEndDate=2025-06-26T20:00:00Z" \
  -H "Authorization: Bearer <token>"
```

**Réponse attendue :**
```json
{
  "canExtend": true,
  "additionalCost": 50,
  "currency": "eur",
  "newEndDate": "2025-06-26T20:00:00Z",
  "conflictingReservations": []
}
```

### Prolonger une réservation
```bash
curl -X PUT "http://localhost:3000/reservations/{reservation-id}/extend" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "newEndDate": "2025-06-26T20:00:00Z",
    "payForExtension": true
  }'
```

**Réponse attendue :**
```json
{
  "reservation": {
    "id": "res_abc123",
    "endDate": "2025-06-26T20:00:00Z",
    "status": "confirmed"
  },
  "paymentRequired": true,
  "paymentUrl": "https://checkout.stripe.com/pay/cs_test_...",
  "additionalCost": 50
}
```

---

## 💳 **5. Gestion des Paiements**

### Lister mes paiements
```bash
curl -X GET "http://localhost:3000/payments?page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

### Obtenir un paiement spécifique
```bash
curl -X GET "http://localhost:3000/payments/{payment-id}" \
  -H "Authorization: Bearer <token>"
```

### Obtenir le paiement d'une réservation
```bash
curl -X GET "http://localhost:3000/payments/reservation/{reservation-id}" \
  -H "Authorization: Bearer <token>"
```

### Créer un nouveau paiement
```bash
curl -X POST "http://localhost:3000/payments" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "reservationId": "res_abc123",
    "amount": 150,
    "currency": "eur"
  }'
```

### Retry d'un paiement échoué
```bash
curl -X POST "http://localhost:3000/payments/{payment-id}/retry" \
  -H "Authorization: Bearer <token>"
```

### Demander un remboursement
```bash
curl -X POST "http://localhost:3000/payments/{payment-id}/refund" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100,
    "reason": "Annulation de dernière minute"
  }'
```

### Mettre à jour le statut d'un paiement
```bash
curl -X PUT "http://localhost:3000/payments/{payment-id}/status" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "paid"
  }'
```

---

## 📊 **6. Dashboard et Statistiques**

### Obtenir le résumé utilisateur
```bash
curl -X GET "http://localhost:3000/dashboard/summary" \
  -H "Authorization: Bearer <token>"
```

**Réponse attendue :**
```json
{
  "user": {
    "totalReservations": 15,
    "activeReservations": 3,
    "totalSpent": 1250
  },
  "upcomingReservations": [
    {
      "id": "res_abc123",
      "resourceId": "room-456",
      "startDate": "2025-06-25T09:00:00Z",
      "endDate": "2025-06-25T17:00:00Z",
      "status": "confirmed"
    }
  ],
  "recentActivity": []
}
```

### Obtenir l'historique d'une réservation
```bash
curl -X GET "http://localhost:3000/reservations/{reservation-id}/history" \
  -H "Authorization: Bearer <token>"
```

**Réponse attendue :**
```json
{
  "reservationId": "res_abc123",
  "history": [
    {
      "timestamp": "2025-06-21T10:00:00Z",
      "action": "reservation_created",
      "oldValue": null,
      "newValue": "pending",
      "userId": "user-123",
      "details": "Réservation créée"
    },
    {
      "timestamp": "2025-06-21T10:30:00Z",
      "action": "status_updated",
      "oldValue": "pending",
      "newValue": "confirmed",
      "userId": "user-123",
      "details": "Statut modifié vers confirmed"
    }
  ]
}
```

---

## 📈 **7. Statistiques Avancées**

### Statistiques d'occupation
```bash
curl -X GET "http://localhost:3000/stats/occupancy?resourceId=room-456&period=week" \
  -H "Authorization: Bearer <token>"
```

**Réponse attendue :**
```json
{
  "resourceId": "room-456",
  "period": "week",
  "occupancyRate": 0.75,
  "totalHours": 168,
  "bookedHours": 126,
  "revenue": 3150
}
```

### Statistiques globales
```bash
curl -X GET "http://localhost:3000/stats/global?period=month" \
  -H "Authorization: Bearer <token>"
```

### Prédictions d'utilisation
```bash
curl -X GET "http://localhost:3000/stats/predictions?resourceId=room-456&days=30" \
  -H "Authorization: Bearer <token>"
```

### Comparaison de ressources
```bash
curl -X GET "http://localhost:3000/stats/compare?resourceIds=room-456,room-789&period=week" \
  -H "Authorization: Bearer <token>"
```

---

## 🔗 **8. Webhooks Stripe**

### Webhook de confirmation de paiement

```bash
curl -X POST "http://localhost:3000/webhooks/stripe" \
  -H "Stripe-Signature: t=1624285200,v1=signature..." \
  -H "Content-Type: application/json" \
  -d '{
    "type": "payment_intent.succeeded",
    "data": {
      "object": {
        "id": "pi_test_123",
        "status": "succeeded",
        "metadata": {
          "paymentId": "pay_test_123",
          "reservationId": "res_test_456",
          "userId": "user_test_789"
        }
      }
    }
  }'
```

### Webhook de paiement échoué

```bash
curl -X POST "http://localhost:3000/webhooks/stripe" \
  -H "Stripe-Signature: t=1624285200,v1=signature..." \
  -H "Content-Type: application/json" \
  -d '{
    "type": "payment_intent.payment_failed",
    "data": {
      "object": {
        "id": "pi_test_456",
        "status": "requires_payment_method",
        "metadata": {
          "paymentId": "pay_test_456",
          "reservationId": "res_test_789",
          "userId": "user_test_123"
        }
      }
    }
  }'
```

### Test des webhooks Stripe (Script automatisé)

```bash
# Utiliser le script de test intégré
bun run scripts/test-stripe-webhook.ts
```

**⚠️ Important pour les webhooks :**

- En développement, vous pouvez utiliser Stripe CLI : `stripe listen --forward-to localhost:3000/webhooks/stripe`
- Les métadonnées `paymentId`, `reservationId`, et `userId` doivent être présentes
- La signature Stripe est vérifiée en production
- Les événements sans métadonnées sont ignorés (pas d'erreur)

### 🔧 Dépannage des webhooks Stripe

#### Événements ignorés automatiquement
Ces événements ne nécessitent pas de métadonnées et sont ignorés silencieusement :
- `payment_intent.created`
- `payment_intent.processing`
- `payment_intent.requires_action`
- `payment_method.attached`
- `setup_intent.created`

#### Événements traités
Ces événements nécessitent des métadonnées et déclenchent des actions :
- `payment_intent.succeeded` → Confirme la réservation
- `payment_intent.payment_failed` → Annule la réservation
- `payment_intent.canceled` → Annule la réservation
- `checkout.session.completed` → Traite selon le statut de paiement

#### Messages d'erreur courants

**"Métadonnées de paiement introuvables"**
- Cause : L'événement Stripe ne contient pas les métadonnées requises
- Solution : Vérifier que les métadonnées sont bien ajoutées lors de la création du PaymentIntent

**"Signature invalide"**
- Cause : La signature Stripe ne correspond pas
- Solution : Vérifier la variable d'environnement `STRIPE_WEBHOOK_SECRET`

---

## 👨‍💼 **9. Administration (Admin uniquement)**

### Lister toutes les réservations (Admin)
```bash
curl -X GET "http://localhost:3000/admin/reservations?page=1&limit=20" \
  -H "Authorization: Bearer <admin-token>"
```

### Traiter un remboursement (Admin)
```bash
curl -X PUT "http://localhost:3000/admin/payments/{payment-id}/refund" \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "refundAmount": 150,
    "reason": "Problème technique"
  }'
```

---

## 🧪 **10. Tests de Scénarios**

### Scénario 1 : Réservation complète avec paiement
```bash
# 1. Vérifier disponibilité
curl -X GET "http://localhost:3000/resources/room-456/availability?startDate=2025-06-25T09:00:00Z&endDate=2025-06-25T17:00:00Z" \
  -H "Authorization: Bearer <token>"

# 2. Créer réservation avec paiement
curl -X POST "http://localhost:3000/reservations/with-stripe" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "resourceId": "room-456",
    "startDate": "2025-06-25T09:00:00Z",
    "endDate": "2025-06-25T17:00:00Z",
    "amount": 200,
    "currency": "eur"
  }'

# 3. Vérifier le statut
curl -X GET "http://localhost:3000/reservations/{reservation-id}" \
  -H "Authorization: Bearer <token>"
```

### Scénario 2 : Extension de réservation
```bash
# 1. Calculer le coût d'extension
curl -X GET "http://localhost:3000/reservations/{reservation-id}/extension-cost?newEndDate=2025-06-25T20:00:00Z" \
  -H "Authorization: Bearer <token>"

# 2. Effectuer l'extension
curl -X PUT "http://localhost:3000/reservations/{reservation-id}/extend" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "newEndDate": "2025-06-25T20:00:00Z",
    "payForExtension": true
  }'
```

### Scénario 3 : Annulation et remboursement
```bash
# 1. Annuler la réservation
curl -X PUT "http://localhost:3000/reservations/{reservation-id}/cancel" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Changement de programme"
  }'

# 2. Demander un remboursement
curl -X POST "http://localhost:3000/payments/{payment-id}/refund" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 200,
    "reason": "Réservation annulée"
  }'
```

---

## 🚨 **11. Tests d'Erreurs**

### Test de conflit de réservation
```bash
# Essayer de réserver un créneau déjà occupé
curl -X POST "http://localhost:3000/reservations" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "resourceId": "room-456",
    "startDate": "2025-06-25T10:00:00Z",
    "endDate": "2025-06-25T12:00:00Z"
  }'
```

**Réponse attendue (409 Conflict) :**
```json
{
  "message": "La ressource n'est pas disponible pour ces dates",
  "conflictingReservations": ["res_existing123"]
}
```

### Test d'autorisation
```bash
# Essayer d'accéder à une réservation d'un autre utilisateur
curl -X GET "http://localhost:3000/reservations/{other-user-reservation-id}" \
  -H "Authorization: Bearer <token>"
```

**Réponse attendue (403 Forbidden) :**
```json
{
  "message": "Non autorisé à accéder à cette réservation"
}
```

---

## 📝 **12. Notes pour les Tests**

### Données de test disponibles
Après le seeding (`seed-simple.ts`), vous aurez :
- **6 ressources** de différents types (meeting_room, workspace, auditorium, etc.)
- Capacités de 6 à 100 personnes
- Prix de 10€ à 75€ par heure

### Tokens d'authentification
```bash
# Utiliser Better Auth pour générer des tokens
# Remplacer <token> par un vrai token JWT
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Variables utiles
```bash
# IDs générés par le seeding (exemples)
RESOURCE_ID="ABcD123456789..."
RESERVATION_ID="XyZ987654321..."
PAYMENT_ID="Pay123456789..."
```

### Outils recommandés
- **Postman** : Collection d'APIs
- **Insomnia** : Client REST
- **curl** : Tests en ligne de commande
- **Thunder Client** : Extension VS Code

---

## 🎯 **Résumé des Endpoints**

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/health` | État de l'API |
| GET | `/debug/container` | Debug DI |
| GET | `/resources` | Liste des ressources |
| GET | `/resources/{id}/availability` | Vérifier disponibilité |
| GET | `/resources/{id}/slots` | Créneaux disponibles |
| POST | `/reservations` | Créer réservation |
| POST | `/reservations/with-stripe` | Réservation + paiement |
| GET | `/reservations` | Mes réservations |
| PUT | `/reservations/{id}/extend` | Prolonger réservation |
| PUT | `/reservations/{id}/cancel` | Annuler réservation |
| GET | `/dashboard/summary` | Dashboard utilisateur |
| POST | `/payments/{id}/refund` | Demander remboursement |
| GET | `/stats/occupancy` | Statistiques d'occupation |

**🚀 Votre API de réservation est maintenant prête à être testée !**
