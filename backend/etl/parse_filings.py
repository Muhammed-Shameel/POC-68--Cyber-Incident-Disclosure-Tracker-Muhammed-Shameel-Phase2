import pandas as pd
import hashlib
import re
from etl.storage import save_processed_data, update_metadata

def parse_sec_title(title):
    # Format: 8-K - COMPANY NAME (0000000000) (Filer)
    match = re.search(r"8-K - (.*?) \((\d+)\)", title)
    if match:
        return match.group(1), match.group(2)
    return title, "unknown"

def process_filings(filings):
    processed_records = []
    
    for f in filings:
        company_name, cik = parse_sec_title(f["title"])
        
        # Create a unique incident_id
        incident_id = hashlib.md5(f["url"].encode()).hexdigest()
        
        processed_records.append({
            "incident_id": incident_id,
            "company": company_name,
            "filing_date": f["updated"],
            "incident_date": None,  # Requires deep parsing of filing content
            "description": f"SEC 8-K Filing for {company_name}",
            "filing_url": f["url"],
            "source": f["source"]
        })
    
    if not processed_records:
        return None
        
    df = pd.DataFrame(processed_records)
    parquet_file = save_processed_data(df)
    print(f"Processed {len(processed_records)} records and saved to {parquet_file}")
    
    update_metadata("SEC EDGAR", len(processed_records), success=True)
    return df

if __name__ == "__main__":
    # This would normally be called with data from fetch_sec_filings
    pass
