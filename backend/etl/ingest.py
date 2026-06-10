import sys
import os

# Add the backend directory to sys.path to allow imports
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from etl.fetch_sec_filings import fetch_latest_8k_metadata
from etl.parse_filings import process_filings

def run_ingestion():
    print("Starting Phase 2: SEC Data Ingestion Pipeline...")
    
    # 1. Fetch
    filings = fetch_latest_8k_metadata()
    
    if not filings:
        print("No filings retrieved. Exiting.")
        return
    
    # 2. Process
    df = process_filings(filings)
    
    if df is not None:
        print("\nIngestion successful!")
        print(f"Total records processed: {len(df)}")
        print("\nExample record:")
        print(df.iloc[0].to_dict())
    else:
        print("\nIngestion failed or no records were processed.")

if __name__ == "__main__":
    run_ingestion()
