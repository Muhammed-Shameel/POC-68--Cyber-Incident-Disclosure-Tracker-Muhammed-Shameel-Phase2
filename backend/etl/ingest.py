import sys
import os
import pandas as pd
from datetime import datetime # Import datetime

# Add the backend directory to sys.path to allow imports
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from etl.fetch_sec_filings import fetch_latest_8k_metadata
from etl.parse_filings import process_filings_to_dataframe
from etl.fetch_gdelt_events import fetch_gdelt_events
from etl.enrich_incidents import enrich_incidents # Import enrich_incidents
from etl.storage import save_processed_data, update_metadata


def run_ingestion():
    print("Starting Phase 2: Data Ingestion Pipeline (SEC Filings & GDELT Events)...")
    
    all_processed_data = []

    # --- SEC Filings Ingestion ---
    print("\n--- Ingesting SEC Filings ---")
    sec_filings_metadata = fetch_latest_8k_metadata()
    
    if sec_filings_metadata:
        sec_df = process_filings_to_dataframe(sec_filings_metadata)
        if sec_df is not None:
            all_processed_data.append(sec_df)
            print(f"Processed {len(sec_df)} SEC filing records.")
        else:
            print("No SEC filings were processed into a DataFrame.")
    else:
        print("No new SEC filings retrieved.")

    # --- GDELT Events Ingestion ---
    print("\n--- Ingesting GDELT Events ---")
    gdelt_api_key = os.environ.get("GDELT_API_KEY", "your_gdelt_api_key_if_needed") # Placeholder for now
    gdelt_events = fetch_gdelt_events(gdelt_api_key)

    if gdelt_events:
        gdelt_records = []
        for event in gdelt_events:
            # Map GDELT event to a similar schema as SEC filings
            incident_id = event.get("event_id")
            company_name = event.get("actor2", "Unknown Company") # Actor2 often target
            event_date_str = event.get("event_date")
            incident_date = pd.to_datetime(event_date_str) if event_date_str else None

            gdelt_records.append({
                "incident_id": incident_id,
                "company": company_name,
                "filing_date": incident_date, # Using incident_date for consistency
                "incident_date": incident_date,
                "description": f"GDELT event: {event.get('event_type', 'N/A')} involving {event.get('actor1', 'N/A')} and {event.get('actor2', 'N/A')}. Goldstein Scale: {event.get('goldstein_scale', 'N/A')}",
                "filing_url": event.get("url", "N/A"),
                "source": "GDELT",
                "goldstein_scale": event.get("goldstein_scale") # Include goldstein_scale
            })
        
        gdelt_df = pd.DataFrame(gdelt_records)
        all_processed_data.append(gdelt_df)
        print(f"Processed {len(gdelt_df)} GDELT event records.")
    else:
        print("No GDELT events retrieved.")

    # --- Combine and Save All Processed Data ---
    if all_processed_data:
        combined_df = pd.concat(all_processed_data, ignore_index=True)
        print(f"\nTotal combined records for initial processing: {len(combined_df)}")

        # Enrich combined data (classify sector, attack type, severity, risk_score, confidence_score)
        print("Enriching combined incident data...")
        enriched_df = enrich_incidents(combined_df, current_date=datetime.now())
        print(f"Enrichment complete. Total enriched records: {len(enriched_df)}")

        parquet_file = save_processed_data(enriched_df)
        print(f"Enriched data saved to {parquet_file}")
        
        update_metadata("Combined Data (SEC & GDELT)", len(enriched_df), success=True)
        
        if not enriched_df.empty:
            print("\nExample enriched record:")
            print(enriched_df.iloc[0].to_dict())
        else:
            print("Enriched DataFrame is empty.")
    else:
        print("\nNo data was processed from any source.")

if __name__ == "__main__":
    run_ingestion()
