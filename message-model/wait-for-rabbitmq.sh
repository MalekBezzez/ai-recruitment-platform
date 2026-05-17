#!/bin/sh
set -e
echo "⏳ Waiting for RabbitMQ on rabbitmq:5672..."
while ! nc -z localhost 5672; do
  sleep 2
done
echo "✅ RabbitMQ port open, waiting extra 5s to ensure full readiness..."
sleep 5
echo "🚀 Starting app"
exec python -u rabbit_consumer.py
