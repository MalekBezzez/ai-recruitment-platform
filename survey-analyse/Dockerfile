# Builder stage
FROM python:3.10-slim AS builder
ENV DEBIAN_FRONTEND=noninteractive \
    PYTHONNOUSERSITE=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libc-dev \
 && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir \
    numpy==1.24.4 \
    pandas==2.0.3 \
    torch==2.0.1+cpu --extra-index-url https://download.pytorch.org/whl/cpu \
    transformers==4.31.0 \
    fastapi==0.115.0 \
    uvicorn==0.31.0 \
    pydantic==2.9.2 \
    aio-pika==9.4.0 \
    requests==2.32.3 \
    sentencepiece==0.1.99 \
    python-dotenv==1.0.1 \
    python-multipart==0.0.6   # <-- ajouter cette ligne

# Final stage
FROM python:3.10-slim
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONNOUSERSITE=1

RUN useradd -m -s /bin/bash appuser
USER appuser
WORKDIR /app/survey-analyse

COPY --from=builder /usr/local /usr/local
COPY --chown=appuser:appuser . .

RUN mkdir -p /app/results && chown appuser:appuser /app/results

EXPOSE 8000
CMD ["python3", "rabbit_consumer.py"]
