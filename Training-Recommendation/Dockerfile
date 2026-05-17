FROM python:3.10-slim

WORKDIR /app

# Outils systèmes (curl pour installer ollama, netcat pour wait-for-rabbitmq.sh)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl netcat-openbsd ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Dépendances Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Installer la CLI Ollama (client) sans démarrer de serveur dans ce conteneur
# La CLI utilisera OLLAMA_HOST pour se connecter au service "ollama" du compose
RUN curl -fsSL https://ollama.com/install.sh | OLLAMA_NO_SERVICE=1 sh

# Code app
COPY rec_training_new_logic.py .
COPY wait-for-rabbitmq.sh .
RUN chmod +x wait-for-rabbitmq.sh

# La CLI se connectera au serveur Ollama distant (service docker "ollama")
ENV OLLAMA_HOST=http://ollama:11434

# Lance l'attente RabbitMQ puis ton consumer Python
CMD ["./wait-for-rabbitmq.sh"]