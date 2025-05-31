# backend/benchmark.py
import time
import numpy as np
from models.deep_model import detect_anomalies
from models.traditional_model import train_traditional_model, detect_anomalies_traditional

def benchmark_models(features, labels):
    # Benchmark deep learning model.
    start_time = time.time()
    deep_predictions = detect_anomalies(features)
    deep_latency = time.time() - start_time

    # Benchmark traditional model.
    traditional_model = train_traditional_model(features)
    start_time = time.time()
    trad_predictions = detect_anomalies_traditional(traditional_model, features)
    trad_latency = time.time() - start_time

    # Calculate accuracy for demonstration (assumes binary labels exist).
    deep_accuracy = np.mean((deep_predictions > 0.8) == labels)
    trad_accuracy = np.mean(trad_predictions == labels)

    return {
        "deep_model": {
            "accuracy": deep_accuracy,
            "latency": deep_latency,
            "predictions": deep_predictions.tolist()
        },
        "traditional_model": {
            "accuracy": trad_accuracy,
            "latency": trad_latency,
            "predictions": trad_predictions.tolist()
        }
    }
