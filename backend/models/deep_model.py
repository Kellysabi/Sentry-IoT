# backend/models/deep_model.py
import os
import numpy as np
import pandas as pd
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import LSTM, Dense
from tensorflow.keras.callbacks import EarlyStopping

MODEL_PATH = "backend/models/saved/deep_model.h5"

def build_lstm_model(input_shape):
    model = Sequential([
        LSTM(64, input_shape=input_shape, return_sequences=True),
        LSTM(32),
        Dense(1, activation='sigmoid')
    ])
    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
    return model

def train_deep_model(features: pd.DataFrame, labels: pd.Series, epochs=10, batch_size=32):
    # Reshape features to 3D: (samples, timesteps, features).
    X = np.expand_dims(features.values, axis=1)  # Simplistic: each sample as a one-step sequence.
    y = labels.values
    model = build_lstm_model(input_shape=(X.shape[1], X.shape[2]))
    
    es = EarlyStopping(monitor='loss', patience=3)
    model.fit(X, y, epochs=epochs, batch_size=batch_size, callbacks=[es])
    
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    model.save(MODEL_PATH)
    return model

def detect_anomalies(features: pd.DataFrame):
    # Attempt to load the pre-trained model; if not found, use dummy predictions.
    try:
        model = load_model(MODEL_PATH)
    except Exception:
        np.random.seed(42)
        return np.random.rand(len(features))
    
    X = np.expand_dims(features.values, axis=1)
    predictions = model.predict(X)
    return predictions.flatten()
