# rabbit_consumer.py
import aio_pika
import asyncio
import json
import requests
import os
from survey_analysis import analyze, ResponseItem, load_config

# Charge la config depuis <projet_root>/config.json
here = os.path.dirname(__file__)
config = load_config(os.path.join(here, "config.json"))

RABBIT_URL           = config["rabbit_url"]
QUEUE_NAME           = config["rabbit_queue"]
SPRING_BOOT_SAVE_URL = config["spring_boot_save_url"]
SPRING_BOOT_PUSH_URL = config["spring_boot_push_url"]
async def publish_results_to_queue(channel, results, questionnaire_id, initiator_user_id, token):
    queue_name = "nlp_save_results_queue"
    await channel.declare_queue(queue_name, durable=True)

    payload = {
        "questionnaireId": questionnaire_id,
        "initiatorUserId": initiator_user_id,
        "results": results
    }

    await channel.default_exchange.publish(
        aio_pika.Message(
            body=json.dumps(payload).encode(),
            content_type="application/json",
            headers={"Authorization": f"Bearer {token}"}
        ),
        routing_key=queue_name
    )
    print(f"📤 Résultats NLP publiés dans '{queue_name}'")

async def save_results_to_spring_boot(results: list[dict], questionnaire_id: int, token: str):
    try:
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        payload = {
            "questionnaireId": questionnaire_id,
            "results": results
        }
        response = requests.post(SPRING_BOOT_SAVE_URL, json=payload, headers=headers)
        response.raise_for_status()
        print(f"✅ Résultats envoyés à Spring Boot pour Q{questionnaire_id}")
    except Exception as e:
        print(f"❌ Erreur lors de l'envoi des résultats à Spring Boot : {e}")

async def consume():
    connection = await aio_pika.connect_robust(RABBIT_URL)
    channel = await connection.channel()
    queue = await channel.declare_queue(QUEUE_NAME, durable=True)
    print(f"🔌 Connecté à RabbitMQ. En attente sur '{QUEUE_NAME}'…")

    async with queue.iterator() as queue_iter:
        async for message in queue_iter:
            async with message.process():
                try:
                    data = json.loads(message.body)
                    raw_responses    = data["responses"]
                    questionnaire_id = data["questionnaireId"]
                    token            = data["token"]
                    initiator_user_id = data.get("initiatorUserId")

                    print(f"⚙️  Traitement de Q{questionnaire_id}, {len(raw_responses)} réponses…")

                    # Ajoute l'ID du questionnaire à chaque réponse
                    for item in raw_responses:
                        item["questionnaireId"] = questionnaire_id

                    # Conversion en objets Pydantic et analyse
                    responses = [ResponseItem(**item) for item in raw_responses]
                    results   = analyze(responses)

                    # Envoi des résultats
                    await publish_results_to_queue(channel, results, questionnaire_id, initiator_user_id, token)

                    # Envoi de la notification SSE si besoin
                    if initiator_user_id:
                        try:
                            headers = {
                                "Authorization": f"Bearer {token}",
                                "Content-Type": "text/plain"
                            }
                            push_response = requests.post(
                                f"{SPRING_BOOT_PUSH_URL}?userId={initiator_user_id}",
                                data="✅ The questionnaire analysis has been completed.",
                                headers=headers
                            )
                            push_response.raise_for_status()
                            print(f"🔔 Notification envoyée à l'utilisateur {initiator_user_id}")
                        except Exception as e:
                            print(f"⚠️ Erreur notification SSE : {e}")

                except Exception as e:
                    print(f"❌ Erreur traitement message : {e}")

if __name__ == "__main__":
    asyncio.run(consume())
