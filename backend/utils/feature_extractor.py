# backend/utils/feature_extractor.py
import pandas as pd
from .preprocessing import clean_data

def extract_features(filepath: str) -> pd.DataFrame:
    df = pd.read_csv(filepath)
    df = clean_data(df)
    # Example feature engineering: compute rolling means.
    if 'temperature' in df.columns:
        df["temp_rolling_mean"] = df["temperature"].rolling(window=10, min_periods=1).mean()
    if 'humidity' in df.columns:
        df["humid_rolling_mean"] = df["humidity"].rolling(window=10, min_periods=1).mean()
    # Add more features as needed
    return df
