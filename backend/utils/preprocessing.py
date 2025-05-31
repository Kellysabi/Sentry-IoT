# backend/utils/preprocessing.py
import pandas as pd

def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    # Remove rows with missing values and reset index.
    df = df.dropna().reset_index(drop=True)
    return df
