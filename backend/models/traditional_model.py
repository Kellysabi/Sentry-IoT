# backend/models/traditional_model.py
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest

def train_traditional_model(features: pd.DataFrame):
    model = IsolationForest(contamination=0.1, random_state=42)
    model.fit(features)
    return model

def detect_anomalies_traditional(model, features: pd.DataFrame):
    predictions = model.predict(features)
    scores = np.where(predictions == -1, 1.0, 0.0)  # Convert -1 anomaly indicator to score of 1.
    return scores
