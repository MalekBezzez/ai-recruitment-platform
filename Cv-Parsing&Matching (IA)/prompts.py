# Prompt template CV

import json

def get_cv_prompt(cv_text: str) -> str:
    return f"""
##SYSTEM ROLE:    
You are an expert AI assistant specialized in parsing resumes and extracting structured data for a recruitment system.

Here is the raw text extracted from a resume:
\"\"\"{cv_text}\"\"\"

##INSTRUCTIONS
- Extract the structured information and return it in *strict valid JSON format only*.
- Do NOT add any explanations, comments, or markdown formatting.
- If a field is missing, *return an empty string "" or empty list [] accordingly*.
- Include jobs, internships, and relevant projects in the experience section.
- Maintain the exact key order as shown below.
- Output MUST be parsable JSON only.

## RULES:
- Always return the result in JSON format.
- Always include *all the following keys*, even if the corresponding section is empty.
- DO NOT invent, guess, or hallucinate missing data.
- Only extract what is explicitly present in the CV.
- Validate and confirm if each section is present or not in the final result.
- Do not add extra information or text outside the JSON block.
- Keep dates in original format

## SECTIONS TO RETURN (JSON FORMAT):
{{
  "name": "",
  "email": "",
  "phone": "",
  "linkedin": "",
  "github": "",
  "other": [{{"type": "", "link": ""}}],
  "address": "",
  "skills": [],
  "languages": [{{"language": "", "level": ""}}],
  "education": [{{"degree": "", "institution": "", "start_date": "", "end_date": ""}}],
  "experience": [{{"title": "", "company": "", "start_date": "", "end_date": "", "description": "", "type": ""}}],
  "years_of_experience": "",
  "certifications": [{{"certification": "", "obtention_date": ""}}]
}}

##EXAMPLE OUTPUT (for reference only):
{{
  "name": "Sami Ben Ahmed",
  "email": "sami.ahmed@gmail.com",
  "phone": "+216 99 123 456",
  "linkedin": "",
  "github": "",
  "other": [{{"type": "", "link": ""}}],
  "address": "Tunis, Tunisia",
  "skills": ["Python", "Data Science", "SQL", "TensorFlow"],
  "languages": [
    {{"language": "French", "level": "Professional"}},
    {{"language": "English", "level": "Fluent"}}
  ],
  "education": [
    {{
      "degree": "Engineering Degree in Data Science",
      "institution": "INSAT",
      "start_date": "2019",
      "end_date": "2022"
    }}
  ],
  "experience": [
    {{
      "title": "Data Analyst Intern",
      "company": "BIAT",
      "start_date": "June 2022",
      "end_date": "August 2022",
      "description": "Worked on client churn prediction using classification models.",
      "type": "Internship"
    }}
  ],
  "years_of_experience": "1",
  "certifications": []
}}


"""




# ========== PROMPT FUNCTION ==========
def get_match_prompt(cv_data: dict, job_data: dict ) -> str:
    return f"""
You are an objective HR scoring system. Your job is to strictly evaluate a candidate's compatibility with a job offer.

Candidate CV:
{json.dumps(cv_data, indent=2, ensure_ascii=False)}

Job offer:
{json.dumps(job_data, indent=2, ensure_ascii=False)}

### Scoring Rules (STRICT & NON-NEGOTIABLE):
- skills_score: max 0.40. Assign proportionally based ONLY on exact, explicit matches between candidate skills and required job skills. If none match → 0.0.
- experience_score: max 0.30. Count only professional experiences, internships, or projects in the same field. If none match → 0.0.
- education_score: max 0.20. Score only if education is directly relevant. If unrelated → 0.0.
- language_score: max 0.05. Only if candidate explicitly lists the required languages.
- certification_score: max 0.05. Only if explicit matching certifications are listed.

⚠ Absolute constraints:
1. Each score must be a float with **exactly 2 decimals**.
2. Each score must be between 0.0 and its max.
3. final_score = sum of all scores, no rounding beyond 2 decimals.
4. No points for inferred or assumed matches.

### Example of low match:
{{
  
  "skills_score": 0.00,
  "experience_score": 0.00,
  "education_score": 0.00,
  "language_score": 0.00,
  "certification_score": 0.00,
  "final_score": 0.00,
  "justification": "No skill, experience, or education matches. Candidate profile is unrelated to job requirements."
}}

### Output your strict evaluation in valid JSON:
{{

  "skills_score": float,
  "experience_score": float,
  "education_score": float,
  "language_score": float,
  "certification_score": float,
  "final_score": float,
  "justification": "3–6 lines explaining scores and mismatches."
}}
"""

