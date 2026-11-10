# ============================================================
# train_model.py — Train Health Risk Decision Tree Classifier
# ============================================================
# Trains a scikit-learn DecisionTreeClassifier on pilgrim health factors:
# - age_group: 0=Child (<12), 1=Adult (12-60), 2=Senior (60+)
# - altitude_category: 0=Low (<1000m), 1=Medium (1000-3000m), 2=High (>3000m, e.g. Kedarnath)
# - exertion_level: 0=Easy, 1=Moderate, 2=Strenuous
# - has_heart_condition: 0=No, 1=Yes
# - has_breathing_issues: 0=No, 1=Yes
# - is_diabetic: 0=No, 1=Yes
# Target risk_score: 0=Low Risk, 1=Moderate Risk, 2=High Risk
# ============================================================

import os
import joblib
import numpy as np
import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score

def generate_health_dataset(n_samples=1200, random_state=42):
    """
    Generates a realistic clinical pilgrim dataset based on altitude physiology guidelines.
    """
    np.random.seed(random_state)
    
    age_groups = np.random.choice([0, 1, 2], size=n_samples, p=[0.15, 0.60, 0.25])
    altitude_cats = np.random.choice([0, 1, 2], size=n_samples, p=[0.30, 0.35, 0.35])
    exertion_levels = np.random.choice([0, 1, 2], size=n_samples, p=[0.35, 0.45, 0.20])
    
    # Conditional probability for pre-existing conditions based on age
    heart_cond = []
    breathing = []
    diabetes = []
    
    for age in age_groups:
        if age == 2:  # Senior
            heart_cond.append(np.random.choice([0, 1], p=[0.60, 0.40]))
            breathing.append(np.random.choice([0, 1], p=[0.65, 0.35]))
            diabetes.append(np.random.choice([0, 1], p=[0.60, 0.40]))
        elif age == 1:  # Adult
            heart_cond.append(np.random.choice([0, 1], p=[0.90, 0.10]))
            breathing.append(np.random.choice([0, 1], p=[0.88, 0.12]))
            diabetes.append(np.random.choice([0, 1], p=[0.85, 0.15]))
        else:  # Child
            heart_cond.append(np.random.choice([0, 1], p=[0.98, 0.02]))
            breathing.append(np.random.choice([0, 1], p=[0.90, 0.10]))
            diabetes.append(0)
            
    heart_cond = np.array(heart_cond)
    breathing = np.array(breathing)
    diabetes = np.array(diabetes)
    
    # Calculate physiological stress score
    # High altitude + cardiac/breathing + strenuous exertion heavily escalates risk
    stress_score = (
        (age_groups == 2) * 2.0 +
        (age_groups == 0) * 0.5 +
        altitude_cats * 2.2 +
        exertion_levels * 1.5 +
        heart_cond * 3.5 +
        breathing * 2.8 +
        diabetes * 1.2 +
        np.random.normal(0, 0.4, n_samples)
    )
    
    # Target risk classification: 0=Low, 1=Moderate, 2=High
    target = np.zeros(n_samples, dtype=int)
    target[stress_score >= 4.0] = 1
    target[stress_score >= 7.0] = 2
    
    df = pd.DataFrame({
        'age_group': age_groups,
        'altitude_category': altitude_cats,
        'exertion_level': exertion_levels,
        'has_heart_condition': heart_cond,
        'has_breathing_issues': breathing,
        'is_diabetic': diabetes,
        'risk_score': target
    })
    return df

def train_and_export_model():
    df = generate_health_dataset()
    features = ['age_group', 'altitude_category', 'exertion_level', 'has_heart_condition', 'has_breathing_issues', 'is_diabetic']
    X = df[features]
    y = df['risk_score']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    model = DecisionTreeClassifier(max_depth=5, min_samples_split=10, random_state=42)
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"Health Risk Model trained successfully. Test Accuracy: {acc * 100:.2f}%")
    
    current_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(current_dir, 'health_model.pkl')
    metadata_path = os.path.join(current_dir, 'model_metadata.json')
    
    joblib.dump(model, model_path)
    
    import json
    metadata = {
        'model_type': 'DecisionTreeClassifier',
        'accuracy': round(float(acc), 4),
        'features': features,
        'classes': ['Low', 'Moderate', 'High'],
        'sample_size': len(df)
    }
    with open(metadata_path, 'w') as f:
        json.dump(metadata, f, indent=2)
        
    print(f"Saved model to {model_path} and metadata to {metadata_path}")
    return model, metadata

if __name__ == '__main__':
    train_and_export_model()
