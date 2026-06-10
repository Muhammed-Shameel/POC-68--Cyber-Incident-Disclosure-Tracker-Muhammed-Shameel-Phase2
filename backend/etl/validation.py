import pandas as pd
from datetime import datetime

def validate_data(df, duplicates_removed):
    print("Validating data and generating quality report...")
    
    total_records = len(df)
    
    # Missing fields
    missing_company = df["company"].isna().sum()
    missing_dates = df["filing_date"].isna().sum()
    invalid_urls = df[~df["filing_url"].str.startswith("http", na=False)].shape[0]
    empty_descriptions = df[df["description"].isna() | (df["description"] == "")].shape[0]
    
    # Classification coverage
    sector_coverage = (df["sector"] != "Unknown").sum() / total_records if total_records > 0 else 0
    attack_type_coverage = (df["attack_type"] != "Unknown").sum() / total_records if total_records > 0 else 0
    
    report = {
        "total_records": total_records,
        "duplicates_removed": duplicates_removed,
        "missing_fields": {
            "company_name": int(missing_company),
            "dates": int(missing_dates),
            "invalid_urls": int(invalid_urls),
            "empty_descriptions": int(empty_descriptions)
        },
        "classification_coverage": {
            "sector": f"{sector_coverage:.1%}",
            "attack_type": f"{attack_type_coverage:.1%}"
        },
        "last_run": datetime.now().isoformat()
    }
    
    return report
