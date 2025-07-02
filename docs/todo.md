# Roadmap Technique – Backend Plateforme de Réservation Hôtel & BnB

## Tâches à réaliser (TODO)

### 1. Spécifications & Maquettes

- [ ] Rédiger les spécifications fonctionnelles détaillées
- [ ] Réaliser les maquettes UI/UX (pour l'API et la documentation)

### 2. Use Cases détaillés

#### 2.1. Authentification & Gestion des Utilisateurs

- [ ] UC01 – Inscription client
  - **Scénario nominal** : Un client renseigne ses informations, valide son email, son compte est créé.
  - **Alternatives** :
    - Email déjà utilisé → message d’erreur.
    - Email invalide → message d’erreur.
- [ ] UC02 – Connexion
  - **Scénario nominal** : L’utilisateur saisit ses identifiants, reçoit un JWT, accède à son espace.
  - **Alternatives** :
    - Mauvais mot de passe → message d’erreur.
    - Compte inexistant → message d’erreur.
- [ ] UC03 – Gestion des rôles (admin, staff, client)
  - **Scénario nominal** : Un admin attribue un rôle à un utilisateur.
  - **Alternatives** :
    - Utilisateur inexistant → erreur.

#### 2.2. Gestion des Chambres

- [ ] UC10 – Création d’une chambre
  - **Scénario nominal** : Un staff/admin crée une chambre avec ses caractéristiques.
  - **Alternatives** :
    - Chambre déjà existante (même numéro) → erreur.
- [ ] UC11 – Modification d’une chambre
  - **Scénario nominal** : Un staff/admin modifie les infos d’une chambre.
  - **Alternatives** :
    - Chambre inexistante → erreur.
- [ ] UC12 – Suppression d’une chambre
  - **Scénario nominal** : Un staff/admin supprime une chambre.
  - **Alternatives** :
    - Chambre liée à une réservation future → refus/signalement.

#### 2.3. Réservations

- [ ] UC20 – Création d’une réservation
  - **Scénario nominal** : Un client réserve une chambre disponible pour des dates données.
  - **Alternatives** :
    - Chambre non disponible → message d’erreur.
    - Paiement échoué → réservation annulée.
- [ ] UC21 – Annulation d’une réservation
  - **Scénario nominal** : Un client annule une réservation selon la politique d’annulation.
  - **Alternatives** :
    - Délai dépassé → refus d’annulation.
- [ ] UC22 – Consultation des réservations
  - **Scénario nominal** : Un client ou staff consulte la liste de ses réservations.

#### 2.4. Paiement

- [ ] UC30 – Paiement d’une réservation
  - **Scénario nominal** : Le client paie via Stripe, la réservation est confirmée.
  - **Alternatives** :
    - Paiement refusé → réservation non validée.

#### 2.5. Gestion des fichiers

- [ ] UC40 – Upload d’images de chambre
  - **Scénario nominal** : Un staff/admin ajoute une image à une chambre.
  - **Alternatives** :
    - Fichier trop volumineux ou format non supporté → erreur.

### 3. Backend technique

- [ ] Initialiser le projet Bun/TypeScript/Hono
- [ ] Définir le schéma de la base de données (Drizzle ORM)
- [ ] Implémenter l’authentification (JWT, rôles admin/staff/client)
- [ ] CRUD chambres
- [ ] CRUD réservations
- [ ] Gestion calendrier de disponibilités
- [ ] Intégration paiement (Stripe)
- [ ] Gestion des fichiers (upload images chambres/hôtel)
- [ ] API RESTful documentée (OpenAPI/Swagger)
- [ ] Scripts de migration et seed DB
- [ ] Tests unitaires et d’intégration backend
- [ ] Documentation technique (installation, API, architecture)
- [ ] Cahier de tests fonctionnels
- [ ] Déploiement backend (dev, prod)

