FROM python:3.10-slim

# Créer le dossier de travail
WORKDIR /app

# Copier requirements et installer les dépendances
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Ajouter netcat pour tester la connexion à RabbitMQ
RUN apt-get update && apt-get install -y netcat-openbsd && apt-get clean

# Copier le script d’attente + ton script Python
COPY wait-for-rabbitmq.sh .
COPY career_recommender.py .
COPY career_prompt.py .   
# Rendre le script exécutable
RUN chmod +x wait-for-rabbitmq.sh

# CMD finale avec attente RabbitMQ
CMD ["./wait-for-rabbitmq.sh", "rabbitmq", "5672", "--", "python", "career_recommender.py"]
