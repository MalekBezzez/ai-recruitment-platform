# 👥 Microservice Resume — README (FR)


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

1. ResumeController




# ⚡ ResumeController

Ce controller gère toutes les opérations liées aux résumés/CV : création, lecture, mise à jour, suppression et récupération des informations détaillées.

---

## 1. Créer un résumé

- **Endpoint** : `POST /api/resumes`  
- **Méthode** : `createResume`  
- **Description** : Ajoute un nouveau résumé dans le système..  
- **Paramètres** : `Resume`

---

## 2. Récupérer un résumé par ID

- **Endpoint** : `GET /api/resumes/{id}`  
- **Méthode** : `getResume`  
- **Description** : Récupère les informations détaillées d’un résumé spécifique.
- **Paramètres** :  
  - `id (Long)` : identifiant du résumé.  
- **Réponse** : Objet `Resume`

---

## 3. Récupérer tous les résumés

- **Endpoint** : `GET /api/resumes`  
- **Méthode** : `getAllResume`  
- **Description** : Retourne la liste complète de tous les résumés enregistrés dans le système.  
- **Réponse** : Liste de  `Resume`

---



## 4. Supprimer un résumé

- **Endpoint** : `DELETE /api/resumes/{id}`  
- **Méthode** : `deleteResume`  
- **Description** : Supprime un résumé spécifique à partir de son identifiant..  
- **Paramètres** :  
  - `id (Long)` : identifiant du résumé..  




----------------------------------------------------------------------------------

# 🛠️ Build & Exécution

## 1) Build Maven
```bash
mvn clean package -DskipTests
```

## 2) Exécution locale
```bash
java -jar target/resume-module-0.0.1-SNAPSHOT.jar
```
Application disponible sur : `http://localhost:8093`

---

# 🐳 Dockerisation

## 1) Construction de l’image
```bash
docker build -t resume-service .
```

## 2) Exécution avec Docker
```bash
docker run -p 8091:8091 resume-service
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

---


##  Remarques

-   Vérifier après chaque modification que le build du projet se fait
    correctement.

------------------------------------------------------------------------


