from fastapi import FastAPI, Request, HTTPException
from pydantic import BaseModel, validator
from typing import List, Optional
import pandas as pd
import torch
from transformers import XLMRobertaTokenizer, XLMRobertaForSequenceClassification
import re
import json
import logging
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Modèle et tokenizer
 model_path = "C:/Users/mustapha/Desktop/HR-platforme-Microservice/HR-Platform/survey-analyse"
# model_path = "/app/survey-analyse"
try:
    model = XLMRobertaForSequenceClassification.from_pretrained(model_path)
    tokenizer = XLMRobertaTokenizer.from_pretrained(model_path)
    logger.info("Modèle et tokenizer chargés avec succès")
except Exception as e:
    logger.error(f"Erreur lors du chargement du modèle/tokenizer : {str(e)}")
    raise Exception(f"Impossible de charger le modèle : {str(e)}")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # ou ["*"] pour tout autoriser
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
async def root():
    return {"message": "Bienvenue sur l'API d'analyse de questionnaires"}

# Modèle de données
class ResponseItem(BaseModel):
    questionId: int
    questionText: str
    questionType: str
    weight: float
    answer: str
    employeeId: int
    scale_max: int = 5
    likert_labels: Optional[List[str]] = None  # Liste ordonnée pour les labels Likert
    questionnaireId: int
    @validator('questionnaireId')
    def validate_questionnaire_id(cls, v):
        if v <= 0:
            raise ValueError("questionnaireId doit être un entier positif")
        return v
    @validator('questionType')
    def validate_question_type(cls, v):
        valid_types = ["choice", "text", "date", "boolean", "likert"]
        if v not in valid_types:
            raise ValueError(f"questionType doit être l'un de {valid_types}")
        return v

    @validator('scale_max')
    def validate_scale_max(cls, v, values):
        question_type = values.get('questionType')
        if question_type in ['choice', 'likert'] and v < 1:
            raise ValueError("scale_max doit être supérieur ou égal à 1 pour les questions de type 'choice' ou 'likert'")
        elif question_type == 'boolean' and v != 2:
            raise ValueError("scale_max doit être égal à 2 pour les questions de type 'boolean'")
        return v

    @validator('likert_labels')
    def validate_likert_labels(cls, v, values):
        if values.get('questionType') == 'likert':
            if not v:
                raise ValueError("likert_labels est requis pour les questions de type 'likert'")
            scale_max = values.get('scale_max', 5)
            if len(v) != scale_max:
                raise ValueError(f"likert_labels doit contenir exactement {scale_max} labels")
            if not all(isinstance(label, str) and label.strip() for label in v):
                raise ValueError("Tous les labels doivent être des chaînes non vides")
        elif v:
            raise ValueError("likert_labels ne doit être fourni que pour les questions de type 'likert'")
        return v

def is_valid_text_response(text: str) -> bool:
    """
    Vérifie si une réponse de type 'text' est un texte narratif valide (non numérique, non date).
    
    Args:
        text (str): La réponse à valider.
    
    Returns:
        bool: True si la réponse est un texte narratif valide, False sinon.
    """
    if not text or len(text.strip()) < 3:
        logger.warning(f"Réponse trop courte ou vide : '{text}'")
        return False

    number_pattern = r'^-?\d+(\.\d+)?$'
    if re.match(number_pattern, text.strip()):
        logger.warning(f"Réponse détectée comme numérique : '{text}'")
        return False

    date_patterns = [
        r'^\d{4}$',
        r'^\d{1,2}/\d{1,2}/\d{2,4}$',
        r'^\d{1,2}-\d{1,2}-\d{2,4}$',
        r'^\d{1,2}\s+(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s+\d{2,4}$',
    ]
    for pattern in date_patterns:
        if re.match(pattern, text.strip(), re.IGNORECASE):
            logger.warning(f"Réponse détectée comme date : '{text}'")
            return False

    return True

def predict_single_rating(text: str, scale_max: int = 5) -> Optional[int]:
    """
    Prédit une note pour un texte donné.
    
    Args:
        text (str): Texte à évaluer.
        scale_max (int): Échelle maximale pour la prédiction.
    
    Returns:
        Optional[int]: Note de 1 à scale_max, ou None si le texte est invalide ou en cas d'erreur.
    """
    if not is_valid_text_response(text):
        logger.warning(f"Texte invalide pour prédiction : '{text}', réponse ignorée")
        return None
    try:
        inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=512)
        with torch.no_grad():
            logits = model(**inputs).logits
        p = torch.softmax(logits, dim=1)[0, 1].item()
        rating = round(1 + (scale_max - 1) * p)
        return max(1, min(scale_max, rating))
    except Exception as e:
        logger.error(f"Erreur lors de la prédiction pour le texte '{text}' : {str(e)}")
        return None

def predict_batch_ratings(texts: List[str], scale_max: int = 5) -> List[Optional[int]]:
    """
    Prédit des notes pour un lot de textes en une seule passe.
    
    Args:
        texts (List[str]): Liste des textes à évaluer.
        scale_max (int): Échelle maximale pour la prédiction.
    
    Returns:
        List[Optional[int]]: Liste des notes prédites (1 à scale_max, ou None pour les textes invalides).
    """
    valid_texts = [t for t in texts if is_valid_text_response(t)]
    if not valid_texts:
        logger.warning(f"Aucun texte valide dans le batch, toutes les réponses ignorées")
        return [None] * len(texts)
    
    try:
        inputs = tokenizer(valid_texts, return_tensors="pt", truncation=True, padding=True, max_length=512)
        with torch.no_grad():
            logits = model(**inputs).logits
        probs = torch.softmax(logits, dim=1)[:, 1].tolist()
        
        ratings = [round(1 + (scale_max - 1) * p) for p in probs]
        ratings = [max(1, min(scale_max, r)) for r in ratings]
        
        result = []
        valid_idx = 0
        for text in texts:
            if is_valid_text_response(text):
                result.append(ratings[valid_idx])
                valid_idx += 1
            else:
                result.append(None)
        logger.info(f"Batch traité : {len(valid_texts)} textes valides sur {len(texts)}")
        return result
    except Exception as e:
        logger.error(f"Erreur lors de la prédiction batch : {str(e)}")
        return [None] * len(texts)

def split_review(text: str) -> List[str]:
    """
    Divise un texte en parties en fonction des connecteurs.
    
    Args:
        text (str): Texte à diviser.
    
    Returns:
        List[str]: Liste des parties du texte.
    """
    if not text:
        return []
    conn = (
        r'\b(mais|cependant|however|par contre|néanmoins|nonetheless|'
        r'toutefois|pourtant|en revanche|au contraire|bien que|quoique|même si|'
        r'malgré cela|malgré tout|or|seulement|alors que|tandis que|en dépit de|'
        r"d'un autre côté|à l'opposé|but|nevertheless|yet|although|though|"
        r'even though|while|whereas|on the other hand|on the contrary|despite that|'
        r'in spite of that|still|albeit|conversely|even so)\b'
    )
    text = re.sub(conn, ',', text, flags=re.IGNORECASE)
    return [p.strip() for p in text.split(',') if p.strip()]

def predict_rating(text: str, scale_max: int = 5) -> Optional[int]:
    """
    Calcule une note moyenne pour un texte divisé en parties, en utilisant le batching.
    
    Args:
        text (str): Texte à évaluer.
        scale_max (int): Échelle maximale pour la prédiction.
    
    Returns:
        Optional[int]: Note moyenne arrondie, ou None si aucune partie valide.
    """
    parts = split_review(text)
    if not parts:
        logger.warning(f"Aucune partie valide pour le texte : '{text}', réponse ignorée")
        return None
    ratings = predict_batch_ratings(parts, scale_max)
    valid_ratings = [r for r in ratings if r is not None]
    if not valid_ratings:
        logger.warning(f"Aucune prédiction valide pour le texte : '{text}', réponse ignorée")
        return None
    return round(sum(valid_ratings) / len(valid_ratings))

@app.post("/analyze")
async def analyze(responses: List[ResponseItem]):
    """
    Analyse les réponses d'un questionnaire et calcule les scores de satisfaction.
    
    Args:
        responses (List[ResponseItem]): Liste des réponses au questionnaire.
    
    Returns:
        List[dict]: Résultats avec les scores de satisfaction par employé.
    
    Raises:
        HTTPException: En cas d'erreur client ou serveur.
    """
    try:
        if not responses:
            raise HTTPException(status_code=400, detail="Aucune réponse fournie")

        # Validate that all questionnaireIds are identical
        df = pd.DataFrame([r.dict() for r in responses])
        if df['questionnaireId'].nunique() > 1:
            raise HTTPException(
                status_code=400,
                detail="Toutes les réponses doivent appartenir au même questionnaire (questionnaireId unique requis)"
            )

        # Validation des poids et exclusion des questions avec poids <= 0
        if (df['weight'] <= 0).any():
            invalid_questions = df[df['weight'] <= 0][['questionId', 'questionText', 'weight']].to_dict('records')
            logger.warning(f"Poids négatifs ou nuls détectés, questions ignorées : {invalid_questions}")
            df = df[df['weight'] > 0]
            if df.empty:
                raise HTTPException(
                    status_code=400,
                    detail="Aucune question valide avec un poids positif détectée"
                )

        # Validation de la cohérence de scale_max pour choice et likert
        choice_likert_rows = df[df['questionType'].isin(['choice', 'likert'])]
        if not choice_likert_rows.empty:
            scale_max_values = choice_likert_rows['scale_max'].unique()
            if len(scale_max_values) > 1:
                raise HTTPException(
                    status_code=400,
                    detail=f"Toutes les questions de type 'choice' et 'likert' doivent avoir le même scale_max. Valeurs trouvées : {scale_max_values}"
                )
            global_scale_max = scale_max_values[0]
        else:
            global_scale_max = 5

        # Validation des réponses en fonction du questionType
        def validate_answer(row):
            if row['questionType'] == 'choice':
                try:
                    v = float(row['answer'])
                    scale_max = row['scale_max']
                    if not (1 <= v <= scale_max and v.is_integer()):
                        logger.warning(f"Réponse invalide pour questionId {row['questionId']}: {row['answer']} (échelle: 1-{scale_max})")
                        return None
                    return v
                except:
                    logger.warning(f"Réponse non numérique pour questionId {row['questionId']}: {row['answer']}")
                    return None
            elif row['questionType'] == 'text':
                return row['answer']
            elif row['questionType'] == 'date':
                return row['answer']
            elif row['questionType'] == 'boolean':
                answer = row['answer'].strip().lower()
                if answer in ['oui', 'vrai', 'yes', 'true']:
                    return row['scale_max']
                elif answer in ['non', 'faux', 'no', 'false']:
                    return 1
                else:
                    logger.warning(f"Réponse booléenne invalide pour questionId {row['questionId']}: {row['answer']}")
                    return None
            elif row['questionType'] == 'likert':
                answer = row['answer'].strip().lower()
                scale_max = row['scale_max']
                likert_labels = row['likert_labels']
                likert_map = {label.lower(): scale_max - i for i, label in enumerate(likert_labels)}
                if answer in likert_map:
                    return likert_map[answer]
                else:
                    logger.warning(f"Réponse Likert invalide pour questionId {row['questionId']}: {row['answer']}")
                    return None
            return row['answer']

        df['validated_answer'] = df.apply(validate_answer, axis=1)

        # Prédictions pour les réponses textuelles
        for i, row in df.iterrows():
            if row['questionType'] == 'text' and pd.notnull(row['validated_answer']):
                try:
                    predicted_rating = predict_rating(row['validated_answer'], row['scale_max'])
                    if predicted_rating is not None:
                        df.at[i, 'validated_answer'] = str(predicted_rating)
                    else:
                        df.at[i, 'validated_answer'] = None
                except Exception as e:
                    logger.error(f"Erreur lors de la prédiction pour questionId {row['questionId']} : {str(e)}")
                    df.at[i, 'validated_answer'] = None

        # Conversion des colonnes en numérique pour les calculs
        df['answer_numeric'] = pd.to_numeric(df['validated_answer'], errors='coerce')
        df['weight'] = pd.to_numeric(df['weight'], errors='coerce')

        # Filtrer les questions utilisées pour les calculs (exclure 'date')
        calc_qids = df[df['questionType'].isin(['choice', 'text', 'boolean', 'likert'])]['questionId'].unique()

        # Pivot pour organiser les données
        pivot = df[df['questionId'].isin(calc_qids)].pivot_table(
            index='employeeId', columns='questionId', values=['answer_numeric', 'weight', 'scale_max'], aggfunc='first'
        )
        pivot.columns = [f"{c[0]}_q{c[1]}" for c in pivot.columns]
        pivot.reset_index(inplace=True)

        # Préparation des poids
        weights = {}
        for qid in calc_qids:
            q_data = df[df['questionId'] == qid][['weight']].iloc[0]
            weights[f"answer_numeric_q{qid}"] = q_data['weight']

        num_cols = [f"answer_numeric_q{qid}" for qid in calc_qids]

        def global_pct(row):
            s = w = 0
            for col, wgt in weights.items():
                val = row.get(col)
                if pd.notnull(val):
                    qid = int(col.split('_q')[1])
                    q_type = df[df['questionId'] == qid]['questionType'].iloc[0]
                    scale_max = 2 if q_type == 'boolean' else global_scale_max
                    s += (val / scale_max) * wgt
                    w += wgt
            return round((s / w) * 100, 2) if w > 0 else 0

        def adjusted_pct(row):
            tot_w = sum(weights.get(col, 0) for col in num_cols)
            s = vw = 0
            for col in num_cols:
                val = row.get(col)
                if pd.notnull(val):
                    qid = int(col.split('_q')[1])
                    q_type = df[df['questionId'] == qid]['questionType'].iloc[0]
                    scale_max = 2 if q_type == 'boolean' else global_scale_max
                    if val >= scale_max * 0.6:
                        wgt = weights.get(col, 0)
                        s += (val / scale_max) * (wgt / tot_w)
                        vw += wgt
            return round(s * 100 / vw, 2) if vw > 0 else 0

        def dissatisfaction_pct(row):
            scores, cnt = 0, 0
            for col in num_cols:
                val = row.get(col)
                if pd.notnull(val):
                    qid = int(col.split('_q')[1])
                    q_type = df[df['questionId'] == qid]['questionType'].iloc[0]
                    scale_max = 2 if q_type == 'boolean' else global_scale_max
                    if val <= scale_max * 0.6:
                        scores += (1 - val / scale_max)
                        cnt += 1
            return round((scores / cnt) * 100, 2) if cnt > 0 else 0

        def causes(row, pos=True):
            lst = []
            for col in num_cols:
                val = row.get(col)
                if pd.notnull(val):
                    qid = int(col.split('_q')[1])
                    q_type = df[df['questionId'] == qid]['questionType'].iloc[0]
                    scale_max = 2 if q_type == 'boolean' else global_scale_max
                    cond = (val >= scale_max * 0.6) if pos else (val <= scale_max * 0.4)
                    if cond:
                        text = df[df['questionId'] == qid]['questionText'].iloc[0]
                        lst.append(f"{text} (Score: {val}/{scale_max})")
            return '; '.join(lst[:3]) or "Aucune cause significative"

        results = []
        for _, r in pivot.iterrows():
            employee_id = int(r['employeeId'])
            questionnaire_id = int(df['questionnaireId'].iloc[0])

            result = {
                'employeeId': employee_id,
                'questionnaireId': questionnaire_id,
                'global_satisfaction_%': global_pct(r),
                'adjusted_satisfaction_%': adjusted_pct(r),
                'dissatisfaction_score_%': dissatisfaction_pct(r),
                'satisfaction_causes': causes(r, pos=True),
                'dissatisfaction_causes': causes(r, pos=False)
            }
            results.append(result)

        # Sauvegarder les résultats localement
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_file = f"/app/results/results_{timestamp}.json"
        try:
            with open(output_file, "w", encoding="utf-8") as f:
                json.dump({
                    "timestamp": timestamp,
                    "response_count": len(responses),
                    "results": results
                }, f, indent=2, ensure_ascii=False)
            logger.info(f"Résultats sauvegardés dans {output_file}")
        except Exception as e:
            logger.error(f"Erreur lors de la sauvegarde des résultats : {str(e)}")

        return results

    except Exception as e:
        logger.error(f"Erreur lors de l'analyse : {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erreur serveur : {str(e)}")