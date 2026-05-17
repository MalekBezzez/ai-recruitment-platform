# Documentation du Frontend

Ce projet utilise **Fuse React v8.3** comme base pour le développement du frontend.

Cette documentation décrit la structure des fichiers et leur rôle pour
faciliter les modifications et ajouts dans le projet frontend.


##  Table des matières

- [Structure principale]
- [Modifier le menu]
- [Ajouter des routes]
- [Interfaces / Pages]
- [Exemple d'ajout d'une nouvelle page]
- [Dossiers existants par thématique]
   - [1. Gestion des diplômes, contrats, départements, sites et salles]
  - [2. Gestion des offres d’emploi et candidatures]
  - [3. Gestion des interviews]
  - [4. Career Pathing & Training Recommendations]

- [5. Authentification & Accueil]
- [6. Employés & Comptes]
- [7. Assurances & Diplômes (dossiers individuels)]
- [8. Gestion des Congés (RH & Employé)]
- [9. Projets & Tâches]
- [10. Clients & Enquêtes (Surveys & Questionnaires)]
- [12. Paie (Bulletins)]
- [13. Timesheet & Imputations]
- [14. Applications]
- [15. Analytique & NLP en temps réel]



## 📂 Structure principale

```
src
└── app
    ├── configs
    │   ├── navigationConfig.js   # Configuration du menu
    │   └── routesConfig.js       # Configuration des routes
    └── main
        ├── page1/                # Interface/Page 1
        │   ├── Page1.js
        │   └── Page1Config.js    # Configuration de la route
        ├── page2/                # Interface/Page 2
        │   ├── Page2.js
        │   └── Page2Config.js
        └── ...                   # Autres pages




### 1. Modifier le menu

Le fichier responsable de la configuration du menu se trouve ici :

    src/app/configs/navigationConfig.js

Vous pouvez modifier ce fichier pour ajouter, supprimer ou réorganiser
les éléments du menu.

------------------------------------------------------------------------

### 2. Ajouter des routes

Pour ajouter une nouvelle route, il faut l'importer et l'ajouter dans :

    src/app/configs/routesConfig.js

------------------------------------------------------------------------

### 3. Interfaces / Pages

Les interfaces (pages) se trouvent dans :

    src/app/main

Chaque dossier à l'intérieur de `src/app/main` représente une **page
(interface)**.\

 - **Deux fichiers principaux** dans chaque dossier :
    - Un fichier pour l'interface (composant React).
    - Un fichier de configuration de la route correspondant, **qui se termine par `****Config.js`.


## Exemple d'ajout d'une nouvelle page

1. Créer un dossier dans `src/app/main` pour la nouvelle page.
2. Ajouter :
   - Le composant React pour l'interface.
   - Le fichier de configuration de la route (`NomDeLaPageConfig.js`).
3. Importer ce fichier de configuration dans :
   - `routesConfig.js` pour l'activer dans l'application.
   - Facultativement dans `navigationConfig.js` si la page doit être accessible via le menu.


------------------------------------------------------------------------

## Les dossier existants par thematique : 

## 1. Gestion des diplômes, contrats, départements, sites et salles

### `src\app\main\add-diploma-type-offer`
Cette section permet **d’ajouter un nouveau type de diplôme** dans le système.  
- **Champs disponibles :**  
  - **Nom du diplôme** (ex. Master, Bachelor, Engineer)  
  - **Spécialité** (ex. Electronics, Software)  

### `src\app\main\diploma-type-offer`
Cette page permet **d’afficher la liste des types de diplômes existants** dans le système.  
- **Fonctionnalités principales :**  
  - Visualiser tous les types de diplômes enregistrés  
  - Accéder aux détails ou options d’édition/suppression si disponibles  

### `src\app\main\AddContractType`
Cette page permet **d’ajouter un nouveau type de contrat (contract type)** dans le système.  
- **Champs disponibles :**  
  - **Nom du type de contrat**  

### `src\app\main\ContractTypeList`
Cette page permet **d’afficher la liste des types de contrats existants** dans le système.  
- **Fonctionnalités principales :**  
  - Visualiser tous les types de contrats enregistrés  
  - Accéder aux détails ou options d’édition/suppression si disponibles  

### `src\app\main\AddDepartment`
Cette page permet **d’ajouter un nouveau département** dans le système.  
- **Champs disponibles :**  
  - **Nom du département**  

### `src\app\main\DepartmentList`
Cette page permet **d’afficher la liste des départements existants** dans le système.  
- **Fonctionnalités principales :**  
  - Visualiser tous les départements enregistrés  
  - Accéder aux détails ou options d’édition/suppression si disponibles  

### `src\app\main\add-site`
Cette page permet **d’ajouter un nouveau site** dans le système.  
- **Champs disponibles :**  
  - **Nom du site**  

### `src\app\main\site-list`
Cette page permet **d’afficher la liste des sites existants** dans le système.  
- **Fonctionnalités principales :**  
  - Visualiser tous les sites enregistrés  
  - Accéder aux détails ou options d’édition/suppression si disponibles  

### `src\app\main\add-room`
Cette page permet **d’ajouter une nouvelle salle (room)** dans le système.  
- **Champs disponibles :**  
  - **Nom de la salle**  
  - **Site associé** : sélectionner parmi les options disponibles  

### `src\app\main\room-list`
Cette page permet **d’afficher la liste des salles (rooms) existantes** dans le système.  
- **Fonctionnalités principales :**  
  - Visualiser tous les rooms enregistrés  
  - Accéder aux détails ou options d’édition/suppression si disponibles  

### `src\app\main\add-work-mode`
Cette page permet **d’ajouter un nouveau type de mode de travail (work mode)** dans le système.  
- **Champs disponibles :**  
  - **Nom du mode de travail**  

### `src\app\main\work-mode`
Cette page permet **d’afficher la liste des work modes existants** dans le système.  

---

## 2. Gestion des offres d’emploi et candidatures

### `src\app\main\add-job`
Cette section permet **d’ajouter une nouvelle offre d’emploi** ou **de modifier une offre existante** dans le système.  
- **Fonctionnalités principales :**  
  - Création d’une nouvelle offre d’emploi  
  - Modification d’une offre existante  
- **Champs du formulaire :**  
  - Tous les champs sont **obligatoires** sauf le champ **Sections** qui est optionnel.  

### `src\app\main\my-offers`
Cette page permet **d’afficher la liste des offres créées par l’utilisateur connecté** dans le système.  
- **Fonctionnalités principales :**  
  - Visualiser toutes les offres d’emploi créées par l’utilisateur  
  - Accéder à la page de navigation ou aux détails d’une offre spécifique  

### `src\app\main\my-offers-process-history`
Cette page permet **de consulter l’historique des offres traitées par le validateur**.  
- **Fonctionnalités principales :**  
  - Visualiser les offres d’emploi déjà traitées  
  - Consulter les décisions et les commentaires laissés par le validateur  

### `src\app\main\my-task`
Cette page permet **de visualiser les offres d’emploi à valider** pour l’utilisateur connecté.  
- **Fonctionnalités principales :**  
  - Consulter la liste des offres d’emploi en attente de validation  
  - Fournir une **décision** (approuver ou rejeter) et un **commentaire** pour chaque offre  

### `src\app\main\my-task-history`
Cette page permet **de consulter l’historique des tâches de validation** pour l’utilisateur connecté.  
- **Fonctionnalités principales :**  
  - Visualiser les décisions et commentaires laissés pour chaque offre d’emploi traitée  



### `src\app\main\offer-details`
Cette page permet **d’afficher les détails d’une offre d’emploi spécifique**.  
- **Fonctionnalités principales :**  
  - Visualiser toutes les informations détaillées d’une offre  
  - Accéder aux données nécessaires pour consultation ou édition  

### `src\app\main\offers-process`
Cette page permet **de consulter l’état de validation d’une offre d’emploi**.  
- **Fonctionnalités principales :**  
  - Visualiser à quelle étape du processus de validation se trouve l’offre  
  - Suivre l’avancement du workflow pour chaque offre  

---

## 3. Gestion des interviews

### `src\app\main\interviews-list`
Cette page permet **d’afficher la liste de tous les entretiens** dans le système.  
- **Fonctionnalités principales :**  
  - Visualiser tous les entretiens programmés  
  - Modifier le **statut** d’un entretien  
  - Replanifier un entretien si nécessaire  

### `src\app\main\schedule-interview`
Cette page permet **de planifier ou replanifier un entretien** pour un candidat.  
- **Fonctionnalités principales :**  
  - Remplir le formulaire de planification d’entretien  
  - Modifier la date, l’heure ou les détails d’un entretien déjà programmé  

---

## 4. Career Pathing & Training Recommendations

### `src\app\main\career-pathing`
Cette page permet **de sélectionner les employés à intégrer dans un career pathing** et **de démarrer le processus de recommandation du career pathing**.  
- **Fonctionnalités principales :**  
  - Sélectionner les employés pour un career pathing  
  - Démarrer le processus de recommandation de career pathing  

### `src\app\main\career-pathing-results`
Cette page affiche **les résultats d’un career pathing** spécifique.  
- **Fonctionnalités principales :**  
  - Visualiser les résultats détaillés d’un career pathing lancé  
  - Accéder aux informations sur les recommandations de formation ou parcours proposés  

### `src\app\main\career-recommendation-summary`
Cette page affiche **la liste des career pathings lancés** et donne une idée des career pathings déjà initiés.  
- **Fonctionnalités principales :**  
  - Visualiser les career pathings déjà lancés avec leurs informations principales  
  - Naviguer vers la page de **résultats d’un career pathing**  
  - Accéder à l’interface de **lancement d’un nouveau career pathing** via un bouton dédié  
 

### `src\app\main\training-recommendation-summary`
Cette page permet **d’afficher la liste des training recommendations lancées** dans le système.  
- **Fonctionnalités principales :**  
  - Visualiser toutes les recommendations de formation déjà lancées  
  - Voir les détails du lancement, telles que l’heure, l’utilisateur qui a lancé 

### `src\app\main\decision-joboffer`
Cette page permet **de prendre des décisions sur une offre d’emploi** ou **de générer des recommandations de formation** pour un employé ou une candidature.  
- **Fonctionnalités principales :**  
  - Sélectionner les employés ou candidatures concernées  
  - Démarrer le processus de recommandation de formation  

### `src\app\main\training-rec-tabs-page`
Cette page permet **de naviguer entre les différentes sections d’un résultat de training recommendation**.  
- **Fonctionnalités principales :**  
  - Afficher les onglets pour les différentes sections : **Structured Training**, **Self Training**, **Coaching**  

### `src\app\main\structured-training-view`
Cette page permet **de visualiser un structured-training** pour une recommendation donnée.  

### `src\app\main\self-training-view`
Cette page permet **de visualiser un self-training** pour une recommendation donnée.  

### `src\app\main\coaching-view`
Cette page permet de **visualiser les coachings** pour une recommendation de formation.  

---




##  Remarques

-   Garder une cohérence dans la nomenclature des fichiers.\
-   Vérifier après chaque modification que le build du projet se fait
    correctement.

------------------------------------------------------------------------


## 5. Authentification & Accueil

### `src\app\main\sign-in` / `sign-up` / `sign-out`
Interfaces d’**authentification** (connexion, inscription, déconnexion).
- **Fonctionnalités principales :**
  - Connexion via email/mot de passe
  - Création de compte (selon droits)
  - Déconnexion et nettoyage du contexte utilisateur

### `src\app\main\change-password` / `reset-password` / `resetpassword`
Gestion du **changement** et de la **réinitialisation** de mot de passe (2 écrans).
- **Fonctionnalités principales :**
  - Changement de mot de passe utilisateur connecté
  - Réinitialisation via token / email (flux mot de passe oublié)

### `src\app\main\Home`
Page d’**accueil** et de **bienvenue** après connexion (`HomeWelcome`).
- **Objectif :** présenter un point d’entrée simple vers les principaux modules.

### `src\app\main\example`
Page **exemple / dashboard** utilisée comme squelette de démarrage et de test.

---

## 6. Employés & Comptes

### `src\app\main\add-account`
Création d’un **compte** (utilisateur) avec rôles et informations de base.

### `src\app\main\Employees-list`
**Liste des employés / comptes** avec recherche, pagination et actions (voir, éditer, supprimer…).

### `src\app\main\Employee-profile`
**Profil** d’un employé (informations détaillées, pièces jointes, etc.).

### `src\app\main\Employee-update`
**Mise à jour** des informations d’un employé.

### `src\app\main\EmployeeByManager`
Vue **manager** listant les employés rattachés au responsable connecté.

### `src\app\main\uploadphoto`
Upload de **photo de profil** pour un employé.

---

## 7. Assurances & Diplômes (dossiers individuels)

> **Différent** des *types* de diplôme/contrat déjà référencés dans la section 1.
Ces écrans gèrent les **dossiers d’assurance** et **diplômes** au niveau *employé*.

### `src\app\main\add-insurrance`
Création d’un **dossier d’assurance** pour un employé.

### `src\app\main\insurrance-list`
**Liste** des assurances existantes (filtrage, recherche).

### `src\app\main\insurrance-profile`
**Détails**  d’assurance.

### `src\app\main\Insurrance-update`
**Mise à jour**  d’assurance.

### `src\app\main\DiplomaManagement`
Gestion des **diplômes individuels** : ajout, édition, suppression et visualisation.

---

## 8. Gestion des Congés (RH & Employé)

### `src\app\main\liste-des-demande-conges`
Vue **manager / standard** des **demandes de congés** (liste + actions).

### `src\app\main\liste-des-demande-conges rh`
Vue **RH** des **demandes de congés** (filtrage global, décisions, historiques).

### `src\app\main\LeaveRequestDetails` / `LeaveRequestDetail`
Détails d’une **demande de congé** (versions selon rôle ou contexte).

### `src\app\main\addLeaveRequests`
Création d’une **nouvelle demande de congé** par l’employé.

### `src\app\main\LeaveRequestEmployeeList` / `LeaveRequestListEmployeePage`
Vues **employé** pour consulter **ses demandes** et leurs **statuts**.

### `src\app\main\DecisionProcessing` / `DecisionProcessing copy`
**Traitement** d’une demande (validation, refus, commentaire) côté **manager** / **RH**.

### `src\app\main\AddLeaveType` / `leave-type-list`
Gestion des **types de congés** (création, édition, liste).

### `src\app\main\acceptedleave`
Liste des **congés validés RH** (suivi administratif).

### `src\app\main\historicLeaveManager`
**Historique** des demandes traitées par un **manager**.

### `src\app\main\HistoryWorkflowLeaveList`
Historique **workflow** (traçabilité des étapes et décisions).

---

## 9. Projets & Tâches

### `src\app\main\AddProject` / `ProjectList` / `EditProject` / `ProjectDetail`
Gestion des **projets** : création, liste, édition et vue détaillée (membres, phases, KPIs…).

### `src\app\main\AddPhase` / `PhaseListByProject` / `EditPhase`
Gestion des **phases** d’un projet (par projet, édition, avancement).

### `src\app\main\AddTask` / `TaskListByPhase` / `TaskDetail` / `EditTask`
Gestion des **tâches** (création, liste par phase, détails, édition).

### `src\app\main\AddSubtask` / `TaskSubtask`
Gestion des **sous‑tâches** rattachées à une tâche.

---

---

## 10. Clients & Enquêtes (Surveys & Questionnaires)

### `src\app\main\AddClient` / `ClientList` / `ClientProfile` / `EditClient`
Gestion des **clients** : ajout, liste, fiche client et édition.

### `src\app\main\CreateQuestionnaire` / `QuestionnaireList`
**Création** de **questionnaires** (thèmes, questions) et **liste** des questionnaires.

### `src\app\main\AnswerQuestionnaire`
Interface de **réponse** à un questionnaire (employé ou répondant).

### `src\app\main\AnswersByQuestionnaire`
Vue d’**agrégation** des **réponses** pour un questionnaire donné.

### `src\app\main\SurveyManagementPage` / `SurveyList`
Gestion des **campagnes d’enquête** (ciblage, envoi, suivi) et **liste** des surveys.

### `src\app\main\AnalyseResults` / `SatisfactionAnalysis`
Analyses **statistiques** et **NLP** des résultats (scores, sentiments, catégories).

### `src\app\main\RespondentList` / `EmployeeAnswers`
Listes des **répondants** et **réponses par employé**.

### `src\app\main\ChannelManagerPage` / `EmployeeAndChannelList`
Gestion des **canaux de diffusion** (email, Slack, etc.) et **mapping Employé ↔ Canal**.

---

## 12. Paie (Bulletins)

### `src\app\main\PayslipList` / `PayslipDetail`
Consultation des **bulletins de paie** (liste filtrable) et **détails** d’un bulletin.

---

## 13. Timesheet & Imputations

### `src\app\main\TimeSheet`
Saisie et suivi du **temps** (hebdomadaire/quotidien).

### `src\app\main\ImputationDetail`
**Détails** d’une imputation (période, tâche, durée, corrections).


---

## 14. Applications

### `src\app\main\applications-list`
Liste globale des **applications / modules** accessibles (vue de navigation rapide).

---

## 15. Analytique & NLP en temps réel

### `src\app\main\PredictionResultList`
**Résultats de prédiction** (NLP ) stockés et consultables.

### `src\app\main\AnalysisStream`
**Flux temps réel** d’analyse (streaming) pour visualiser les **résultats** au fil de l’eau.

### `src\app\main\MessageAnalyse`
Analyse **qualitative** des messages (sentiment, émotions, thèmes…).

---



> Les référentiels **Site**, **Room** et **Work Mode** sont décrits dans la section 1 (Paramétrage).
