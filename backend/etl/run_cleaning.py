import sys
import os

# Add the backend directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from etl.clean_filings import standardize_and_deduplicate
from etl.enrich_incidents import enrich_incidents
from etl.validation import validate_data
from etl.storage import save_clean_data, save_data_quality_report

def run_pipeline():
    print("Starting Phase 3: Data Cleaning & Enrichment Pipeline...")
    
    # 1. Clean (Standardize & Deduplicate)
    df, dups = standardize_and_deduplicate()
    
    if df is None:
        return
        
    # 2. Enrich (Classify & Score)
    df = enrich_incidents(df)
    
    # 3. Validate
    report = validate_data(df, dups)
    
    # 4. Save
    clean_path = save_clean_data(df)
    report_path = save_data_quality_report(report)
    
    print("\nPipeline completed successfully!")
    print(f"Cleaned dataset saved to: {clean_path}")
    print(f"Data quality report saved to: {report_path}")
    
    print("\nExample Enriched Record:")
    print(df.iloc[0].to_dict())
    
    print("\nData Quality Summary:")
    print(f"Total Records: {report['total_records']}")
    print(f"Duplicates Removed: {report['duplicates_removed']}")
    print(f"Sector Coverage: {report['classification_coverage']['sector']}")
    print(f"Attack Type Coverage: {report['classification_coverage']['attack_type']}")

if __name__ == "__main__":
    run_pipeline()
