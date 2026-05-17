import aio_pika
import asyncio
import json
import requests
import os
import uuid
import hashlib
from dotenv import load_dotenv
from discussion import run_discussion

load_dotenv()

RABBIT_URL = os.getenv("RABBIT_URL", "amqp://guest:guest@localhost:5672/")
QUEUE_NAME = os.getenv("QUEUE_NAME", "Discussion_queue")
SPRING_BOOT_URL = os.getenv("SPRING_BOOT_URL", "http://localhost:8084/prediction/save-result")

# Ensemble pour stocker les hachages des messages traités
processed_hashes = set()

def hash_employee_data(employee_data):
    """Génère un hachage unique pour les données des employés pour détecter les doublons."""
    data_str = json.dumps(employee_data, sort_keys=True, ensure_ascii=False)
    return hashlib.sha256(data_str.encode('utf-8')).hexdigest()

async def publish_results_to_rabbitmq(channel, results):
    """Publie les résultats dans une file RabbitMQ (ex: discussion_result_queue)."""
    try:
        result_queue = "discussion_result_queue"
        await channel.declare_queue(result_queue, durable=True)

        for result in results:
            message_body = json.dumps(result, ensure_ascii=False).encode()
            await channel.default_exchange.publish(
                aio_pika.Message(
                    body=message_body,
                    content_type="application/json"
                ),
                routing_key=result_queue
            )
            print(f"📤 Résultat publié dans '{result_queue}' : {result}")
        print("✅ Tous les résultats ont été publiés dans RabbitMQ")
    except Exception as e:
        print(f"❌ Erreur lors de la publication RabbitMQ : {str(e)}")

async def consume():
    """Consomme les messages de la file RabbitMQ et traite les données."""
    print("🔄 Connexion à RabbitMQ...")
    connection = await aio_pika.connect_robust(RABBIT_URL)
    channel = await connection.channel()
    await channel.set_qos(prefetch_count=1)  # Traite un message à la fois
    queue = await channel.declare_queue(QUEUE_NAME, durable=True)
    print(f"✅ Prêt à consommer depuis {QUEUE_NAME}")

    async with queue.iterator() as queue_iter:
        async for message in queue_iter:
            async with message.process():
                try:
                    raw_body = message.body.decode("utf-8")
                    print(f"📩 Message reçu (ID: {message.message_id}, taille: {len(raw_body)}): {raw_body}")
                    data = json.loads(raw_body)
                    raw_responses = data.get("responses")

                    if not raw_responses:
                        print("⚠️ Aucune réponse trouvée.")
                        continue

                    employee_data = [
                        {
                            "employee_id": r.get("employee_id"),
                            "employee_name": r.get("employee_name"),
                            "message_text": r.get("message_text")
                        } for r in raw_responses if r.get("message_text")
                    ]
                    print(f"📋 Données extraites ({len(employee_data)} éléments) : {json.dumps(employee_data, indent=2, ensure_ascii=False)}")

                    # Vérifie les doublons basés sur le contenu
                    data_hash = hash_employee_data(employee_data)
                    if data_hash in processed_hashes:
                        print(f"⚠️ Message dupliqué détecté (hash: {data_hash}), ignoré.")
                        continue
                    processed_hashes.add(data_hash)

                    # Génère un ID TEST UNIQUE
                    id_test = str(uuid.uuid4())
                    print(f"🆔 Nouveau ID Test : {id_test}")

                    # Analyse le batch avec le même ID
                    predictions = run_discussion(employee_data, id_test=id_test)
                    detailed_results = predictions.get("detailed_results", [])
                    print(f"📊 Résultats obtenus ({len(detailed_results)} éléments) : {json.dumps(detailed_results, indent=2, ensure_ascii=False)}")

                    # Injecte id_test dans chaque résultat
                    for result in detailed_results:
                        result["id_test"] = id_test

                    # Envoie les résultats à Spring Boot
                    await publish_results_to_rabbitmq(channel, detailed_results)

                except Exception as e:
                    print(f"❌ Erreur de traitement : {str(e)}")

if __name__ == "__main__":
    asyncio.run(consume())