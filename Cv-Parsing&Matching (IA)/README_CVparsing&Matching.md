# 👥 Cv Parsing & Job Matching Module — README (FR)

**Description :**  
Ce modèle extrait les informations clés d’un CV encodé et réalise un matching avec une offre d’emploi si celle-ci est fournie.

**Requirements :**  
- Le modèle nécessite **Poppler-24.08.0** et **Tesseract-OCR**.  
- Ces dossiers ne sont pas inclus dans le dépôt Git.  
- Après téléchargement, **décompressez le fichier ZIP fourni** et **copiez les dossiers `Poppler-24.08.0` et `Tesseract-OCR` dans le dossier racine du module**, au même niveau que ce README, pour que le modèle fonctionne correctement.  
- Le liens pour télécharger le ZIP :
https://drive.google.com/file/d/1UJ3WlgR97TD9H8y7snoeOOeh4zz9aUf5/view?usp=drive_link.

**Communication :**  
- Toutes les communications sont **asynchrones** via **RabbitMQ**.  
- **Queue d’entrée** : reçoit le CV encodé et  l’offre d’emploi (en cas de candidature par offre).  
- **Queue de sortie** : renvoie les résultats de l’extraction et du matching.


## 📝 Structure d'Input attendu

```json
{
  "application_id": "string",
  "cv_encoded": "string",
  "job_offer": {
    "Job_offer_id": 101,
    "job_title": "Full-stack .NET Developer",
    "years_of_experience": 3,
    "education": {
      "diploma_name": "Engineering Degree",
      "speciality": "Computer Science"
    },
    "about": "string",
    "required_skills": "string",
    "required_languages": "string"
  }
}


## 📝 Structure d'Output attendu 

{
  "application_id": "string",
  "parsing_result": {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1 555-1234",
    "linkedin": "https://www.linkedin.com/in/johndoe",
    "github": "https://github.com/johndoe",
    "other": [
      {
        "type": "portfolio",
        "link": "https://johndoe.dev"
      }
    ],
    "address": "Nabeul",
    "skills": ["SQL", "MVVM"],
    "languages": [
      {"language": "English", "level": "Fluent"},
      {"language": "French", "level": "Intermediate"}
    ],
    "education": [
      {
        "degree": "Engineering Degree",
        "institution": "MIT",
        "start_date": "2015-09",
        "end_date": "2019-06"
      }
    ],
    "experience": [
      {
        "title": ".NET Developer",
        "company": "TechCorp",
        "start_date": "2019-07",
        "end_date": "2023-08",
        "description": "Worked on mobile apps using .NET MAUI and Xamarin.",
        "type": "Full-time"
      }
    ],
    "years_of_experience": "4",
    "certifications": [
      {
        "certification": "Microsoft Certified: Azure Developer Associate",
        "obtention_date": "2022-03"
      }
    ]
  },
  "matching_result": {
    "skills_score": 0.75,
    "experience_score": 0.80,
    "education_score": 1.0,
    "language_score": 0.66,
    "certification_score": 0.5,
    "final_score": 0.74,
    "justification": "The candidate matches most skill and education requirements, with decent experience and language proficiency."
  }
}


