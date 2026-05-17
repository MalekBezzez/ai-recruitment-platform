import json
import requests
import os
import re

import pika 

import logging

from career_prompt import build_career_prompt

# ----------------- SETUP LOGGING -----------------
logging.basicConfig(
    filename="career_planner.log",
    filemode="a",
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)
logger.info("Career planner started.")


# ------------------------------
# 🔹 Fonctions utilitaires
# ------------------------------




def call_ollama(prompt, model="mistral"):
    url = "http://ollama:11434/api/generate"
    payload = {"model": model, "prompt": prompt, "stream": False}
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        return response.json()['response']
    except Exception:
        return None

def extract_json(response_text):   # extraire uniquement le JSON valide.
    match = re.search(r"\{.*\}", response_text, re.DOTALL)
    if not match:
        return None
    json_text = match.group()
    json_text = re.sub(r',?\s*"[^"]*additional[^"]*"\s*:\s*"[^"]*"', '', json_text)
    try:
        return json.loads(json_text)
    except json.JSONDecodeError:
        return None
    

def fix_from_company_needs(parsed_json, company_needs):
    
    # Normalisation des titres donnés par l’entreprise
    company_titles = {need.strip().lower() for need in company_needs}

    for job in parsed_json.get("recommended_jobs", []):
        job_title = job.get("title", "").strip().lower()
        job["from_company_needs"] = job_title in company_titles

    return parsed_json
    

def fix_related_skills(parsed_json, employee): # pour remplir is_existing_skill
    all_skills = set(employee.get('skills_current_level', {}).keys())
    for job in parsed_json.get("recommended_jobs", []):
        for skill in job.get("related_job_skills", []):
            skill_name = skill.get("related_skill_name", "").strip()
            skill["is_existing_skill"] = skill_name in all_skills
    return parsed_json

# ------------------------------
# 🔹 Callback RabbitMQ
# ------------------------------
def callback_career_pathing(ch, method, properties, body):
    print("📩 Message reçu (Career Pathing) :", body.decode())
    payload = json.loads(body.decode())

    employees = payload.get("employees", [])
    company_needs = payload.get("needs", [])
    career_Pathing_Recommendation_Id = payload.get("careerPathingRecommendationId")

    #if not employees or not company_needs:
       # print("Payload incomplet, traitement ignoré.")
       # ch.basic_ack(delivery_tag=method.delivery_tag)
       # return
        
    career_results = []

    for idx, employee in enumerate(employees): 
        print(f"\n📘 Traitement employé {idx+1}/{len(employees)} : {employee['employee_id']} ({employee['role']})")
        
        prompt = build_career_prompt(employee, company_needs)
        if not prompt:
            continue
        raw_response = call_ollama(prompt) 

        print ("LLm output without fix :" , raw_response )
        print ("Done 1")
        
        if raw_response:
            parsed = extract_json(raw_response)
            if parsed:
                corrected = fix_related_skills(parsed, employee)
                #corrected = fix_from_company_needs(corrected, company_needs)
                career_results.append(corrected)
            else:
                print(f"Erreur JSON invalide pour l’employé {employee['employee_id']} ({employee['role']})")
        else:
            print(f"Pas de réponse ou échec API pour l’employé {employee['employee_id']} ({employee['role']})")

    # ✅ Publier le résultat sur la file de réponse
    print ("Le payload career_pathing_results", career_results)
    print ("Done 2")
    channel.basic_publish(
        exchange='',
        routing_key='career-pathing-response-queue',
        body=json.dumps({
            "requester_id": payload.get("requester_id"),     # 👈 même clé que dans l'input
            "career_pathing_result": career_results  ,
            "careerPathingRecommendationId" : career_Pathing_Recommendation_Id        # 👈 clé en snake_case
        })
    )

    # ✅ ACK après traitement
    ch.basic_ack(delivery_tag=method.delivery_tag)
    print ("Done 3")



# 🟢 Connexion au broker RabbitMQ
connection = pika.BlockingConnection(
    pika.ConnectionParameters(host='rabbitmq', port=5672, heartbeat=600)
)
channel = connection.channel()

# 🟢 Déclarer les queues Career Pathing
# ➜ Queue input (messages entrants depuis Spring)
channel.queue_declare(queue='career-pathing-request-queue', durable=True)

# ➜ Queue output (messages de réponse vers Spring)
channel.queue_declare(queue='career-pathing-response-queue', durable=True)


# Attacher le listener
channel.basic_consume(
    queue='career-pathing-request-queue',
    on_message_callback=callback_career_pathing,
    auto_ack=False
)

print('✅ Attente de messages Career Pathing. Ctrl+C pour stopper.')
channel.start_consuming()
