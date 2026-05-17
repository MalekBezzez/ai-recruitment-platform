# 👥 Microservice Employee — README (FR)

## 🚀 Aperçu
Le microservice **Employee** centralise la gestion des employés et de toutes les entités liées au capital humain.       
Il fournit des fonctionnalités pour :  
- La gestion des **employés** (CRUD complet)  
- L’administration des **départements, contrats, diplômes, assurances et compétences**  
- Le suivi des **questionnaires et réponses** des employés  
- La génération de **recommandations de carrière et de formation** via IA/NLP  
- La gestion des **notifications** et **photos de profil**  
- L’intégration avec **Eureka** et **PostgreSQL**

---

## ⚙️ Technologies utilisées
- **Java 17**
- **Spring Boot 3.x**
- **Spring Data JPA (PostgreSQL)**
- **Spring Security**
- **Spring Cloud Netflix Eureka Client**
- **Hibernate Validator**
- **Docker & Docker Compose**
- **Maven**

---

## 📂 Structure (contrôleurs principaux)
```
src/main/java/com/example/employeemodule/controller/
 ├── EmployeController.java                             # CRUD employés
 ├── DepartmentController.java                          # Départements
 ├── ContractTypeController.java                        # Types de contrats
 ├── DiplomaController.java                             # Diplômes
 ├── InsuranceController.java                           # Assurances
 ├── EmployeeSkillController.java                       # Compétences des employés
 ├── ChannelController.java                             # Canaux de communication
 ├── CareerPathingRecommendationPlanController.java     # Recos carrière
 ├── TrainingRecommendationPlanController.java          # Plans de formation
 ├── QuestionController.java                            # Questions
 ├── QuestionnaireController.java                       # Questionnaires
 ├── AnswerController.java                              # Réponses
 ├── SurveyResponseController.java                      # Résultats de sondages
 ├── AnalysisResultController.java                      # Résultats IA/NLP
 ├── NLPController.java                                 # API d’intégration NLP
 ├── PredictionController.java                          # Prédictions ML
 ├── NotificationController.java                        # Notifications (SSE)
 ├── PhotoController.java                               # Photos de profil
 └── PasswordController.java                            # Mots de passe employés
```

---

# 📚 Endpoints principaux

## 🔹 Employés
- **GET** `/employee/all-employees` → Liste des employés  
- **POST** `/employee/employees` → Créer un employé  
- **PUT** `/employee/update/{id}` → Modifier un employé  
- **DELETE** `/employee/{id}` → Supprimer un employé  
- **GET** `/employee/{id}` → Récupérer un employé par ID  
- **GET** `/employee/managers` → Liste des managers  
- **GET** `/employee/by-manager/{managerId}` → Employés par manager  
- **GET** `/employee/interviewers` → Liste des interviewers  
- **POST** `/employee/{id}/reset-password` → Envoyer l’email de réinitialisation

---

## 🔹 Entités RH
- **GET** `/departments` → Liste des départements  
- **GET** `/contract-types` → Liste des types de contrat  
- **GET** `/diplomas` → Liste des diplômes  
- **GET** `/insurances` → Liste des assurances  
- **GET** `/employee-skills/{id}` → Compétences d’un employé  

---

## 🔹 Career Pathing Recommendation Plan API
- **POST** `/api/career-pathing-plans` → Créer un plan de carrière  
- **GET** `/api/career-pathing-plans/{id}` → Récupérer un plan de carrière par ID  
- **GET** `/api/career-pathing-plans` → Récupérer tous les plans de carrière  
- **PUT** `/api/career-pathing-plans/{id}` → Mettre à jour un plan de carrière  
- **DELETE** `/api/career-pathing-plans/{id}` → Supprimer un plan de carrière
- **GET** `/api/career-pathing-plans/summary` → Récapitulatif des plans de carrière déjà lancés  
- **GET** `/api/career-pathing-plans/plan/{planId}/results` → Résultats d’un plan de carrière

---

## 🔹 Department API
- **GET** `/departments` → Tous les départements (DTO)  
- **GET** `/departments/{id}` → Département par ID  
- **POST** `/departments` → Créer un département  
- **PUT** `/departments/{id}` → Mettre à jour un département  
- **DELETE** `/departments/{id}` → Supprimer un département  

---

## 🔹 Training Recommendation Plan API
- **GET** `/api/training-recommendation-plans/summary` → Récapitulatif des plans déjà lancés
- **POST** `/api/training-recommendation-plans` → Créer un plan  
- **GET** `/api/training-recommendation-plans/{id}` → Récupérer un plan par ID  
- **GET** `/api/training-recommendation-plans` → Récupérer tous les plans  
- **PUT** `/api/training-recommendation-plans/{id}` → Mettre à jour un plan  
- **DELETE** `/api/training-recommendation-plans/{id}` → Supprimer un plan  
- **GET** `/api/training-recommendation-plans/{planId}/self-trainings` → Auto-formations d’un plan  
- **GET** `/api/training-recommendation-plans/{planId}/coachings` → Coachings d’un plan  
- **GET** `/api/training-recommendation-plans/{planId}/structured-trainings` → Formations structurées d’un plan

---

## 🔹 Diploma API
- **GET** `/diplomas` → Tous les diplômes  
- **GET** `/diplomas/{id}` → Diplôme par ID  
- **GET** `/diplomas/employee/{employeId}` → Diplômes d’un employé  
- **POST** `/diplomas/employee/{employeId}` → Ajouter un diplôme à un employé  
- **PUT** `/diplomas/{id}` → Mettre à jour un diplôme  
- **DELETE** `/diplomas/{id}` → Supprimer un diplôme  

---

## 🔹 Employee Skill API
- **POST** `/api/employee-skill/process` → Analyser les compétences et envoyer une **recommendation de formation** (RabbitMQ)  
- **POST** `/api/employee-skill/career-pathing/process` → envoyer un **une recommandation de parcours carrière (career pathing)** (RabbitMQ)

---

## 🔹 Insurance API
- **POST** `/insurances` → Créer une assurance  
- **GET** `/insurances` → Lister les assurances  
- **GET** `/insurances/{id}` → Assurance par ID  
- **PUT** `/insurances/{id}` → Mettre à jour une assurance  
- **GET** `/insurances/valid` → Assurances valides uniquement  
- **DELETE** `/insurances/{id}` → Supprimer une assurance

---

## 🔹 Contract Type API
- **POST** `/contract-types` → Créer un type de contrat  
- **GET** `/contract-types` → Tous les types (DTO)  
- **GET** `/contract-types/{id}` → Type par ID (entité)  
- **GET** `/contract-types/dto/{id}` → Type par ID (DTO)  
- **PUT** `/contract-types/{id}` → Mettre à jour un type  
- **DELETE** `/contract-types/{id}` → Supprimer un type  

---

## 🔹 Questionnaires & Sondages
- **POST** `/questionnaires` → Ajouter un questionnaire  
- **GET** `/questionnaires/{id}` → Consulter un questionnaire  
- **POST** `/answers` → Enregistrer des réponses  
- **POST** `/{questionnaireId}/employee/{employeId}` → Consulter les réponses par questionnaire & employé  
- **POST** `/answers/with-answers/{questionnaireId}` → Consulter les réponses par question  
- **GET** `/answers/exists` → Savoir si l’employé a répondu  
- **GET** `/answers/questionnaire/{questionnaireId}/count` → Nombre de répondants  
- **POST** `/survey-responses` → Sauvegarder un sondage

---

## 🔹 Recommandations & IA
- **POST** `/career-pathing/recommendations` → Générer un plan de carrière  
- **POST** `/training/recommendations` → Générer un plan de formation  
- **POST** `/analysis/results` → Sauvegarder des résultats NLP  
- **POST** `/nlp/analyze` → Analyse NLP (texte, émotions, etc.)  
- **POST** `/predictions` → Prédictions via modèle ML

---

## 🔹 NLP API (analyse des questions)
- **POST** `/nlp/analyze` → Envoyer les réponses pour analyse (via RabbitMQ)  
- **POST** `/nlp/save-results` → Sauvegarder les résultats NLP

---

## 🔹 Notification API
- **POST** `/notifications/{userId}` → Créer une notification  
- **PUT** `/notifications/read/{id}` → Marquer comme lue  
- **GET** `/notifications/{userId}` → Liste des notifications récentes  
- **POST** `/notifications/external/push?userId={userId}` → Réception externe + push SSE  
- **GET** `/notifications/{userId}/unread/count` → Compter les non lues  
- **GET** `/notifications/events?userId={id}` → Ouvrir la connexion SSE (temps réel)  
- **POST** `/notifications/send-test?userId={id}` → Envoyer une notification test  
- **POST** `/notifications/push/{userId}` → Pousser une notification SSE à un utilisateur

---

## 🔹 Analyse des discussions (Prediction API)
- **POST** `/prediction/save-result` → Sauvegarder un résultat de prédiction  
- **GET** `/prediction/save-result/discussion-results/by-idtest/{idTest}` → Prédictions par `idTest`  
- **POST** `/prediction` → Envoyer des messages pour prédiction (RabbitMQ)  
- **GET** `/prediction/results/{predictionResultId}` → Résultats (sentiments, émotions, topics) par ID  
- **GET** `/prediction/save-result/discussion-results/grouped` → Prédictions groupées par `idTest`  
- **GET** `/prediction/results/by-idtest/{idTest}` → Résultats (graphiques) par `idTest`

---

## 🔹 Survey Response API
- **POST** `/survey-responses` → Sauvegarder une réponse de sondage  
- **GET** `/survey-responses` → Récupérer toutes les réponses

---

## 🔹 Autres
- **POST** `/photos` → Upload d’une photo employé

---

# 🛠️ Build & Exécution

## 1) Build Maven
```bash
mvn clean package -DskipTests
```

## 2) Exécution locale
```bash
java -jar target/employee-module-0.0.1-SNAPSHOT.jar
```
Application disponible sur : `http://localhost:8081`

---

# 🐳 Dockerisation

## 1) Construction de l’image
```bash
docker build -t employee-service .
```

## 2) Exécution avec Docker
```bash
docker run -p 8081:8081 employee-service
```

## 3) Avec docker-compose
```bash
docker compose up -d
```

---

# 🔐 Variables d’environnement (exemples)
| Variable | Description | Exemple |
|---|---|---|
| `SPRING_DATASOURCE_URL` | Connexion DB | `jdbc:postgresql://employee-db:5432/employee_db` |
| `SPRING_DATASOURCE_USERNAME` | Utilisateur DB | `postgres` |
| `SPRING_DATASOURCE_PASSWORD` | Mot de passe DB | `mustapha` |
| `EUREKA_CLIENT_SERVICEURL_DEFAULTZONE` | URL Eureka | `http://eureka-server:8761/eureka/` |

---

## 📜 Remarques
- Les chemins exacts peuvent varier selon l’implémentation de vos contrôleurs/DTO.  
- Protégez les endpoints sensibles via **JWT/roles**.  
- Pour SSE (notifications), gardez la connexion ouverte côté Front et gérez les timeouts.
