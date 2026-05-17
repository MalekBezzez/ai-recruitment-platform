# 👥 Microservice Joboffer — README (FR)


## ⚙️ Technologies utilisées
- **Java 17**
- **Spring Boot 3.x**
- **Spring Data JPA (PostgreSQL)**
- **Spring Security**
- **Spring Cloud Netflix Eureka Client**
- **Hibernate Validator**
- **Docker & Docker Compose**
- **Maven**




# Table des Matières

1. [OfferController](#⚡-offercontroller)
2. [WorkflowOfferController](#⚡-workflowoffercontroller)
3. [ApplicationController](#⚡-applicationcontroller)
4. [InterviewController](#⚡-interviewcontroller)
5. [DiplomaTypeController](#⚡-diplomatypecontroller)
6. [SiteController](#⚡-sitecontroller)
7. [RoomController](#⚡-roomcontroller)



# ⚡ OfferController

Ce controller gère toutes les opérations liées aux offres d'emploi : création, lecture, mise à jour, suppression et récupération des informations détaillées.

---

## 1. Créer une offre

- **Endpoint** : `POST /api/offers`  
- **Méthode** : `createOffer`  
- **Description** : Ajoute une nouvelle offre dans le système.  
- **Paramètres** : `OfferRequestDTO`

---

## 2. Récupérer les offres créées par un utilisateur

- **Endpoint** : `GET /api/offers/created-by/{id}`  
- **Méthode** : `getOffersCreatedBy`  
- **Description** : Retourne une liste simplifiée des offres créées par l’utilisateur. Cette liste contient uniquement les informations essentielles nécessaires pour l’affichage dans une vue de type tableau ou liste.  
- **Paramètres** :  
  - `id (Long)` : identifiant de l’utilisateur.  
- **Réponse** : Liste de `OfferSummarizeDTO`

---

## 3. Supprimer une offre

- **Endpoint** : `DELETE /api/offers/{id}`  
- **Méthode** : `deleteOffer`  
- **Description** : Supprime une offre existante à partir de son identifiant.  
- **Paramètres** :  
  - `id (Long)` : identifiant de l’offre.

---

## 4. Mettre à jour une offre

- **Endpoint** : `PUT /api/offers/{id}`  
- **Méthode** : `updateOffer`  
- **Description** : Met à jour les informations d’une offre existante.  
- **Paramètres** :  
  - `id (Long)` : identifiant de l’offre.  
  - `OfferRequestDTO` : nouvelles données de l’offre.

---

## 5. Récupérer une offre par ID

- **Endpoint** : `GET /api/offers/{id}`  
- **Méthode** : `getOfferById`  
- **Description** : Récupère les informations générales d’une offre spécifique. Utilisé principalement pour l’auto-remplissage des champs dans la page de mise à jour d’une offre.  
- **Paramètres** :  
  - `id (Long)` : identifiant de l’offre.  
- **Réponse** : `OfferResponseDTO`

---

## 6. Récupérer les détails d’une offre

- **Endpoint** : `GET /api/offers/details/{id}`  
- **Méthode** : `getOfferDetails`  
- **Description** : Récupère les détails complets d’une offre, utilisés par la page de détails dans l’interface utilisateur.  
- **Paramètres** :  
  - `id (Long)` : identifiant de l’offre.  
- **Réponse** : `OfferDetailsDTO`

---

## 7. Récupérer le titre d’une offre

- **Endpoint** : `GET /api/offers/{id}/title`  
- **Méthode** : `getJobTitleById`  
- **Description** : Récupère uniquement le titre d’une offre spécifique.  
- **Paramètres** :  
  - `id (Long)` : identifiant de l’offre.  
- **Réponse** : Retourne le titre sous forme de `String`




# ⚡ WorkflowOfferController

Ce controller gère le cycle de vie des offres d'emploi dans le workflow : démarrage d’un workflow, validation des tâches, suivi des requêtes initiées par un utilisateur, consultation des historiques et vérification d’état.

---

## 📝 1. Démarrer un workflow

- **Endpoint** : `POST /api/workflowjoboffer/start/{offerId}`  
- **Méthode** : `startWorkflow`  
- **Description** : Démarre le workflow de traitement pour une offre donnée.  
- **Paramètres** :  
  - `offerId (Long)` : Identifiant de l’offre à traiter.

---

## 📝 2. Compléter une tâche (traiter une demande d’offre d’emploi)

- **Endpoint** : `POST /api/workflowjoboffer/tasks/complete`  
- **Méthode** : `completeTask`  
- **Description** : Permet de compléter une tâche dans le processus workflow de validation de l’offre d’emploi en précisant la décision, un commentaire et l’utilisateur qui valide.  
- **Paramètres** :  
  - `taskId (Long)` : Identifiant de la tâche.  
  - `decision (String)` : Décision prise.  
  - `comment (String)` : Commentaire ajouté lors de la validation.  
  - `completedBy (Long)` : Identifiant de l’utilisateur qui valide.

---

## 📝 3. Récupérer les tâches assignées à un utilisateur

- **Endpoint** : `GET /api/workflowjoboffer/tasks/user/{userId}`  
- **Méthode** : `getUserTasks`  
- **Description** : Récupère la liste des tâches workflow en attente pour un utilisateur spécifique.  
- **Paramètres** :  
  - `userId (Long)` : Identifiant de l’utilisateur.  
- **Réponse** : Liste de `JobOfferTaskDTO` contenant les informations de chaque tâche.

---

## 📝 4. Récupérer les offres d’emploi en cours de validation initiées par un utilisateur

- **Endpoint** : `GET /api/workflowjoboffer/requests/user/{userId}`  
- **Méthode** : `getUserInitiatedRequests`  
- **Description** : Récupère la liste des workflows d’offres d’emploi actuellement en cours de validation initiés par un utilisateur donné.  
- **Paramètres** :  
  - `userId (Long)` : Identifiant unique de l’utilisateur.  
- **Réponse** : Liste d’objets `JobOfferRequestStateDTO` représentant l’état de chaque offre d’emploi en cours de validation.

---

## 📝 5. Consulter l’historique des offres traitées côté demandeur

- **Endpoint** : `GET /api/workflowjoboffer/history/owner/{ownerId}`  
- **Méthode** : `getHistoryForOwner`  
- **Description** : Permet au demandeur (propriétaire de l’offre) de consulter l’historique des étapes déjà parcourues par ses offres dans le workflow.  
- **Paramètres** :  
  - `ownerId (Long)` : Identifiant du propriétaire/demandeur.  
- **Réponse** : Liste de `OwnerTaskHistoryDTO` contenant les informations des étapes passées (décisions, commentaires) pour chaque offre.

---

## 📝 6. Consulter l’historique des offres traitées côté validateur

- **Endpoint** : `GET /api/workflowjoboffer/history/validator/{validatorUserId}`  
- **Méthode** : `getHistoryForValidator`  
- **Description** : Permet au validateur de consulter l’historique des offres d’emploi qu’il a traitées dans le workflow, incluant les décisions et commentaires associés à chaque tâche.  
- **Paramètres** :  
  - `validatorUserId (Long)` : Identifiant de l’utilisateur validateur.  
- **Réponse** : Liste de `ValidatorTaskHistoryDTO` contenant les détails des tâches traitées par le validateur.

---

## 📝 7. Vérifier si une offre est en cours de validation

- **Endpoint** : `GET /api/workflowjoboffer/in-process/{offerId}`  
- **Méthode** : `isJobOfferInProcess`  
- **Description** : Permet de vérifier si une offre d’emploi est actuellement en cours de validation dans le workflow.  
- **Paramètres** :  
  - `offerId (Long)` : Identifiant de l’offre à vérifier.  
- **Réponse** : Retourne un objet JSON indiquant l’état de l’offre.


# ⚡ ApplicationController

Ce controller gère toutes les opérations liées aux candidatures (Applications) dans le système : création, consultation, mise à jour, filtrage, récupération de CV.

---

## 📝 1. Créer une candidature

- **Endpoint** : `POST /api/applications`  
- **Méthode** : `createApplication`  
- **Description** : Crée une nouvelle candidature.  
- **Paramètres** :  
  - `Application`

---

## 📝 2. Récupérer toutes les candidatures

- **Endpoint** : `GET /api/applications`  
- **Méthode** : `getAllApplications`  
- **Description** : Récupère la liste complète de toutes les candidatures.  
- **Réponse** : Liste de `Application`

---

## 📝 3. Mettre à jour le statut d’une candidature

- **Endpoint** : `PUT /api/applications/{id}/status`  
- **Méthode** : `updateStatus`  
- **Description** : Met à jour le statut d’une candidature (Acceptée, Rejetée, En attente, etc.).  
- **Paramètres** :  
  - `id (Long)` : Identifiant de la candidature.  
  - **Corps de la requête** : `{ "status": "Nouveau statut" }`

---

## 📝 4. Filtrer toutes les candidatures

- **Endpoint** : `POST /api/applications/filter`  
- **Méthode** : `filterAllApplications`  
- **Description** : Filtre les candidatures selon des critères fournis dans `FilterApplicationDTO` (ex. : statut, date, utilisateur).  
- **Paramètres** :  
  - `FilterApplicationDTO`  
- **Réponse** : Liste filtrée de `AllApplicationsResponseDTO`

---

## 📝 5. Afficher le CV d’une candidature

- **Endpoint** : `GET /api/applications/{id}/cv`  
- **Méthode** : `getCvFile`  
- **Description** : Permet de visualiser le CV associé à une candidature. Dans un navigateur comme Chrome, le PDF s’ouvre directement dans un nouvel onglet.  
- **Paramètres** :  
  - `id (Long)` : Identifiant de la candidature.  
- **Réponse** : Contenu PDF du CV en `byte[]`.

---

## 📝 6. Récupérer les détails du score d’une candidature

- **Endpoint** : `GET /api/applications/score-details/{applicationId}`  
- **Méthode** : `getScoreDetails`  
- **Description** : Fournit les détails des scores d’évaluation d’une candidature.  
- **Paramètres** :  
  - `applicationId (Long)` : Identifiant de la candidature.  
- **Réponse** : `ScoreDetailsDTO`


# ⚡ InterviewController

Ce controller gère toutes les opérations liées aux entretiens (Interview) : planification, consultation, mise à jour, filtrage.

---

## 📝 1. Planifier un entretien

- **Endpoint** : `POST /api/interviews/schedule`  
- **Méthode** : `scheduleInterview`  
- **Description** : Planifie un nouvel entretien pour une candidature donnée.  
- **Paramètres** :  
  - `ScheduleInterviewRequestDTO` (contenant la date, l’heure, l’identifiant de l’application, etc.)

---

## 📝 2. Récupérer un entretien par ID

- **Endpoint** : `GET /api/interviews/{id}`  
- **Méthode** : `getInterviewById`  
- **Description** : Récupère les informations détaillées d’un entretien spécifique.  
- **Paramètres** :  
  - `id (Long)` : Identifiant de l’entretien.  
- **Réponse** :  
  - `InterviewResponseDTO` contenant les détails de l’entretien.

---

## 📝 3. Mettre à jour un entretien

- **Endpoint** : `PUT /api/interviews/{id}`  
- **Méthode** : `updateInterview`  
- **Description** : Modifie les informations d’un entretien existant.  
- **Paramètres** :  
  - `id (Long)` : Identifiant de l’entretien.  
  - `ScheduleInterviewRequestDTO`

---

## 📝 4. Récupérer tous les entretiens

- **Endpoint** : `GET /api/interviews`  
- **Méthode** : `getAllInterviews`  
- **Description** : Retourne la liste de tous les entretiens planifiés.  
- **Réponse** :  
  - Liste de `InterviewDTO`.

---

## 📝 5. Récupérer les entretiens d’une candidature

- **Endpoint** : `GET /api/interviews/by-application/{applicationId}`  
- **Méthode** : `getInterviewsByApplicationId`  
- **Description** : Récupère tous les entretiens associés à une candidature spécifique.  
- **Paramètres** :  
  - `applicationId (Long)` : Identifiant de la candidature.  
- **Réponse** :  
  - Liste de `InterviewDTO`.

---

## 📝 6. Récupérer les détails de tous les entretiens

- **Endpoint** : `GET /api/interviews/details`  
- **Méthode** : `getAllInterviewDetails`  
- **Description** : Fournit les informations détaillées de tous les entretiens, incluant candidats, interviewers et statuts.  
- **Réponse** :  
  - Liste de `InterviewDetailsDTO`.

---

## 📝 7. Filtrer les entretiens

- **Endpoint** : `POST /api/interviews/filter`  
- **Méthode** : `filterInterviews`  
- **Description** : Permet de filtrer les entretiens selon des critères définis dans `InterviewFilterDTO`.  
- **Paramètres** :  
  - `InterviewFilterDTO`  
- **Réponse** :  
  - Liste filtrée de `InterviewDetailsDTO`.

---

## 📝 8. Mettre à jour le statut d’un entretien

- **Endpoint** : `PUT /api/interviews/{id}/status`  
- **Méthode** : `updateInterviewStatus`  
- **Description** : Permet de modifier le statut d’un entretien (ex. : planifié, annulé, terminé).  
- **Paramètres** :  
  - `id (Long)` : Identifiant de l’entretien.  
  - `UpdateInterviewStatusRequestDTO` (contenant le nouveau statut)



#  DiplomaTypeController

Ce controller gère les opérations liées aux types de diplômes dans le système : création, consultation, mise à jour et suppression.

---

## 📝 1. Créer un type de diplôme  

- **Endpoint** : `POST /api/diploma-type`  
- **Méthode** : `createDiploma`  
- **Description** : Crée un nouveau type de diplôme dans le système.  
- **Paramètres** :  
  - `DiplomaType` : Informations du type de diplôme.

---

## 📝 2. Récupérer tous les types de diplômes  

- **Endpoint** : `GET /api/diploma-type`  
- **Méthode** : `getAllDiplomas`  
- **Description** : Récupère la liste complète de tous les types de diplômes.  
- **Réponse** :  
  - Liste de `DiplomaType`.

---

## 📝 3. Récupérer un type de diplôme par ID  

- **Endpoint** : `GET /api/diploma-type/{id}`  
- **Méthode** : `getDiplomaById`  
- **Description** : Récupère les informations d’un type de diplôme spécifique à partir de son identifiant.  
- **Paramètres** :  
  - `id (Long)` : Identifiant du type de diplôme.  
- **Réponse** :  
  - Le `DiplomaType` correspondant.

---

## 📝 4. Mettre à jour un type de diplôme  

- **Endpoint** : `PUT /api/diploma-type/{id}`  
- **Méthode** : `updateDiploma`  
- **Description** : Met à jour les informations d’un type de diplôme existant.  
- **Paramètres** :  
  - `id (Long)` : Identifiant du type de diplôme.  
  - `DiplomaType` : Détails mis à jour.

---

## 📝 5. Supprimer un type de diplôme  

- **Endpoint** : `DELETE /api/diploma-type/{id}`  
- **Méthode** : `deleteDiploma`  
- **Description** : Supprime un type de diplôme spécifique du système.  
- **Paramètres** :  
  - `id (Long)` : Identifiant du type de diplôme à supprimer.



# ⚡ SiteController

Ce controller gère toutes les opérations liées aux sites de l’entreprise ou du système : consultation, création, mise à jour et suppression.

---

## 📝 1. Récupérer tous les sites

- **Endpoint** : `GET /api/site`  
- **Méthode** : `getAllSites`  
- **Description** : Retourne la liste de tous les sites enregistrés dans le système.  
- **Réponse** :  
  - Liste de `Site`

---

## 📝 2. Récupérer un site par ID

- **Endpoint** : `GET /api/site/{id}`  
- **Méthode** : `getSiteById`  
- **Description** : Récupère les informations d’un site spécifique à partir de son identifiant.  
- **Paramètres** :  
  - `id (Long)` : Identifiant du site.  
- **Réponse** :  
  - Le `Site` correspondant.

---

## 📝 3. Créer un site

- **Endpoint** : `POST /api/site`  
- **Méthode** : `createSite`  
- **Description** : Crée un nouveau site dans le système.  
- **Paramètres** :  
  - `Site` : Nom du site.

---

## 📝 4. Mettre à jour un site

- **Endpoint** : `PUT /api/site/{id}`  
- **Méthode** : `updateSite`  
- **Description** : Met à jour les informations d’un site existant.  
- **Paramètres** :  
  - `id (Long)` : Identifiant du site.  
  - `Site` : Détails mis à jour.

---

## 📝 5. Supprimer un site

- **Endpoint** : `DELETE /api/site/{id}`  
- **Méthode** : `deleteSite`  
- **Description** : Supprime un site spécifique du système.  
- **Paramètres** :  
  - `id (Long)` : Identifiant du site à supprimer.


# ⚡ RoomController

Ce controller gère les opérations liées aux salles (Rooms) : consultation, création, mise à jour et suppression, ainsi que la récupération des salles par site.

---

## 📝 1. Récupérer toutes les salles

- **Endpoint** : `GET /api/room`  
- **Méthode** : `getAllRooms`  
- **Description** : Retourne la liste de toutes les salles enregistrées dans le système.  
- **Réponse** :  
  - Liste de `Room`.

---

## 📝 2. Récupérer les salles d’un site spécifique

- **Endpoint** : `GET /api/room/site/{siteId}`  
- **Méthode** : `getRoomsBySite`  
- **Description** : Récupère toutes les salles associées à un site particulier.  
- **Paramètres** :  
  - `siteId (Long)` : Identifiant du site.  
- **Réponse** :  
  - Liste de `Room`.

---

## 📝 3. Créer une salle pour un site

- **Endpoint** : `POST /api/room/site/{siteId}`  
- **Méthode** : `createRoom`  
- **Description** : Crée une nouvelle salle pour un site spécifique.  
- **Paramètres** :  
  - `siteId (Long)` : Identifiant du site auquel la salle est rattachée.  
  - `Room` : Nom de la salle.

---

## 📝 4. Mettre à jour une salle

- **Endpoint** : `PUT /api/room/{id}`  
- **Méthode** : `updateRoom`  
- **Description** : Met à jour les informations d’une salle existante.  
- **Paramètres** :  
  - `id (Long)` : Identifiant de la salle.  

---

## 📝 5. Supprimer une salle

- **Endpoint** : `DELETE /api/room/{id}`  
- **Méthode** : `deleteRoom`  
- **Description** : Supprime une salle spécifique du système.  
- **Paramètres** :  
  - `id (Long)` : Identifiant de la salle à supprimer.




----------------------------------------------------------------------------------

# 🛠️ Build & Exécution

## 1) Build Maven
```bash
mvn clean package -DskipTests
```

## 2) Exécution locale
```bash
java -jar target/joboffer-module-0.0.1-SNAPSHOT.jar
```
Application disponible sur : `http://localhost:8093`

---

# 🐳 Dockerisation

## 1) Construction de l’image
```bash
docker build -t joboffer-service .
```

## 2) Exécution avec Docker
```bash
docker run -p 8093:8093 joboffer-service
```

## 3) Avec docker-compose
```bash
docker compose up -d
```

---

# 🔐 Variables d’environnement et chemins de dossiers

## Variables d’environnement (exemples)
| Variable | Description | Exemple |
|---|---|---|
| `SPRING_DATASOURCE_USERNAME` | Nom d’utilisateur de la base de données | `postgres` |
| `SPRING_DATASOURCE_PASSWORD` | Mot de passe de la base de données | `mustapha` |
| `EUREKA_CLIENT_SERVICEURL_DEFAULTZONE` | URL du serveur Eureka | `http://eureka-server:8761/eureka/` |


## Dossiers de surveillance (watch folders)

> Les dossiers `watch` se trouvent au même niveau que le `pom.xml` du projet.

- `watch.folder1` : `watch/spontaneousApplication`  
- `watch.folder2` : `watch/jobOfferApplication`

---


##  Remarques

-   Vérifier après chaque modification que le build du projet se fait
    correctement.

------------------------------------------------------------------------


