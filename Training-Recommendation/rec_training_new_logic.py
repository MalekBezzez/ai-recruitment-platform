import json
import subprocess
import re
from collections import defaultdict

import pika
# RabbitMQ



# for loggging 

import logging

# Setup logger
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("training_planner.log", mode='w', encoding='utf-8'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)


def compute_gaps(employee):
    gaps = []

    # Logging: No employee ID
    emp_id = employee.get("id")


    current = employee.get("current_level")
    target = employee.get("target_level")

    # Logging: Missing or invalid skill data
    if not isinstance(current, dict) or not current:
        logger.warning(f"⚠️  Employee {emp_id} has no valid current skill levels. Skipping.")
        return gaps

    if not isinstance(target, dict) or not target:
        logger.warning(f"⚠️  Employee {emp_id} has no valid target skill levels. Skipping.")
        return gaps

    department = employee.get("department")
    if not department:
        logger.warning(f"⚠️  No department found for employee {emp_id}. Defaulting to 'General'")
        department = "General"

    for skill, target_lvl in target.items():
        current_lvl = current.get(skill, 0)

        # Logging: Target level < current level
        if target_lvl < current_lvl:
            logger.info(f"ℹ️  Target level lower than current for skill '{skill}' (target: {target_lvl}, current: {current_lvl}) for employee {emp_id}")

        gap = target_lvl - current_lvl
        if gap > 0:
            if gap <= 1:
                training_type = "Self_training"
            elif 2 <= gap <= 3:
                training_type = "Coaching"
            else:
                training_type = "Structured_training"
            gaps.append({
                "id": emp_id,
                "role": employee.get("role", ""),
                "department": department,
                "skill": skill,
                "current_level": current_lvl,
                "target_level": target_lvl,
                "gap": gap,
                "training_type": training_type
            })

    return gaps


def normalize_skill(skill):
    return skill.strip().lower()


def query_ollama_mistral(prompt):
    command = ["ollama", "run", "mistral"]
    attempt = 1
    max_attempts = 30
    print("🔎 Mistral input prompt :\n", prompt)
    while attempt <= max_attempts:
        print(f"⚡ Calling Ollama Mistral model... Attempt {attempt}")
        process = subprocess.Popen(command, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, encoding="utf-8")
        out, err = process.communicate(prompt)
        
        print("🔎 Mistral raw output:\n", out)
        if process.returncode != 0:
            raise RuntimeError(f"Ollama failed: {err}")

        objects = re.findall(r'\{.*?\}', out, re.DOTALL)
        for obj in objects:
            try:
                return json.loads(obj)
            except Exception:
                continue

        print(f"Retrying Mistral... Could not decode output. Attempt {attempt}")
        attempt += 1
    raise RuntimeError("Exceeded maximum attempts (30) without receiving valid JSON from Mistral.")    




def llm_generate_title_justification(label, domain, included_skills, participants, department, role=""):
    skills_list = ", ".join(included_skills)
    participants_list = ", ".join(str(p) for p in participants) # convertit liste de particpant en liste de Str
    prompt = (
    f"You are a corporate training advisor.\n"
    f"Generate a concise training title and the following justifications and Do NOT include any employee identifiers (like CLD-010) and .\n"
    f"- skills_justification: Explain why these skills are grouped\n"
    f"- training_justification: Explain why this training is needed\n"
    f"- priority: low, medium or high\n"
    f"- priority_justification: Justify this priority considering the employee's role and how important these skills are for it\n"
    f"Context:\n"
    f"- Type: {label}\n"
    f"- Domain: {domain}\n"
    f"- Skills: {skills_list}\n"
    f"- Department: {department}\n"
    f"- Participants: {participants_list}\n"
    f"- Role: {role}\n"
    f"Output valid JSON: {{\"training_title\": \"...\", \"skills_justification\": \"...\", \"training_justification\": \"...\", \"priority\": \"...\", \"priority_justification\": \"...\"}}"
   )

    return query_ollama_mistral(prompt)


def regroup_skills_semantically(gaps):
    dept_skills = defaultdict(set)
    for gap in gaps:
        dept = gap["department"]
        dept_skills[dept].add(gap["skill"])

    domain_mapping = {}

    for dept, skills in dept_skills.items():
        norm_skills = set(normalize_skill(s) for s in skills)
        missing = norm_skills.copy()
        all_skills = list(skills)
        dept_mapping = defaultdict(list)
        attempt = 1
        max_attempts = 12

        while missing and attempt <= max_attempts:
            target_skills = [s for s in all_skills if normalize_skill(s) in missing]
            prompt_skills = ", ".join(f'"{s}"' for s in target_skills)
            prompt = (
                f"You are a corporate training expert.\n"
                f"Categorize these skills used in the {dept} department: [{prompt_skills}]\n"
                f"Group into meaningful skill domains.\n"
                f"Make sure 100% of the skills are categorized.\n"
                f"Output valid JSON: {{ domain: [skills] }}."
            )
            partial_mapping = query_ollama_mistral(prompt)

            if not partial_mapping:
                break

            for domain, skills_list in partial_mapping.items():
                domain_key = f"{domain.strip()} ({dept})"
                dept_mapping[domain_key].extend(skills_list)

            mapped_skills = {normalize_skill(s) for skills_list in dept_mapping.values() for s in skills_list}
            missing = norm_skills - mapped_skills
            attempt += 1

        # On garde uniquement les compétences bien classées
        domain_mapping.update(dept_mapping)

    return dict(domain_mapping)


    



def build_output_semantic(gaps, domain_mapping, employees):
    output = {"Self_training": [], "Coaching": [], "Structured_training": []}
    skill_to_domain = {}
    for domain, skills in domain_mapping.items():
        cleaned_domain = " ".join(word.capitalize() for word in domain.split())
        for skill in skills:
            skill_to_domain[normalize_skill(skill)] = cleaned_domain

    self_training_sessions = defaultdict(lambda: defaultdict(list))
    coaching_groups = []
    structured_groups = []

    for gap in gaps:
        domain = skill_to_domain.get(normalize_skill(gap["skill"]), "Miscellaneous")
        if gap["training_type"] == "Self_training":
            self_training_sessions[gap["id"]][domain].append(gap["skill"])
        elif gap["training_type"] == "Coaching":
            coaching_groups.append({**gap, "domain": domain})
        elif gap["training_type"] == "Structured_training":
            structured_groups.append({**gap, "domain": domain})

    for emp_id, domains in self_training_sessions.items():
        sessions = []
        for domain, skills in domains.items():
            llm_out = llm_generate_title_justification("Self_training", domain, sorted(set(skills)), [emp_id], "")
            sessions.append({
                "training_title": llm_out.get("training_title"),
                "included_skills": sorted(set(skills)),
                "skills_justification": llm_out.get("skills_justification"),
                "training_justification": llm_out.get("training_justification"),
                "priority": "low",
                "priority_justification": llm_out.get("priority_justification")
            })
        output["Self_training"].append({"id": emp_id, "self_training_sessions": sessions})

    coaching_out, coaching_structured_extra = group_participants(coaching_groups, "Coaching", employees)
    structured_out, _ = group_participants(structured_groups, "Structured training", employees)

    output["Coaching"] = coaching_out
    output["Structured_training"] = structured_out + coaching_structured_extra

    return output

def group_participants(groups, label, employees):
    result = []
    structured_extra = []
    domain_grouping = defaultdict(list)

    for g in groups:
        key = (g["domain"], g["department"], g["training_type"])
        domain_grouping[key].append(g)

    for (domain, department, training_type), gaps in domain_grouping.items():
        participants = []
        skill_set = set()
        target_levels = defaultdict(list)
        role_set = set()

        for g in gaps:
            participants.append(g["id"])
            skill_set.add(g["skill"])
            target_levels[g["id"]].append(g["target_level"])
            role_set.add(g["role"])

        all_levels = [lvl for lvls in target_levels.values() for lvl in lvls]
        if max(all_levels) - min(all_levels) > 1:
            continue

        included_skills = sorted(skill_set)
        llm_out = llm_generate_title_justification(label, domain, included_skills, participants, department)

        entry = {
            "training_title": llm_out.get("training_title"),
            "included_skills": included_skills,
            "participants": sorted(set(participants)),
            "skills_justification": llm_out.get("skills_justification"),
            "training_justification": llm_out.get("training_justification"),
            "priority": "high",
            "priority_justification": llm_out.get("priority_justification")
        }

        if "Coaching" in label:
            best_coach = None
            for emp in employees:
                if emp["id"] in participants or emp["department"] != department:
                    continue
                emp_levels = emp.get("current_level", {})
                seniority = emp.get("seniority_level", "").lower()
                rank = {"junior": 1, "mid": 2, "senior": 3}.get(seniority, 0)
                meets = all(emp_levels.get(skill, 0) >= max(all_levels) for skill in included_skills)
                if meets and (not best_coach or rank > best_coach["rank"]):
                    best_coach = {"id": emp["id"], "rank": rank, "seniority": seniority.title()}

            if best_coach:
                entry["coach"] = best_coach["id"]
                coach_prompt = (
                    f"You are a corporate L&D strategist.\n"
                    f"Generate a justification why employee {best_coach['id']} ({best_coach['seniority']}) "
                    f"should coach participants {', '.join(participants)} in the domain of {domain}.\n"
                    f"Output valid JSON: {{\"coach_justification\": \"...\"}}"
                )
                coach_out = query_ollama_mistral(coach_prompt)
                entry["coach_justification"] = coach_out.get("coach_justification")
                result.append(entry)
            else:
                # Aucun coach → on déplace directement en Structured_training
                entry_structured = {
                    "training_title": llm_out.get("training_title"),
                    "included_skills": included_skills,
                    "participants": sorted(set(participants)),
                    "skills_justification": llm_out.get("skills_justification"),
                    "training_justification": llm_out.get("training_justification"),
                    "priority": "high",
                    "priority_justification": llm_out.get("priority_justification")
                }
                structured_extra.append(entry_structured)
                continue  # ⛔ NE PAS ajouter dans Coaching

        else:
            result.append(entry)

    return result, structured_extra








def callback(ch, method, properties, body):
    try:
        print("📥 Message reçu depuis RabbitMQ :", body.decode())
        data = json.loads(body)

        employees = data.get("employees", [])  
        if not employees:
            logger.error("❌ No employees found in input data. Exiting.")
            return
        

        requester_id = data.get("requesterId")
        training_recommendation_plan_id = data.get("trainingRecommendationPlanId")

        # logique
        all_gaps = []
        for emp in employees:
            all_gaps.extend(compute_gaps(emp))

        
        logger.info(f"✅ Found {len(all_gaps)} skill gaps.")
        domain_mapping = regroup_skills_semantically(all_gaps)
        final_output = build_output_semantic(all_gaps, domain_mapping, employees)

        output_payload = {
            "trainingRecommendationPlanId" : training_recommendation_plan_id,
            "requesterId": requester_id,
            "recommendationPlan": final_output


        }
        
        print(" Payload généré avant publication :")
        print(json.dumps(output_payload, indent=2, ensure_ascii=False))
        
        #  Publier dans la queue OUTPUT
        ch.basic_publish(
            exchange='',
            routing_key='training-recommendation-response-queue',
            body=json.dumps(output_payload),
            properties=pika.BasicProperties(
                delivery_mode=2
            )
        )
        print(" Résultat pushé dans la file 'training-recommendation-response-queue'.")

        # SEULEMENT SI TOUT OK → ACK
        ch.basic_ack(delivery_tag=method.delivery_tag)  
        print(" ACK envoyé pour le message.")
        
    except Exception as e:
        print(f" Erreur pendant traitement du message : {e}")
        #  En cas d'erreur, on refuse le message et on le remet dans la queue
        ch.basic_nack(delivery_tag=method.delivery_tag, requeue=True)
        print("Message réinséré dans la file pour être re-traité.")







# 🟢 Connexion au broker RabbitMQ
connection = pika.BlockingConnection(
    pika.ConnectionParameters(host='rabbitmq', port=5672 , heartbeat=600)  #ouvre un socket TCP direct sur le port 5672 (AMQP) 
)
channel = connection.channel()

# 🟢 Déclarer la même queue (idempotent)
# ➜ Queue input 
channel.queue_declare(queue='training-recommendation-request-queue', durable=True)

# ➜ Queue output
channel.queue_declare(queue='training-recommendation-response-queue', durable=True)

#  Attacher le consommateur    sur quelle file on va fait le listenner 
channel.basic_consume(
    queue='training-recommendation-request-queue',
    on_message_callback=callback,
    auto_ack=False # ou False si tu veux gérer les ack manuellement
)

print('✅ Attente de messages. Ctrl+C pour stopper.')
channel.start_consuming()  # donc ceci va etré un listenner , dés il y'a detection , on passe au consumer , ce consumer possede un callback



