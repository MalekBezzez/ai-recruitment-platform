#!/bin/sh
echo "⏳ Waiting for RabbitMQ on rabbitmq:5672..."
while ! nc -z rabbitmq 5672; do
  sleep 2
done
echo "✅ RabbitMQ is up - starting app"
exec python career_recommender.py
