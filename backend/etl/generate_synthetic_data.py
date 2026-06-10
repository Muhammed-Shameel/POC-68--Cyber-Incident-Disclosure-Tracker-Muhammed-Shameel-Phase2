import pandas as pd
import numpy as np
import uuid
from datetime import datetime, timedelta

def generate_synthetic_data(num_records=1000):
    sectors = ['Financial Services', 'Technology', 'Healthcare', 'Energy', 'Retail', 'Manufacturing', 'Telecommunications']
    sector_probs = [0.25, 0.30, 0.20, 0.10, 0.05, 0.05, 0.05]
    
    attacks = ['Ransomware', 'Phishing', 'Malware', 'DDoS', 'Data Breach', 'Supply Chain', 'Insider Threat']
    attack_probs = [0.30, 0.35, 0.10, 0.05, 0.15, 0.03, 0.02]
    
    severities = ['Low', 'Medium', 'High', 'Critical']
    severity_probs = [0.4, 0.3, 0.2, 0.1]
    
    data = []
    for _ in range(num_records):
        company = f"Company_{np.random.randint(100, 999)}"
        
        # 5% chance of 'Unknown'
        sector = 'Unknown' if np.random.rand() < 0.05 else np.random.choice(sectors, p=sector_probs)
        attack = 'Unknown' if np.random.rand() < 0.05 else np.random.choice(attacks, p=attack_probs)
            
        severity = np.random.choice(severities, p=severity_probs)
        
        description = f"A {severity.lower()} {attack.lower()} incident occurred in the {sector} sector, impacting operations."
        
        data.append({
            "incident_id": str(uuid.uuid4()),
            "company": company,
            "sector": sector,
            "filing_date": (datetime.now() - timedelta(days=np.random.randint(0, 90))).isoformat(),
            "incident_date": None,
            "attack_type": attack,
            "severity": severity,
            "risk_score": np.random.randint(10, 100),
            "description": description,
            "filing_url": "https://example.com/filing",
            "source": "Synthetic Generator",
            "confidence_score": np.random.randint(50, 100)
        })
    
    return pd.DataFrame(data)

if __name__ == "__main__":
    df = generate_synthetic_data(num_records=1000)
    # Save in multiple formats for compatibility
    df.to_parquet('backend/data/processed/incidents_clean.parquet', index=False)
    df.to_csv('backend/data/processed/incidents_clean.csv', index=False)
    df.to_json('backend/data/processed/incidents_clean.json', orient='records', indent=2)
    print(f"Generated {len(df)} synthetic records to backend/data/processed/incidents_clean.[parquet,csv,json]")
