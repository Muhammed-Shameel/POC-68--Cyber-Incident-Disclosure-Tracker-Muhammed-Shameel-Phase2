import os
import json
import pandas as pd
from datetime import datetime

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
RAW_DIR = os.path.join(DATA_DIR, "raw")
PROCESSED_DIR = os.path.join(DATA_DIR, "processed")
METADATA_DIR = os.path.join(DATA_DIR, "metadata")

def save_raw_response(name, data):
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    file_path = os.path.join(RAW_DIR, f"{name}_{timestamp}.json")
    with open(file_path, "w") as f:
        json.dump(data, f, indent=2)
    return file_path

def save_processed_data(df, name="incidents"):
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    file_path = os.path.join(PROCESSED_DIR, f"{name}_{timestamp}.parquet")
    df.to_parquet(file_path, index=False)
    return file_path

def update_metadata(source, filing_count, success=True):
    metadata_path = os.path.join(METADATA_DIR, "ingestion_metadata.json")
    
    if os.path.exists(metadata_path):
        with open(metadata_path, "r") as f:
            metadata = json.load(f)
    else:
        metadata = {"runs": []}
    
    run_info = {
        "source": source,
        "retrieval_time": datetime.now().isoformat(),
        "filing_count": filing_count,
        "success": success
    }
    
    metadata["runs"].append(run_info)
    metadata["last_successful_run"] = run_info["retrieval_time"] if success else metadata.get("last_successful_run")
    
    with open(metadata_path, "w") as f:
        json.dump(metadata, f, indent=2)

def get_latest_processed_file():
    if not os.path.exists(PROCESSED_DIR):
        return None
    files = [f for f in os.listdir(PROCESSED_DIR) if f.endswith(".parquet") and not f.startswith("incidents_clean")]
    if not files:
        return None
    files.sort(reverse=True)
    return os.path.join(PROCESSED_DIR, files[0])

def save_clean_data(df):
    file_path = os.path.join(PROCESSED_DIR, "incidents_clean.parquet")
    df.to_parquet(file_path, index=False)
    # Also save CSV and JSON as requested for accessibility
    df.to_csv(os.path.join(PROCESSED_DIR, "incidents_clean.csv"), index=False)
    df.to_json(os.path.join(PROCESSED_DIR, "incidents_clean.json"), orient='records', indent=2)
    return file_path

def save_data_quality_report(report):
    file_path = os.path.join(METADATA_DIR, "data_quality_report.json")
    with open(file_path, "w") as f:
        json.dump(report, f, indent=2)
    return file_path
