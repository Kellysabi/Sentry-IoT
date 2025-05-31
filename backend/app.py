# backend/app.py
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from utils.feature_extractor import extract_features
from models.deep_model import detect_anomalies
from models.traditional_model import train_traditional_model, detect_anomalies_traditional
from benchmark import benchmark_models
from response_module import block_ip
import pandas as pd
import io
import uvicorn

# MongoDB integration using motor.
from motor.motor_asyncio import AsyncIOMotorClient

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect to MongoDB (adjust connection string as needed).
MONGO_URL = "mongodb://mongo:27017"
client = AsyncIOMotorClient(MONGO_URL)
db = client.sentry_iot
alerts_collection = db.alerts

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    contents = await file.read()
    df = pd.read_csv(io.BytesIO(contents))
    temp_file = "temp.csv"
    df.to_csv(temp_file, index=False)
    features = extract_features(temp_file)
    
    # Assume an "alert" column exists with binary labels; if not, use dummy zeros.
    labels = df.get("alert")
    if labels is None:
        labels = pd.Series([0] * len(features))
    
    deep_predictions = detect_anomalies(features)
    triggered_ips = []
    threshold = 0.8
    
    for idx, score in enumerate(deep_predictions):
        if score > threshold:
            src_ip = features.iloc[idx].get('source_ip', 'unknown')
            if src_ip != 'unknown':
                block_ip(src_ip)
                triggered_ips.append(src_ip)
                alert = {
                    "source_ip": src_ip,
                    "score": float(score),
                    "details": features.iloc[idx].to_dict()
                }
                await alerts_collection.insert_one(alert)
    
    return {"status": "success", "triggered_ips": triggered_ips, "predictions": deep_predictions.tolist()}

@app.get("/external-dataset")
async def external_dataset():
    """
    Load external IoT dataset, e.g., TON_IoT.
    Adjust the path to your dataset file.
    """
    try:
        df = pd.read_csv("data/ton_iot.csv")
        features = extract_features("data/ton_iot.csv")
        predictions = detect_anomalies(features)
        return {"status": "success", "message": "External dataset loaded", "predictions": predictions.tolist()}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/benchmark")
async def run_benchmark(file: UploadFile = File(...)):
    contents = await file.read()
    df = pd.read_csv(io.BytesIO(contents))
    temp_file = "temp.csv"
    df.to_csv(temp_file, index=False)
    features = extract_features(temp_file)
    
    labels = df.get("alert")
    if labels is None:
        labels = pd.Series([0] * len(features))
    
    metrics = benchmark_models(features, labels)
    return {"status": "success", "benchmark": metrics}

@app.post("/simulate-alert")
async def simulate_alert(alert_info: dict):
    src_ip = alert_info.get("source_ip")
    details = alert_info.get("alert_details")
    block_ip(src_ip)
    alert = {
        "source_ip": src_ip,
        "score": 1.0,
        "details": details
    }
    await alerts_collection.insert_one(alert)
    return {"status": "alert processed", "source_ip": src_ip, "details": details}

@app.get("/alerts")
async def get_alerts():
    alerts = []
    async for alert in alerts_collection.find().sort("_id", -1).limit(20):
        alert["_id"] = str(alert["_id"])
        alerts.append(alert)
    return alerts

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
