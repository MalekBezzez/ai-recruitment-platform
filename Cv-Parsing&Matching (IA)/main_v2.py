import os
import json
import threading
from pathlib import Path
from typing import Optional, Dict
import PyPDF2
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from docx import Document
import ollama
import pytesseract
from pdf2image import convert_from_path
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
# database imports 


import asyncio
import time  
import datetime
#import uvicorn
from mail_service import send_email
from prompts import get_cv_prompt
from prompts import get_match_prompt

# Dependency for models 


import os
from dotenv import load_dotenv


from tempfile import NamedTemporaryFile
from base64 import b64decode
import pika

import logging 

load_dotenv()


# Configure Tesseract & Poppler
pytesseract.pytesseract.tesseract_cmd = os.getenv('TESSERACT_CMD')
POPPLER_PATH = os.getenv('POPPLER_PATH')

logging.basicConfig(
    level=logging.INFO,
    format='[%(asctime)s] %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("cv_extraction.log", mode='a', encoding='utf-8'),
        logging.StreamHandler()
    ]
)


#  For Empty structure verification 

def validate_or_correct_score(result: Dict) -> float:
    
    calculated_score = round(
        result.get("skills_score", 0.0) +
        result.get("experience_score", 0.0) +
        result.get("education_score", 0.0) +
        result.get("language_score", 0.0) +
        result.get("certification_score", 0.0), 6
    )

    reported_score = round(result.get("final_score", 0.0), 6)

    if abs(calculated_score - reported_score) < 1e-6:
        return reported_score
    else:
        return calculated_score


def is_empty_structure(data):
    if isinstance(data, str):
        return data.strip() == ""
    elif isinstance(data, list):
        return all(is_empty_structure(item) for item in data) or len(data) == 0
    elif isinstance(data, dict):
        return all(is_empty_structure(v) for v in data.values())
    return False


# --- Formatage des scores ---
def format_score_with_percentage(score_value, score_max):
    if score_max == 0:
        return 0
    percentage = round((score_value / score_max) , 2) # 
    return percentage



#  Resume Parser Pipeline
class RecruitmentPipeline:
    def __init__(self, model_name: str = os.getenv("MODEL_NAME")):

        self.model_name = model_name 
        self.client = ollama.Client(host=os.getenv("OLLAMA_HOST"))

    # What we modify for logging 
    def extract_text(self, file_path: str) -> Optional[str]:
        try:
            file_path = os.path.normpath(file_path)
            text = ""

            if file_path.lower().endswith('.pdf'):
                with open(file_path, 'rb') as file:
                    reader = PyPDF2.PdfReader(file) 
                    text = "\n".join([page.extract_text() or "" for page in reader.pages])

            elif file_path.lower().endswith(('.docx', '.doc')):
                doc = Document(file_path)
                text = "\n".join([para.text for para in doc.paragraphs if para.text])

            elif file_path.lower().endswith('.txt'):
                with open(file_path, 'r', encoding='utf-8') as file:
                    text = file.read()

            if not text.strip():
                logging.warning(f"No text extracted from: {file_path}.  Trying OCR as fallback...")
                if file_path.lower().endswith('.pdf'):
                    images = convert_from_path(file_path, poppler_path=POPPLER_PATH)
                    text = "\n".join([pytesseract.image_to_string(image) for image in images])

            if not text.strip():
                logging.error(f"Text extraction failed after OCR for: {file_path}")
            return text

        except Exception as e:
            logging.exception(f"Error during text extraction from: {file_path}")
            return None



    def parse_with_llm(self, text: str) -> Optional[Dict]:
        try:
            prompt = get_cv_prompt(text)
            response = self.client.generate(
                model=self.model_name,
                prompt=prompt,
                format="json",
                options={"temperature": 0.1, "num_ctx": 4096}
            )
            return json.loads(response['response'])
        except Exception as e:
            logging.exception(f"Parsing failed for document type ")
            return None

    def matching_with_llm(self, cv_data, job_data ):
                try:
                    prompt = get_match_prompt(cv_data, job_data)
                    response = self.client.generate(
                        model=self.model_name,
                        prompt=prompt,
                        format="json",
                        options={"temperature": 0.3, "num_ctx": 4096}
                    )
                    return json.loads(response['response'])
                except Exception as e:
                    print(f"LLM matching failed: {e}")
                    return {
                        "skills_score": 0.0,
                        "experience_score": 0.0,
                        "education_score": 0.0,
                        "language_score": 0.0,
                        "certification_score": 0.0,
                        "final_score": 0.0,
                        "justification": "Matching failed due to LLM error."
                    }   

        
        


# 📁 Folder Watcher
class ResumeHandler(FileSystemEventHandler):
    def __init__(self, pipeline: RecruitmentPipeline, source_type: str):
        self.pipeline = pipeline
        self.source_type = source_type
        self.loop = asyncio.new_event_loop()

    
    
        
    def process_resume(self, file_path: str) -> Optional[Dict]: # Method for extracting 
        try:
            print(f" Extraction du CV : {file_path}")
            cv_text = self.pipeline.extract_text(file_path)
            if not cv_text:
                print(" Échec de l'extraction de texte.")
                return None

            cv_data = self.pipeline.parse_with_llm(cv_text)
            if not cv_data:
                print(" Échec du parsing LLM.")
                return None

            return cv_data
        except Exception as e:
            print(f"Erreur process_resume : {e}")
            return None





# our Handler Functions 

def handle_offer_case(payload, pipeline):
    print("Traitement du CV avec offre...")
    #what i added recently 
    application_id = payload.get("applicationId")
    cv_encoded = payload["cv_encoded"]
    job_offer = payload["job_offer"]
    print ("ID du Application recus", application_id)
    with NamedTemporaryFile(delete=False, suffix=".pdf") as temp_cv:
        temp_cv.write(b64decode(cv_encoded))
        temp_cv_path = temp_cv.name

    cv_data = pipeline.extract_text(temp_cv_path)
    parsed = pipeline.parse_with_llm(cv_data)
    email_data = parsed.get("email", "")
    if isinstance(email_data, list): # list type 
            email = ", ".join(email_data)
    else:
            email = email_data # n'est pas liste 
    parsed["email"] = email       

    phone_data = parsed.get("phone", "")
    if isinstance(phone_data, list):
            phone = ", ".join(phone_data)
    else:
            phone = phone_data
    parsed["phone"] = phone  

    if is_empty_structure(parsed):
        print("Resume structure is empty")
        logging.warning("📄 Empty resume detected in the job offer case. No text extracted.")
        
        result_payload = { "applicationId": application_id,"parsing_result": [], "matching_result": [] }
        #result_payload = { "parsing_result": [], "matching_result": [] }

        logging.info(f"📤 Empty payload sent: {result_payload}")
    else:
        match_result = pipeline.matching_with_llm(parsed, job_offer)
        fixed_final_score = validate_or_correct_score(match_result)
        match_result['final_score'] = fixed_final_score 
        print("Matching terminé :", match_result)
        # Barème max configurable
        max_scores = {
            "skills_score": 0.4,
            "experience_score": 0.3,
            "education_score": 0.2,
            "language_score": 0.05,
            "certification_score": 0.05
        }
        for key, max_val in max_scores.items():
            if key in match_result:
                match_result[key] = format_score_with_percentage(match_result[key], max_val)
        result_payload = { "applicationId": application_id, "parsing_result": parsed, "matching_result": match_result}
        #result_payload = {  "parsing_result": parsed, "matching_result": match_result}
    print ("result payload before sendind :  ",result_payload )    

    push_result_to_rabbitmq(result_payload)
    

def handle_spontaneous_case(payload, pipeline):
    print("Traitement du CV spontané...")

    cv_encoded = payload["cv_encoded"]
    application_id = payload.get("applicationId")

    with NamedTemporaryFile(delete=False, suffix=".pdf") as temp_cv:
        temp_cv.write(b64decode(cv_encoded))
        temp_cv_path = temp_cv.name

    cv_data = pipeline.extract_text(temp_cv_path)

    # ✅ CV vide
    if not cv_data.strip():
        result_payload = {"applicationId": application_id, "parsing_result": []}
        print("CV vide, payload envoyé :", result_payload)
        push_result_to_rabbitmq(result_payload)
        return

    parsed = pipeline.parse_with_llm(cv_data)

    email_data = parsed.get("email", "")
    if isinstance(email_data, list): # list type 
            email = ", ".join(email_data)
    else:
            email = email_data # n'est pas liste 
    parsed["email"] = email       

    phone_data = parsed.get("phone", "")
    if isinstance(phone_data, list):
            phone = ", ".join(phone_data)
    else:
            phone = phone_data
    parsed["phone"] = phone       


    if is_empty_structure(parsed):
        result_payload = {"applicationId": application_id,"parsing_result": []}
    else:
        result_payload = {"applicationId": application_id, "parsing_result": parsed}

    print("CV analysé :", parsed)
    print ("result payload before sendind :  ",result_payload )    
    push_result_to_rabbitmq(result_payload)

# RabbitMQ listenner 

def start_rabbitmq_listener():
    pipeline = RecruitmentPipeline()
    while True:
        try:
            connection = pika.BlockingConnection(pika.ConnectionParameters('rabbitmq', heartbeat=600))
            channel = connection.channel()
            channel.queue_declare(queue='cv_parsing_queue', durable=True)

            def callback(ch, method, properties, body):
                print("📩 Message reçu.")
                payload = json.loads(body)
                if "job_offer" in payload:
                    handle_offer_case(payload, pipeline)
                else:
                    handle_spontaneous_case(payload, pipeline)
                ch.basic_ack(delivery_tag=method.delivery_tag)

            channel.basic_consume(queue='cv_parsing_queue', on_message_callback=callback, auto_ack=False)
            print("En attente de messages RabbitMQ...")
            channel.start_consuming()

        except pika.exceptions.AMQPConnectionError as e:
            print("Connexion RabbitMQ perdue, tentative de reconnexion dans 5s...", str(e))
            time.sleep(5)


# --- Publisher ---
def push_result_to_rabbitmq(result_payload):
    try:
        connection = pika.BlockingConnection(pika.ConnectionParameters('rabbitmq'))
        channel = connection.channel()
        channel.queue_declare(queue='cv_parsing_response_queue', durable=True)
        channel.basic_publish(
            exchange='',
            routing_key='cv_parsing_response_queue',
            body=json.dumps(result_payload),
            properties=pika.BasicProperties(delivery_mode=2)
        )
        print ("resultas pushé vers la file de resultatst")
    finally:
        connection.close()
#  Main runner
if __name__ == "__main__":


    start_rabbitmq_listener()
    print(" running ... ")



