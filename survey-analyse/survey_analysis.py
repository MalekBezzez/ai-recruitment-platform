import pandas as pd
import torch
from transformers import XLMRobertaTokenizer, XLMRobertaForSequenceClassification
import re
import json
from typing import List, Optional, Dict
from pydantic import BaseModel, field_validator, ValidationError
import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse, FileResponse
from pathlib import Path
from contextlib import asynccontextmanager

# Modèle de données
from pydantic import BaseModel, Field, field_validator

class ResponseItem(BaseModel):
    questionId: int
    questionText: str
    questionType: str
    weight: float
    answer: str
    employeeId: int
    scale_max: int
    likert_labels: Dict[str, int] = Field(default=None, alias="likert_labels")
    questionnaireId: int

    @field_validator('likert_labels', mode='before')
    @classmethod
    def ensure_likert_labels(cls, v, info):
        """
        Si questionType == 'likert' et qu’on n’a pas de likert_labels,
        on génère par défaut {"1":1, "2":2, …, "scale_max": scale_max}
        """
        question_type = info.data.get('questionType')
        scale = info.data.get('scale_max') or 5
        if question_type == 'likert':
            if v is None:
                # génère les labels "1".."scale"
                return {str(i): i for i in range(1, scale + 1)}
            if not isinstance(v, dict):
                raise ValueError("likert_labels doit être un dict pour 'likert'")
        return v

    @field_validator('questionnaireId')
    @classmethod
    def validate_questionnaire_id(cls, v):
        if v <= 0:
            raise ValueError("questionnaireId doit être positif")
        return v

    @field_validator('questionType')
    @classmethod
    def validate_question_type(cls, v):
        valid = ["choice", "text", "boolean", "likert"]
        if v not in valid:
            raise ValueError(f"questionType doit être l'un de {valid}")
        return v

    @field_validator('weight')
    @classmethod
    def validate_weight(cls, v):
        if v <= 0:
            raise ValueError("weight doit être positif")
        return v

    @field_validator('scale_max')
    @classmethod
    def validate_scale_max(cls, v, info):
        qt = info.data.get('questionType')
        if qt in ['choice', 'likert'] and v < 1:
            raise ValueError("scale_max doit être >=1 pour 'choice' ou 'likert'")
        if qt == 'boolean' and v != 2:
            raise ValueError("scale_max doit être 2 pour 'boolean'")
        return v

    questionId: int
    questionText: str
    questionType: str
    weight: float
    answer: str
    employeeId: int
    scale_max: int
    likert_labels: Optional[Dict[str, int]] = None
    questionnaireId: int

    @field_validator('questionnaireId')
    @classmethod
    def validate_questionnaire_id(cls, v):
        if v <= 0:
            raise ValueError("questionnaireId doit être positif")
        return v

    @field_validator('questionType')
    @classmethod
    def validate_question_type(cls, v):
        valid_types = ["choice", "text", "boolean", "likert"]
        if v not in valid_types:
            raise ValueError(f"questionType doit être l'un de {valid_types}")
        return v

    @field_validator('weight')
    @classmethod
    def validate_weight(cls, v):
        if v <= 0:
            raise ValueError("weight doit être positif")
        return v

    @field_validator('scale_max')
    @classmethod
    def validate_scale_max(cls, v, info):
        question_type = info.data.get('questionType')
        if question_type in ['choice', 'likert'] and v < 1:
            raise ValueError("scale_max doit être >= 1 pour 'choice' ou 'likert'")
        elif question_type == 'boolean' and v != 2:
            raise ValueError("scale_max doit être 2 pour 'boolean'")
        return v

    @field_validator('likert_labels')
    @classmethod
    def validate_likert_labels(cls, v, info):
        question_type = info.data.get('questionType')
        scale_max = info.data.get('scale_max')
        if question_type == 'likert':
            if not v:
                raise ValueError("likert_labels requis pour 'likert'")
            if not isinstance(v, dict):
                raise ValueError("likert_labels doit être un dictionnaire {label: score}")
            if len(v) != scale_max:
                raise ValueError(f"likert_labels doit contenir {scale_max} labels")
            if not all(isinstance(label, str) and label.strip() and isinstance(score, int) and 1 <= score <= scale_max for label, score in v.items()):
                raise ValueError("Labels doivent être des chaînes non vides et scores des entiers entre 1 et scale_max")
        elif v:
            raise ValueError("likert_labels uniquement pour 'likert'")
        return v

def is_valid_text_response(text: str) -> bool:
    if not text or len(text.strip().split()) < 3:
        print(f"Réponse trop courte (moins de 3 mots) ou vide : '{text}'")
        return False
    number_pattern = r'^-?\d+(\.\d+)?$'
    date_patterns = [
        r'^\d{4}$',
        r'^\d{1,2}/\d{1,2}/\d{2,4}$',
        r'^\d{1,2}-\d{1,2}-\d{2,4}$',
        r'^\d{1,2}\s+(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s+\d{2,4}$',
    ]
    if re.match(number_pattern, text.strip()):
        print(f"Réponse numérique uniquement : '{text}' (non passée au modèle)")
        return False
    for pattern in date_patterns:
        if re.match(pattern, text.strip(), re.IGNORECASE):
            print(f"Réponse date uniquement : '{text}' (non passée au modèle)")
            return False
    return True

def predict_single_rating(text: str, model=None, tokenizer=None) -> Optional[int]:
    if not is_valid_text_response(text):
        return None
    try:
        inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=512)
        with torch.no_grad():
            logits = model(**inputs).logits
        p = torch.softmax(logits, dim=1)[0, 1].item()
        rating = 3 if p >= 0.5 else 1
        print(f"Texte: {text[:50]}..., Probabilité positive: {p:.3f}, Rating: {rating}/3")
        return rating
    except Exception as e:
        print(f"Erreur lors de la prédiction pour le texte '{text}' : {str(e)}")
        return None

def predict_batch_ratings(texts: List[str], model=None, tokenizer=None) -> List[Optional[int]]:
    valid_texts = [t for t in texts if is_valid_text_response(t)]
    if not valid_texts:
        print("Aucun texte valide dans le batch")
        return [None] * len(texts)
    try:
        inputs = tokenizer(valid_texts, return_tensors="pt", truncation=True, padding=True, max_length=512)
        with torch.no_grad():
            logits = model(**inputs).logits
        probs = torch.softmax(logits, dim=1)[:, 1].tolist()
        ratings = [3 if p >= 0.5 else 1 for p in probs]
        result = []
        valid_idx = 0
        for text in texts:
            if is_valid_text_response(text):
                result.append(ratings[valid_idx])
                valid_idx += 1
            else:
                result.append(None)
        print(f"Batch traité : {len(valid_texts)} textes valides sur {len(texts)}")
        return result
    except Exception as e:
        print(f"Erreur lors de la prédiction batch : {str(e)}")
        return [None] * len(texts)

def split_review(text: str) -> List[str]:
    if not text or not is_valid_text_response(text):
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
    parts = [p.strip() for p in text.split(',') if p.strip() and is_valid_text_response(p.strip())]
    print(f"Texte: {text[:50]}..., Parties: {parts}")
    return parts

def predict_rating(text: str, scale_max: int, model=None, tokenizer=None) -> Optional[int]:
    parts = split_review(text)
    if not parts:
        print(f"Aucune partie valide pour le texte : '{text}'")
        return None
    ratings = predict_batch_ratings(parts, model, tokenizer)
    valid_ratings = [r for r in ratings if r is not None]
    if not valid_ratings:
        print(f"Aucune prédiction valide pour le texte : '{text}'")
        return None
    positive_count = sum(1 for r in valid_ratings if r == 3)
    negative_count = sum(1 for r in valid_ratings if r == 1)
    result = 3 if positive_count > negative_count else 1 if negative_count > positive_count else 2
    print(f"Texte: {text[:50]}..., Ratings: {valid_ratings}, Résultat final: {result}")
    return result

def analyze(responses: List[ResponseItem], model=None, tokenizer=None):
    if not responses:
        raise ValueError("Aucune réponse fournie")

    df = pd.DataFrame([r.model_dump() for r in responses])
    print(f"DataFrame initial : \n{df}")

    if df['questionnaireId'].nunique() > 1:
        raise ValueError("questionnaireId unique requis")

    if (df['weight'] <= 0).any():
        df = df[df['weight'] > 0]
        if df.empty:
            raise ValueError("Aucune question avec poids positif")

    choice_likert_rows = df[df['questionType'].isin(['choice', 'likert'])]
    if not choice_likert_rows.empty:
        scale_max_values = choice_likert_rows['scale_max'].unique()
        if len(scale_max_values) > 1:
            raise ValueError(f"scale_max unique requis pour 'choice' et 'likert': {scale_max_values}")
        global_scale_max = scale_max_values[0]
    else:
        global_scale_max = 5
    print(f"global_scale_max: {global_scale_max}")

    def validate_answer(row):
        if row['questionType'] == 'choice':
            try:
                v = float(row['answer'])
                if not (1 <= v <= row['scale_max'] and v.is_integer()):
                    print(f"Réponse invalide pour questionId {row['questionId']}: {row['answer']} (échelle: 1-{row['scale_max']})")
                    return None
                return v
            except:
                print(f"Réponse non numérique pour questionId {row['questionId']}: {row['answer']}")
                return None
        elif row['questionType'] == 'text':
            return row['answer']
        elif row['questionType'] == 'boolean':
            answer = row['answer'].strip().lower()
            if answer in ['oui', 'vrai', 'yes', 'true']:
                return 2
            elif answer in ['non', 'faux', 'no', 'false']:
                return 1
            print(f"Réponse booléenne invalide pour questionId {row['questionId']}: {row['answer']}")
            return None
        elif row['questionType'] == 'likert':
            answer = row['answer'].strip().lower()
            likert_map = {label.lower(): score for label, score in row['likert_labels'].items()}
            if answer in likert_map:
                return likert_map[answer]
            print(f"Réponse Likert invalide pour questionId {row['questionId']}: {row['answer']}")
            return None
        return None

    df['validated_answer'] = df.apply(validate_answer, axis=1)
    print(f"Après validation : \n{df[['questionId', 'questionType', 'answer', 'validated_answer']]}")

    if df['validated_answer'].isna().all():
        raise ValueError("Aucune réponse valide après validation")

    for i, row in df.iterrows():
        if row['questionType'] == 'text' and pd.notnull(row['validated_answer']):
            try:
                predicted_rating = predict_rating(
                    text=str(row['validated_answer']),
                    scale_max=global_scale_max,
                    model=model,
                    tokenizer=tokenizer
                )
                df.at[i, 'validated_answer'] = float(predicted_rating) if predicted_rating is not None else None
                print(f"QuestionId {row['questionId']}, Texte: {str(row['validated_answer'])[:50]}..., Prédiction: {predicted_rating}")
            except Exception as e:
                print(f"Erreur lors de la prédiction pour questionId {row['questionId']} : {str(e)}")
                df.at[i, 'validated_answer'] = None

    df['answer_numeric'] = pd.to_numeric(df['validated_answer'], errors='coerce').astype('float64')
    df['weight'] = pd.to_numeric(df['weight'], errors='coerce').astype('float64')
    df['scale_max'] = pd.to_numeric(df['scale_max'], errors='coerce').astype('int64')
    print(f"Après prédiction : \n{df[['questionId', 'questionType', 'answer_numeric', 'weight', 'scale_max']]}")
    print(f"Types de données avant pivot : \n{df.dtypes}")

    calc_qids = df[df['questionType'].isin(['choice', 'text', 'boolean', 'likert'])]['questionId'].unique()
    if len(calc_qids) == 0:
        raise ValueError("Aucune question valide pour le calcul des scores")
    print(f"calc_qids : {calc_qids}")

    try:
        pivot = df[df['questionId'].isin(calc_qids)].pivot_table(
            index='employeeId',
            columns='questionId',
            values=['answer_numeric', 'weight', 'scale_max'],
            aggfunc='first'
        )
        pivot.columns = [f"{c[0]}_q{c[1]}" for c in pivot.columns]
        pivot.reset_index(inplace=True)
        print(f"DataFrame pivoté : \n{pivot}")
    except Exception as e:
        print(f"Erreur lors de la création du pivot : {str(e)}")
        raise

    weights = {f"answer_numeric_q{qid}": float(df[df['questionId'] == qid]['weight'].iloc[0]) for qid in calc_qids}
    num_cols = [f"answer_numeric_q{qid}" for qid in calc_qids]
    total_weight = sum(weights.values())
    print(f"Poids : {weights}, Total poids : {total_weight}")

    def global_pct(row):
        s = w = 0
        for col in num_cols:
            val = row.get(col)
            if pd.notnull(val):
                val = float(val)
                qid = int(col.split('_q')[1])
                q_type = df[df['questionId'] == qid]['questionType'].iloc[0]
                scale_max = 2 if q_type == 'boolean' else 3 if q_type == 'text' else global_scale_max
                norm_val = (val / scale_max) * global_scale_max
                wgt = weights.get(col, 0) / total_weight
                s += norm_val * wgt
                w += wgt
                print(f"Colonne: {col}, Valeur: {val}, Type: {q_type}, Scale_max: {scale_max}, Norm_val: {norm_val}, Poids: {wgt}")
        result = round((s / global_scale_max) * 100, 2) if w > 0 else 0
        print(f"Global_pct résultat : {result}")
        return result

    def adjusted_pct(row):
        s = w = 0
        for col in num_cols:
            val = row.get(col)
            if pd.notnull(val):
                val = float(val)
                qid = int(col.split('_q')[1])
                q_type = df[df['questionId'] == qid]['questionType'].iloc[0]
                scale_max = 2 if q_type == 'boolean' else 3 if q_type == 'text' else global_scale_max
                is_positive = (
                    (q_type in ['choice', 'likert'] and val >= scale_max * 0.6) or
                    (q_type == 'boolean' and val == 2) or
                    (q_type == 'text' and val == 3)
                )
                if is_positive:
                    norm_val = (val / scale_max) * global_scale_max
                    wgt = weights.get(col, 0) / total_weight
                    wgt_adjusted = wgt * 0.5 if (q_type in ['choice', 'likert'] and val == scale_max * 0.6) else wgt
                    s += norm_val * wgt_adjusted
                    w += wgt_adjusted
                    print(f"Colonne: {col}, Valeur: {val}, Type: {q_type}, Positive: {is_positive}, Norm_val: {norm_val}, Poids ajusté: {wgt_adjusted}")
        result = round((s / global_scale_max) * 100, 2) if w > 0 else 0
        print(f"Adjusted_pct résultat : {result}")
        return result

    def dissatisfaction_pct(row):
        s = w = 0
        for col in num_cols:
            val = row.get(col)
            if pd.notnull(val):
                val = float(val)
                qid = int(col.split('_q')[1])
                q_type = df[df['questionId'] == qid]['questionType'].iloc[0]
                scale_max = 2 if q_type == 'boolean' else 3 if q_type == 'text' else global_scale_max
                is_negative = (
                    (q_type in ['choice', 'likert'] and val <= scale_max * 0.4) or
                    (q_type == 'boolean' and val == 1) or
                    (q_type == 'text' and val == 1)
                )
                if is_negative:
                    norm_val = (1 - val / scale_max) * global_scale_max
                    wgt = weights.get(col, 0) / total_weight
                    s += norm_val * wgt
                    w += wgt
                    print(f"Colonne: {col}, Valeur: {val}, Type: {q_type}, Négatif: {is_negative}, Norm_val: {norm_val}, Poids: {wgt}")
        result = round((s / global_scale_max) * 100, 2) if w > 0 else 0
        print(f"Dissatisfaction_pct résultat : {result}")
        return result

    def causes(row, pos=True, neutral=False):
        lst = []
        for col in num_cols:
            val = row.get(col)
            if pd.notnull(val):
                val = float(val)
                qid = int(col.split('_q')[1])
                q_type = df[df['questionId'] == qid]['questionType'].iloc[0]
                scale_max = 2 if q_type == 'boolean' else 3 if q_type == 'text' else global_scale_max
                is_limit = (q_type in ['choice', 'likert'] and val == scale_max * 0.6)
                if neutral:
                    cond = (q_type in ['choice', 'likert'] and scale_max * 0.4 < val < scale_max * 0.6) or \
                           (q_type == 'text' and val == 2)
                else:
                    cond = (
                        (q_type in ['choice', 'likert'] and val >= scale_max * 0.6) or
                        (q_type == 'boolean' and val == 2) or
                        (q_type == 'text' and val == 3)
                    ) if pos else (
                        (q_type in ['choice', 'likert'] and val <= scale_max * 0.4) or
                        (q_type == 'boolean' and val == 1) or
                        (q_type == 'text' and val == 1)
                    )
                if cond:
                    text = df[df['questionId'] == qid]['questionText'].iloc[0]
                    annotation = " (limite)" if pos and is_limit else " (neutre)" if neutral else ""
                    lst.append(f"{text} (Score: {val}/{scale_max}{annotation})")
        result = '; '.join(lst) or "Aucune cause significative"
        print(f"Causes ({'positives' if pos else 'négatives' if not neutral else 'neutres'}) : {result}")
        return result

    results = []
    for _, r in pivot.iterrows():
        result = {
            'employeeId': int(r['employeeId']),
            'questionnaireId': int(df['questionnaireId'].iloc[0]),
            'global_satisfaction_%': global_pct(r),
            'adjusted_satisfaction_%': adjusted_pct(r),
            'dissatisfaction_score_%': dissatisfaction_pct(r),
            'satisfaction_causes': causes(r, pos=True, neutral=False),
            'dissatisfaction_causes': causes(r, pos=False, neutral=False),
            'neutral_causes': causes(r, pos=False, neutral=True)
        }
        results.append(result)
        print(f"Résultat pour employé {r['employeeId']}: {result}")

    return results

def load_responses_from_json(file_path: str) -> List[ResponseItem]:
    if not os.path.exists(file_path):
        raise ValueError(f"Le fichier {file_path} n'existe pas")

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        if not isinstance(data, list):
            raise ValueError("Le fichier JSON doit contenir une liste d'objets")

        if not data:
            raise ValueError("Le fichier JSON est vide")

        required_keys = {'questionId', 'questionText', 'questionType', 'weight', 'answer',
                        'employeeId', 'scale_max', 'questionnaireId'}
        for item in data:
            if not isinstance(item, dict):
                raise ValueError("Chaque élément du JSON doit être un objet")
            if not all(key in item for key in required_keys):
                missing = required_keys - set(item.keys())
                raise ValueError(f"Objet JSON manquant les clés requises : {missing}")

        responses = [ResponseItem(**item) for item in data]
        return responses

    except json.JSONDecodeError as e:
        raise ValueError(f"Format JSON invalide : {str(e)}")
    except ValidationError as e:
        raise ValueError(f"Erreur de validation des données JSON pour ResponseItem : {str(e)}")
    except Exception as e:
        raise ValueError(f"Erreur inattendue lors du chargement du fichier JSON : {str(e)}")

# Configuration loading
def load_config(config_path: str = "config.json") -> Dict:
    if not os.path.exists(config_path):
        raise ValueError(f"Le fichier de configuration {config_path} n'existe pas")
    with open(config_path, 'r', encoding='utf-8') as f:
        config = json.load(f)
    required_keys = {"input_json_path", "model_path", "output_json_path"}
    if not all(key in config for key in required_keys):
        missing = required_keys - set(config.keys())
        raise ValueError(f"Clés manquantes dans config.json : {missing}")
    return config

# FastAPI application
app = FastAPI(title="Employee Questionnaire Analysis API")

# Global model and tokenizer (loaded once at startup)
# Global model and tokenizer
model = None
tokenizer = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global model, tokenizer
    try:
        config = load_config()
        model_path = config["model_path"]
        model = XLMRobertaForSequenceClassification.from_pretrained(model_path)
        tokenizer = XLMRobertaTokenizer.from_pretrained(model_path)
        print(f"Modèle et tokenizer chargés avec succès depuis {model_path}")
        yield
    except Exception as e:
        print(f"Erreur lors du chargement du modèle/tokenizer : {str(e)}")
        raise

app = FastAPI(title="Employee Questionnaire Analysis API", lifespan=lifespan)

@app.post("/analyze/", response_model=List[Dict])
async def analyze_questionnaire(file: UploadFile = File(...)):
    try:
        # Validate file type
        if not file.filename.endswith('.json'):
            raise HTTPException(status_code=400, detail="Le fichier doit être au format JSON")

        # Load configuration
        config = load_config()

        # Save uploaded file temporarily
        input_path = config["input_json_path"]
        os.makedirs(os.path.dirname(input_path), exist_ok=True)
        with open(input_path, "wb") as f:
            f.write(await file.read())

        # Process the file
        responses = load_responses_from_json(input_path)
        valid_types = {'choice', 'likert', 'boolean', 'text'}
        invalid_types = set(r.questionType for r in responses) - valid_types
        if invalid_types:
            print(f"Attention : types de questions non pris en charge détectés : {invalid_types}")

        results = analyze(responses, model, tokenizer)

        # Save results to output path
        output_path = config["output_json_path"]
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)

        print(f"Résultats sauvegardés dans {output_path}")

        # Return results
        return results

    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Erreur de validation : {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur serveur : {str(e)}")

@app.get("/download-results/")
async def download_results():
    try:
        config = load_config()
        output_path = config["output_json_path"]
        if not os.path.exists(output_path):
            raise HTTPException(status_code=404, detail="Aucun fichier de résultats trouvé")
        return FileResponse(output_path, filename="employee_analysis_results.json")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors du téléchargement : {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)