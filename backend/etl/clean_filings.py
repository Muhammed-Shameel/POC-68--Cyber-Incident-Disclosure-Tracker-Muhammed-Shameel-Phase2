import pandas as pd
from etl.storage import get_latest_processed_file

def standardize_and_deduplicate():
    input_file = get_latest_processed_file()
    if not input_file:
        print("No processed data found to clean.")
        return None, 0
    
    df = pd.read_parquet(input_file)
    original_count = len(df)
    
    # 1. Standardize Fields (Ensure all requested fields exist)
    required_fields = [
        "incident_id", "company", "sector", "filing_date", 
        "incident_date", "attack_type", "severity", "risk_score", 
        "description", "filing_url", "source", "confidence_score"
    ]
    
    for field in required_fields:
        if field not in df.columns:
            df[field] = None
            
    # 2. Deduplication
    # Rules: Same company, same filing date, same filing URL
    # We keep the first one found
    df = df.drop_duplicates(subset=["company", "filing_date", "filing_url"], keep="first")
    
    duplicates_removed = original_count - len(df)
    print(f"Standardized fields and removed {duplicates_removed} duplicates.")
    
    return df, duplicates_removed

if __name__ == "__main__":
    standardize_and_deduplicate()
