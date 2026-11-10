# ============================================================
# predict.py — Health Risk Prediction Inference Service
# ============================================================
import os
import json
import joblib
import pandas as pd

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(CURRENT_DIR, 'health_model.pkl')
METADATA_PATH = os.path.join(CURRENT_DIR, 'model_metadata.json')

_model = None
_metadata = None

def get_model_and_metadata():
    global _model, _metadata
    if _model is None and os.path.exists(MODEL_PATH):
        try:
            _model = joblib.load(MODEL_PATH)
        except Exception as e:
            print(f"Error loading model: {e}")
            
    if _metadata is None and os.path.exists(METADATA_PATH):
        try:
            with open(METADATA_PATH, 'r') as f:
                _metadata = json.load(f)
        except Exception as e:
            print(f"Error loading metadata: {e}")
            
    return _model, _metadata

def predict_health(input_data):
    """
    Predicts health risk level for given pilgrim features.
    
    Expected features:
    - age_group (0, 1, 2)
    - altitude_category (0, 1, 2)
    - exertion_level (0, 1, 2)
    - has_heart_condition (0 or 1)
    - has_breathing_issues (0 or 1)
    - is_diabetic (0 or 1)
    """
    # Validation & coercion
    required_fields = [
        'age_group', 'altitude_category', 'exertion_level',
        'has_heart_condition', 'has_breathing_issues', 'is_diabetic'
    ]
    
    clean_features = {}
    for field in required_fields:
        if field not in input_data:
            raise ValueError(f"Missing required medical input field: '{field}'")
        try:
            val = int(input_data[field])
            if val not in [0, 1, 2] and field in ['age_group', 'altitude_category', 'exertion_level']:
                raise ValueError(f"Field '{field}' must be 0, 1, or 2.")
            if val not in [0, 1] and field in ['has_heart_condition', 'has_breathing_issues', 'is_diabetic']:
                raise ValueError(f"Binary field '{field}' must be 0 or 1.")
            clean_features[field] = val
        except (TypeError, ValueError) as e:
            raise ValueError(f"Invalid value for '{field}': {str(e)}")
            
    model, metadata = get_model_and_metadata()
    
    if model is not None:
        df = pd.DataFrame([clean_features])
        predicted_class = int(model.predict(df)[0])
        probabilities = model.predict_proba(df)[0].tolist() if hasattr(model, 'predict_proba') else None
    else:
        # Fallback transparent clinical heuristic if model binary missing
        score = (
            (clean_features['age_group'] == 2) * 2 +
            clean_features['altitude_category'] * 2 +
            clean_features['exertion_level'] * 1 +
            clean_features['has_heart_condition'] * 3 +
            clean_features['has_breathing_issues'] * 2 +
            clean_features['is_diabetic'] * 1
        )
        predicted_class = 2 if score >= 5 else (1 if score >= 2 else 0)
        probabilities = [0.0, 0.0, 0.0]
        probabilities[predicted_class] = 1.0

    levels = ['Low', 'Moderate', 'High']
    risk_level = levels[predicted_class]
    
    advice_map = [
        'You appear physiologically well-suited for this pilgrimage category. Maintain standard hydration and gradual ascent.',
        'Moderate risk indicated. Keep essential prescribed medications readily accessible, schedule frequent acclimatization rest stops, and do not rush steep corridors.',
        'High physiological risk detected! High altitude combined with cardiac/pulmonary stress requires prior physician consultation. Avail porter/palanquin services and register at on-site medical posts.'
    ]
    
    precautions_map = [
        [
            'Drink 2-3 liters of clean electrolyte water daily.',
            'Wear comfortable broken-in footwear and layered woolens.',
            'Start darshan early morning to avoid peak thermal and queue congestion.'
        ],
        [
            'Carry prescribed inhalers, nitro-glycerin, or BP medicines on your person, not in luggage.',
            'Rest 10 minutes for every 45 minutes of uphill walk.',
            'Know the nearest pilgrim aid post and keep helpline (108/112) programmed.'
        ],
        [
            'Obtain a formal fitness certificate from a physician prior to high-altitude ascent (>3000m).',
            'Carry portable oxygen canisters or identify oxygen refill booths.',
            'Do not walk alone; stay accompanied by group members at all times.',
            'If experiencing breathlessness, chest tightness, or severe dizziness, immediately descend to the nearest medical station.'
        ]
    ]

    return {
        'success': True,
        'risk_score': predicted_class,
        'risk_level': risk_level,
        'advice': advice_map[predicted_class],
        'precautions': precautions_map[predicted_class],
        'probabilities': probabilities,
        'model_used': metadata.get('model_type', 'DecisionTreeClassifier') if metadata else 'Clinical Heuristic',
        'disclaimer': 'Educational risk assessment tool only. Not a medical diagnosis or emergency clearance.'
    }
