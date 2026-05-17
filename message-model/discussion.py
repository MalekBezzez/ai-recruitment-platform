import torch
import torch.nn as nn
from transformers import XLMRobertaModel, XLMRobertaTokenizer
import pandas as pd
import numpy as np
import os
import json
import joblib
from torch.utils.data import DataLoader, TensorDataset
from torch.cuda.amp import autocast
import uuid


# Mappings
sentiment_mapping = {
    0: 'Negative', 1: 'Neutral', 2: 'Positive'
}

emotion_mapping = {
    0: 'Attention', 1: 'Calme', 2: 'Collaboration', 3: 'Colère', 4: 'Confiance',
    5: 'Confusion', 6: 'Curiosité', 7: 'Demande', 8: 'Doute', 9: 'Déception',
    10: 'Effort', 11: 'Embarras', 12: 'Encouragement', 13: 'Ennui', 14: 'Enthousiasme',
    15: 'Fatigue', 16: 'Feedback', 17: 'Fierté', 18: 'Frustration', 19: 'Gratitude',
    20: 'Joie', 21: 'Neutre', 22: 'Optimisme', 23: 'Planification', 24: 'Politesse',
    25: 'Professionnalisme', 26: 'Regret', 27: 'Sarcasme', 28: 'Stress', 29: 'Surprise',
    30: 'Sympathie', 31: 'Tristesse'
}

emotion_mapping_en = {
    0: 'Attention', 1: 'Calm', 2: 'Collaboration', 3: 'Anger', 4: 'Confidence',
    5: 'Confusion', 6: 'Curiosity', 7: 'Request', 8: 'Doubt', 9: 'Disappointment',
    10: 'Effort', 11: 'Embarrassment', 12: 'Encouragement', 13: 'Boredom', 14: 'Enthusiasm',
    15: 'Fatigue', 16: 'Feedback', 17: 'Pride', 18: 'Frustration', 19: 'Gratitude',
    20: 'Joy', 21: 'Neutral', 22: 'Optimism', 23: 'Planning', 24: 'Politeness',
    25: 'Professionalism', 26: 'Regret', 27: 'Sarcasm', 28: 'Stress', 29: 'Surprise',
    30: 'Sympathy', 31: 'Sadness'
}

topic_mapping = {
    0: 'Ambiance', 1: 'Délais', 2: 'Fichiers', 3: 'Formation', 4: 'Gestion de projet',
    5: 'Marketing', 6: 'Météo', 7: 'Pause', 8: 'Performance au travail',
    9: 'Problème Technique', 10: 'Présentation', 11: 'Ressources Humaines',
    12: 'Réunion', 13: 'Santé', 14: 'Service client', 15: 'Technologie',
    16: 'Vie personnelle', 17: 'Échange professionnel', 18: 'Événement'
}

topic_mapping_en = {
    0: 'Ambience', 1: 'Deadlines', 2: 'Files', 3: 'Training', 4: 'Project Management',
    5: 'Marketing', 6: 'Weather', 7: 'Break', 8: 'Work Performance',
    9: 'Technical Problem', 10: 'Presentation', 11: 'Human Resources',
    12: 'Meeting', 13: 'Health', 14: 'Customer Service', 15: 'Technology',
    16: 'Personal Life', 17: 'Professional Exchange', 18: 'Event'
}

general_emotion_mapping = {
    'Attention': 'Interactions & Communication',
    'Calme': "Mixed Feelings",  
    'Collaboration': 'Interactions & Communication',
    'Colère': 'Distress Emotions',
    'Confiance': 'Well-being Emotions',
    'Confusion': 'Distress Emotions',
    'Curiosité': 'Interactions & Communication',
    'Demande': 'Interactions & Communication',
    'Doute': 'Distress Emotions',
    'Déception': 'Distress Emotions',
    'Effort': 'Effort or Intention Emotions',  
    'Embarras': 'Distress Emotions',
    'Encouragement': 'Well-being Emotions',
    'Ennui': 'Distress Emotions',
    'Enthousiasme': 'Well-being Emotions',
    'Fatigue': "Mixed Feelings",  
    'Feedback': 'Interactions & Communication',
    'Fierté': 'Well-being Emotions',
    'Frustration': 'Distress Emotions',
    'Gratitude': 'Well-being Emotions',
    'Joie': 'Well-being Emotions',
    'Neutre': "Mixed Feelings",
    'Optimisme': 'Well-being Emotions',
    'Planification': 'Effort or Intention Emotions',  
    'Politesse': 'Interactions & Communication',
    'Professionnalisme': "Mixed Feelings",  
    'Regret': 'Distress Emotions',
    'Sarcasme': "Mixed Feelings",  
    'Stress': 'Distress Emotions',
    'Surprise': "Mixed Feelings",  
    'Sympathie': 'Interactions & Communication',
    'Tristesse': 'Distress Emotions'
}

general_topic_mapping = {
    'Délais': 'Work & Projects',
    'Formation': 'Work & Projects',
    'Gestion de projet': 'Work & Projects',
    'Réunion': 'Work & Projects',
    'Performance au travail': 'Work & Projects',
    'Présentation': 'Work & Projects',
    'Ressources Humaines': 'Human Resources',
    'Technologie': 'Technical & Tools',
    'Problème Technique': 'Technical & Tools',
    'Fichiers': 'Technical & Tools',
    'Service client': 'Client / Business',
    'Marketing': 'Client / Business',
    'Vie personnelle': 'Daily Life',
    'Santé': 'Daily Life',
    'Pause': 'Daily Life',
    'Météo': 'Daily Life',
    'Ambiance': "Team Life",
    'Échange professionnel': "Team Life",
    'Événement': "Team Life"
}


class MultiTaskClassifier(nn.Module):
    def __init__(self, num_sentiment, num_emotion, num_topic, model_name='xlm-roberta-base'):
        super(MultiTaskClassifier, self).__init__()
        self.roberta = XLMRobertaModel.from_pretrained(model_name)
        self.dropout = nn.Dropout(0.1)
        self.sentiment_classifier = nn.Linear(self.roberta.config.hidden_size, num_sentiment)
        self.emotion_classifier = nn.Linear(self.roberta.config.hidden_size, num_emotion)
        self.topic_classifier = nn.Linear(self.roberta.config.hidden_size, num_topic)

    def forward(self, input_ids, attention_mask):
        outputs = self.roberta(input_ids=input_ids, attention_mask=attention_mask)
        pooled_output = outputs.pooler_output
        pooled_output = self.dropout(pooled_output)
        return (
            self.sentiment_classifier(pooled_output),
            self.emotion_classifier(pooled_output),
            self.topic_classifier(pooled_output)
        )

def load_tokenizer(encoder_path=None, model_type='xlm-roberta-base'):
    """
    Load tokenizer with multiple fallback strategies
    """
    print("🔄 Loading tokenizer...")
    
    # Strategy 1: Try to load from saved file
    if encoder_path and os.path.exists(encoder_path):
        try:
            print(f"Attempting to load tokenizer from: {encoder_path}")
            loaded_tokenizer = joblib.load(encoder_path)
            
            # Check if it's actually a XLMRobertaTokenizer
            if isinstance(loaded_tokenizer, XLMRobertaTokenizer):
                print("✅ Successfully loaded saved tokenizer")
                return loaded_tokenizer
            else:
                print(f"⚠️ Loaded object is not XLMRobertaTokenizer (type: {type(loaded_tokenizer)})")
        except Exception as e:
            print(f"❌ Error loading saved tokenizer: {e}")
    
    # Strategy 2: Load from pretrained and cache
    try:
        print("🔄 Loading pretrained tokenizer...")
        tokenizer = XLMRobertaTokenizer.from_pretrained(model_type)
        
        # Try to cache the tokenizer for future use
        if encoder_path:
            try:
                joblib.dump(tokenizer, encoder_path)
                print(f"✅ Cached tokenizer to: {encoder_path}")
            except Exception as cache_error:
                print(f"⚠️ Warning: Could not cache tokenizer: {cache_error}")
        
        print("✅ Successfully loaded pretrained tokenizer")
        return tokenizer
        
    except Exception as e:
        print(f"❌ Error loading pretrained tokenizer: {e}")
        raise ValueError(f"Failed to load tokenizer: {e}")

def run_discussion(input_data, id_test=None):
    try:
        print("🚀 Starting discussion analysis...")
        if not id_test:
            id_test = str(uuid.uuid4())
        print(f"🆔 Generated Test ID: {id_test}")
        # Load configuration
        print("📖 Loading configuration...")
        with open('config.json', 'r', encoding='utf-8') as f:
            config = json.load(f)
        model_paths = config['model_paths']
        
        # Validate input data
        if not input_data or len(input_data) == 0:
            raise ValueError("No input data provided")
        
        print(f"📊 Processing {len(input_data)} messages")
        
        # Load tokenizer with robust fallback
        tokenizer = load_tokenizer(model_paths['sentiment_encoder'])
        
        # Prepare data
        data = pd.DataFrame(input_data)
        
        # Validate required columns
        required_columns = ['employee_id', 'employee_name', 'message_text']
        missing_columns = [col for col in required_columns if col not in data.columns]
        if missing_columns:
            raise ValueError(f"Missing required columns: {missing_columns}")
        
        device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        print(f"🔧 Using device: {device}")

        # Initialize model
        print("🤖 Initializing model...")
        model = MultiTaskClassifier(
            num_sentiment=len(sentiment_mapping),
            num_emotion=len(emotion_mapping),
            num_topic=len(topic_mapping)
        ).to(device)

        # Load model weights
        print("⚖️ Loading model weights...")
        sentiment_state = torch.load(model_paths['sentiment'], map_location=device, weights_only=True)
        emotion_state = torch.load(model_paths['emotion'], map_location=device, weights_only=True)
        topic_state = torch.load(model_paths['topic'], map_location=device, weights_only=True)

        # Handle different state dict formats
        def extract_state_dict(state):
            if isinstance(state, dict) and 'model_state_dict' in state:
                return state['model_state_dict']
            return state

        sentiment_state = extract_state_dict(sentiment_state)
        emotion_state = extract_state_dict(emotion_state)
        topic_state = extract_state_dict(topic_state)

        # Combine state dictionaries
        state_dict = {}
        
        # Load RoBERTa weights from sentiment model (shared backbone)
        for k, v in sentiment_state.items():
            if 'roberta' in k:
                state_dict[k] = v
        
        # Load classifier weights with proper mapping
        for k, v in sentiment_state.items():
            if 'classifier' in k:
                new_key = f'sentiment_classifier.{k.replace("classifier.", "")}'
                state_dict[new_key] = v
        
        for k, v in emotion_state.items():
            if 'classifier' in k:
                new_key = f'emotion_classifier.{k.replace("classifier.", "")}'
                state_dict[new_key] = v
        
        for k, v in topic_state.items():
            if 'classifier' in k:
                new_key = f'topic_classifier.{k.replace("classifier.", "")}'
                state_dict[new_key] = v

        # Load the combined state dict
        missing_keys, unexpected_keys = model.load_state_dict(state_dict, strict=False)
        if missing_keys:
            print(f"⚠️ Missing keys: {missing_keys}")
        if unexpected_keys:
            print(f"⚠️ Unexpected keys: {unexpected_keys}")
        
        model.eval()
        print("✅ Model loaded successfully")

        # Tokenize input
        print("🔤 Tokenizing input...")
        messages = data['message_text'].tolist()
        
        # Filter out empty messages
        valid_messages = [msg for msg in messages if msg and str(msg).strip()]
        if len(valid_messages) != len(messages):
            print(f"⚠️ Warning: {len(messages) - len(valid_messages)} empty messages filtered out")
        
        if not valid_messages:
            raise ValueError("No valid messages to process")
        
        # Test tokenizer first
        try:
            test_result = tokenizer("test message", return_tensors='pt')
            print("✅ Tokenizer test successful")
        except Exception as test_error:
            raise ValueError(f"Tokenizer test failed: {test_error}")
            
        # Tokenize all messages
        encoded = tokenizer(
            messages, 
            padding=True, 
            truncation=True, 
            max_length=64, 
            return_tensors='pt'
        )
        
        input_ids = encoded['input_ids'].to(device)
        attention_mask = encoded['attention_mask'].to(device)
        
        # Create dataloader
        dataset = TensorDataset(input_ids, attention_mask)
        dataloader = DataLoader(dataset, batch_size=32, shuffle=False)

        # Make predictions
        print("🎯 Making predictions...")
        sentiment_preds, emotion_preds, topic_preds = [], [], []
        
        with torch.no_grad():
            for batch in dataloader:
                batch_input_ids, batch_attention_mask = batch
                
                with autocast():
                    sentiment_logits, emotion_logits, topic_logits = model(
                        batch_input_ids, batch_attention_mask
                    )
                
                sentiment_preds.extend(torch.argmax(sentiment_logits, dim=1).cpu().tolist())
                emotion_preds.extend(torch.argmax(emotion_logits, dim=1).cpu().tolist())
                topic_preds.extend(torch.argmax(topic_logits, dim=1).cpu().tolist())

        # Create results dataframe
        print("📋 Creating results...")
        results = pd.DataFrame({
            'idTest': id_test,
            'employeeId': data['employee_id'],
            'employeeName': data['employee_name'],
            'message': data['message_text'],
            'sentiment': pd.Series(sentiment_preds).map(sentiment_mapping),
            'emotion': pd.Series(emotion_preds).map(emotion_mapping),
            'emotion_en': pd.Series(emotion_preds).map(emotion_mapping_en),
            'general_emotion': pd.Series(emotion_preds).map(emotion_mapping).map(general_emotion_mapping),
            'topic': pd.Series(topic_preds).map(topic_mapping),
            'topic_en': pd.Series(topic_preds).map(topic_mapping_en),
            'general_topic': pd.Series(topic_preds).map(topic_mapping).map(general_topic_mapping),
        })


        # Calculate percentages
        print("📊 Calculating percentages...")
        percentage_results = []
        general_emotion_classes = set(general_emotion_mapping.values())
        general_topic_classes = set(general_topic_mapping.values())
        
        for (employee_id, employee_name), group in results.groupby(['employeeId', 'employeeName']):
            sentiment_percentages = (group['sentiment'].value_counts(normalize=True) * 100).round(2).to_dict()
            general_emotion_percentages = (group['general_emotion'].value_counts(normalize=True) * 100).round(2).to_dict()
            general_topic_percentages = (group['general_topic'].value_counts(normalize=True) * 100).round(2).to_dict()

            percentage_results.append({
                'employeeId': employee_id,
                'employeeName': employee_name,
                'sentimentPercentages': {label: sentiment_percentages.get(label, 0) for label in sentiment_mapping.values()},
                'generalEmotionPercentages': {label: general_emotion_percentages.get(label, 0) for label in general_emotion_classes},
                'generalTopicPercentages': {label: general_topic_percentages.get(label, 0) for label in general_topic_classes}
            })

        print("✅ Processing completed successfully")
        return {
            "detailed_results": results.to_dict(orient="records"),
            "percentages": percentage_results
        }
        
    except Exception as e:
        print(f"❌ Error in run_discussion: {str(e)}")
        import traceback
        traceback.print_exc()
        raise e