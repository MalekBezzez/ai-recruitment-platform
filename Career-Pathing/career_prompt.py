import json
import logging

# ----------------- SETUP LOGGING -----------------
logging.basicConfig(
    filename="career_planner.log",
    filemode="a",
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)





def build_career_prompt(employee, company_needs):
    employee_id = employee['employee_id']
    employee_role = employee['role']
    current_level = json.dumps(employee.get('skills_current_level', {}), indent=2, ensure_ascii=False)
    
    current_skills = set(employee.get('skills_current_level', {}).keys())
    
    if not current_skills:
        logger.warning(f"Employee {employee_id} ({employee_role}) has NO current skills.")
        return

    if not company_needs:
        logger.warning("Company needs input is EMPTY.")
        return

    unique_skills = list(current_skills)
    
    return f"""
STRICT INSTRUCTIONS:
1. Respond ONLY with 100% valid JSON.
2. DO NOT include markdown, comments, or any additional text.
3. Do not repeat job titles or include placeholders.
4. Use only the structure provided and ensure clean syntax.

OBJECTIVE:
You are an expert AI career advisor. Analyze the employee's current skills and generate personalized career path recommendations.

REQUIREMENTS:
- Recommend **exactly 5** total career paths.
- Among the 5:
  - **At least one** must be external (not from the company needs list).
- Do not repeat job titles between internal and external roles.

- "from_company_needs": true ONLY IF the job title EXACTLY matches one of the job titles listed in the COMPANY NEEDS section below.
- "from_company_needs": false if the job title does NOT exist in the COMPANY NEEDS list.
- DO NOT GUESS. This rule is ABSOLUTE.
- You must perform a strict string comparison with the COMPANY NEEDS job titles. No fuzzy matches, no assumptions.
- PRIORITY: This classification rule (true/false) MUST be applied correctly without exception.
- Prioritize roles that align with the employee’s skills.
- IMPORTANT: All recommended roles MUST stay in the same professional domain as the employee's current role ("{employee_role}").
  Example: If the employee is a Data Analyst, recommendations can be Data Scientist, BI Analyst, or Machine Learning Engineer — but NOT unrelated fields like Marketing Manager or HR Specialist.

- Each recommended job must include:
  - "title": (string) job title
  - "match_percentage": (integer) between 60-100
  - "justification": (string) realistic and logical explanation
  - "related_job_skills": (list of objects with name and boolean)
  - "from_company_needs": true/false

EMPLOYEE:
- ID: {employee_id}
- Role: {employee_role}
- Skills: {json.dumps(unique_skills, ensure_ascii=False)}
- Current Levels: {current_level}

COMPANY NEEDS:
{json.dumps(company_needs, indent=2, ensure_ascii=False)}

OUTPUT FORMAT:
{{
  "employee_id": "{employee_id}",
  "role": "{employee_role}",
  "recommended_jobs": [
    {{
      "title": "Job Title",
      "match_percentage": 85,
      "justification": "Clear and logical justification",
      "related_job_skills": [
        {{
          "related_skill_name": "Skill A",
          "is_existing_skill": true
        }},
        {{
          "related_skill_name": "Skill B",
          "is_existing_skill": false
        }}
      ],
      "from_company_needs": true
    }}
  ]
}}
"""
