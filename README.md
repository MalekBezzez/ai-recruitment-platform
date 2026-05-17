# Guide de Déploiement

## 1️⃣ Cloner le projet

Téléchargez le projet depuis le dépôt GitHub :

```bash
git clone https://github.com/alworkforce-ai/HR-Platform
cd HR-Platform
git checkout microservice-dockerise
git pull origin microservice-dockerise
```

Vous pouvez également télécharger l’archive ZIP directement depuis ce lien :
[HR-Platform microservice-dockerise](https://github.com/alworkforce-ai/HR-Platform/tree/microservice-dockerise)

---

## 2️⃣ Installer les Requirements

### Module Cv-Parsing&Matching (IA)

- Le modèle nécessite **Poppler-24.08.0** et **Tesseract-OCR**.
- Ces dossiers ne sont pas inclus dans le dépôt Git.
- Après téléchargement, **décompressez le ZIP fourni** et copiez les dossiers `Poppler-24.08.0` et `Tesseract-OCR` dans le dossier `Cv-Parsing&Matching (IA)`.

**Lien pour télécharger le ZIP :**
[Poppler et Tesseract](https://drive.google.com/file/d/1UJ3WlgR97TD9H8y7snoeOOeh4zz9aUf5/view?usp=drive_link)

---

### Module survey-analyse

Téléchargez le modèle **XLM-R** :

- Placez le fichier `model.safetensors` dans `/xlm_roberta_final/` à la racine du module.
- Si le fichier est un `.zip`, **décompressez**-le dans ce dossier.
- Renommez le fichier en `model.safetensors` si nécessaire.

**Lien Drive :**
[XLM-R model](https://drive.google.com/drive/folders/1JD5-7IZ3QMFu0tBHEa6pwtkI2OtmG7xt?usp=sharing)

La structure finale attendue :

```
xlm_roberta_final/
├─ config.json
├─ tokenizer.json / vocab.*
└─ model.safetensors
```

---

### Module message-model

Téléchargez les fichiers de poids et placez-les dans `/models/` :

- `model_sentiment.pt`
- `model_emotion.pt`
- `model_topic.pt`

**Lien Drive :**
[Poids secondaires](https://drive.google.com/file/d/1YGevZRpB4EilJhStNwXTFR5i3jEo6JLl/view?usp=sharing)

Structure finale attendue :

```
models/
├─ model_sentiment.pt
├─ model_emotion.pt
├─ model_topic.pt
├─ sentiment_encoder.joblib
├─ emotion_encoder.joblib
└─ topic_encoder.joblib
```

---

## 3️⃣ Installer Docker Desktop

1. Téléchargez Docker Desktop : <https://www.docker.com/products/docker-desktop>
2. Installez-le selon votre OS (Windows, macOS, Linux)
3. Démarrez Docker Desktop et vérifiez son bon fonctionnement

---

## 4️⃣ Initialiser la base de données PostgreSQL

### 4.1 Lancer PostgreSQL

```bash
docker-compose up -d postgresql
```

- Port hôte : `5433`
- Port conteneur : `5432`
- Base : `looyas-pfe`
- Utilisateur : `postgres`
- Mot de passe : `mustapha`

### 4.2 Vérifier que PostgreSQL est prêt

```bash
docker-compose logs -f postgresql
```

Attendez le message : `database system is ready to accept connections`

### 4.3 Exécuter les scripts d’initialisation

```bash
docker-compose --profile seed up db-script
```

- Ce service exécute tous les fichiers `.sql` et `.sh` présents dans `./db-init/`

### 4.4 Vérification rapide

```bash
docker exec -it <postgresql_container_id> psql -U postgres -d looyas-pfe
\dt   # liste des tables
```

Le volume `pgdata` garantit la persistance des données même après arrêt des conteneurs.

---

## 5️⃣ Construire et lancer les conteneurs

### 5.1 Construire les images

```bash
docker-compose build
```

### 5.2 Lancer la plateforme

```bash
docker-compose up
```

- Cette commande démarre tous les services définis dans `docker-compose.yml`
- Vous pouvez suivre les logs directement dans le terminal

---

## 6️⃣ Accéder à l’application

Ouvrez votre navigateur à l’adresse : <http://localhost:3000>

- Frontend React
- API via Gateway sur le port `8888`

---

## 7️⃣ Interfaces supplémentaires

- **pgAdmin** : <http://localhost:5050>
  - Email : `admin@admin.com`
  - Mot de passe : `admin`

---

## 8️⃣ Comptes de test

| Employé       | Email                        | Mot de passe  | Rôle       |
|---------------|-------------------------------|---------------|------------|
| Sonia RH      | rh@example.com               | rh123         | RH         |
| Ahmed         | supermanager@example.com     | super123      | MANAGER    |
| Karim         | manager@example.com          | manager123    | MANAGER    |
| Ali           | employee@example.com         | emp123        | EMPLOYEE   |

