# 👥 🔹 Career Pathing Recommendation Module — README (FR)

**Description :**  
Ce module recommande des parcours de carrière pour des employés, en fonction de leurs compétences actuelles, objectifs professionnels et les compétences nécessaires pour atteindre les postes cibles.  



 
**Communication :**  
- Toutes les communications sont **asynchrones** via **RabbitMQ**.  
- **Queue d’entrée** : reçoit le profil des employés et la liste des postes ouverts.  
- **Queue de sortie** : renvoie les recommandations de carrière.


## 📝 Structure d'Input attendu

```json
{
  "requester_id": "REQ-001",
  "employees": {
    "employee_id": "EMP-123",
    "role": "Software Engineer",
    "skills_current_level": {
      "Skill1": 4,
      "Skill2": 3,
      "Skill3": 2 
    }
  },
  "needs": [
    "DevOps Engineer",
    "Cloud Architect",
    "Tech Lead"
  ]
}

## 📝 Structure d'Output attendu 

{
  "requester_id": "USR-123",
  "career_pathing_result": {
    "employee_id": "EMP-456",
    "role": "Developer",
    "recommended_jobs": [
      {
        "title": "DevOps Engineer",
        "match_percentage": 85,
        "justification": "Skill fit",
        "related_job_skills": [
          {
            "related_skill_name": "CI/CD",
            "is_existing_skill": true
          },
          {
            "related_skill_name": "Docker",
            "is_existing_skill": false
          }
        ],
        "from_company_needs": true
      },
      {
        "title": "Backend Lead",
        "match_percentage": 78,
        "justification": "High match",
        "related_job_skills": [
          {
            "related_skill_name": "API Design",
            "is_existing_skill": true
          },
          {
            "related_skill_name": "Microservices",
            "is_existing_skill": false
          }
        ],
        "from_company_needs": false
      }
    ]
  }
}