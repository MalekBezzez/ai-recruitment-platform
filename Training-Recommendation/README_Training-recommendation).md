# 👥 🔹 Training Recommendation Module — README (FR)

**Description :**  
Ce module recommande des formations adaptées à un ou plusieurs employés en fonction de leur profil et leur compétences.  
Les recommandations peuvent inclure : **self-training**, **coaching** ou **structured training**.


**Communication :**  
- Toutes les communications sont **asynchrones** via **RabbitMQ**.  
- **Queue d’entrée** : reçoit le profil des employés.  
- **Queue de sortie** : renvoie les formations recommandées.


## 📝 Structure d'Input attendu

```json
{
  "requester_id": "",
  "employees": [
    {
      "department": "Cloud",
      "employee_id": "CLD-001",
      "role": "Cloud Architect", 
      "seniority_level": "Senior",
      "current_level": {
        "AWS": 4,
        "Terraform": 4,
        "Kubernetes": 3,
        "Networking": 3,
        "Security": 3
      },
      "target_level": {
        "AWS": 5,
        "Terraform": 6,
        "Kubernetes": 4,
        "Networking": 5,
        "Security": 4
      }
    }
  ]
}

## 📝 Structure d'Output attendu 

```json

{
  "requester_id": "",
  "recommendation_result": {
    "Self_training": [
      {
        "employee_id": "EMP-001",
        "self_training_sessions": [
          {
            "training_title": "Advanced AWS & Terraform",
            "included_skills": ["AWS", "Terraform"],
            "skills_justification": "AWS and Terraform are often used together for infrastructure provisioning.",
            "training_justification": "This training helps the employee reach the target level in both tools.",
            "priority": "high",
            "priority_justification": "Employee needs to master these skills to lead cloud infrastructure projects."
          },
          {
            "training_title": "Security Fundamentals",
            "included_skills": ["Security"],
            "skills_justification": "Security knowledge is essential for cloud-based roles.",
            "training_justification": "The employee needs to strengthen security practices.",
            "priority": "medium",
            "priority_justification": "Security level is below target, and it's crucial for the role."
          }
        ]
      }
    ],
    "Coaching": [
      {
        "training_title": "Advanced Networking Concepts",
        "included_skills": ["Networking"],
        "skills_justification": "Employees need a better understanding of networking for cloud architecture.",
        "participants": ["CLD-001", "CLD-002"],
        "group_justification": "These employees are working on the same networking project.",
        "training_justification": "A coaching session will allow peer exchange and expert guidance.",
        "priority": "high",
        "priority_justification": "Networking is a bottleneck skill for project progress.",
        "coach": "CLD-003",
        "coach_justification": "An external expert is required due to advanced level."
      }
    ],
    "Structured_training": [
      {
        "training_title": "Kubernetes Bootcamp",
        "included_skills": ["Kubernetes"],
        "skills_justification": "Kubernetes is essential for container orchestration.",
        "participants": ["CLD-001", "CLD-003"],
        "training_justification": "A structured training will accelerate learning.",
        "priority": "medium",
        "priority_justification": "Moderate gap and high importance in upcoming projects."
      }
    ]
  }
}