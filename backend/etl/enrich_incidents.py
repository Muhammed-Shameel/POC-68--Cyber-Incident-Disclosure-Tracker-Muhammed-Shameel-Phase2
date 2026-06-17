import pandas as pd
import numpy as np
import re

def enrich_incidents(df: pd.DataFrame, current_date: datetime = None) -> pd.DataFrame:
    if df.empty:
        return df

    if current_date is None:
        current_date = datetime.now()

    # Ensure necessary columns exist, adding them if not
    for col in ["sector", "attack_type", "severity", "risk_score", "confidence_score", "goldstein_scale", "incident_date"]:
        if col not in df.columns:
            df[col] = None

    # Convert incident_date to datetime if not already
    df['incident_date'] = pd.to_datetime(df['incident_date'], errors='coerce')

    # --- Improved Classification ---

    # Sector Classification
    def classify_sector(company_name, description):
        text = (str(company_name) + " " + str(description)).lower()
        
        sector_map = {
            'Financial Services': [r'bank', r'finance', r'insurance', r'capital', r'investment', r'fintech', r'asset management', r'credit', r'wealth', r'securities'],
            'Technology': [r'tech', r'software', r'solutions', r'cloud', r'data', r'network', r'cyber', r'digital', r'systems', r'computing', r'platform', r'semiconductor', r'ai', r'artificial intelligence'],
            'Healthcare': [r'health', r'pharma', r'hospital', r'medical', r'biotech', r'clinical', r'care', r'pharmaceutical', r'diagnostic', r'genomics'],
            'Energy': [r'energy', r'power', r'electric', r'gas', r'oil', r'utility', r'renewables', r'petroleum', r'solar', r'grid'],
            'Retail': [r'retail', r'store', r'shop', r'consumer', r'e-commerce', r'mall', r'goods', r'wholesale', r'apparel', r'fashion'],
            'Manufacturing': [r'manufacturing', r'industrial', r'factory', r'automotive', r'aerospace', r'defense', r'engineering', r'chemical', r'machinery'],
            'Telecommunications': [r'telecom', r'mobile', r'broadband', r'carrier', r'wireless', r'communication', r'satellite', r'fiber', r'network provider'],
            'Government': [r'government', r'agency', r'public sector', r'defense department', r'federal', r'state', r'municipal']
        }

        for sector, patterns in sector_map.items():
            if any(re.search(p, text) for p in patterns):
                return sector
        return 'Unknown'
    
    df['sector'] = df.apply(lambda row: classify_sector(row['company'], row['description']), axis=1)

    # Attack Type Classification
    def classify_attack_type(description):
        description = str(description).lower()
        
        attack_map = {
            'Ransomware': [r'ransomware', r'encrypted', r'ransom', r'cryptolocker', r'lockbit', r'malware attack'],
            'Phishing': [r'phishing', r'social engineering', r'email lure', r'credential theft', r'spoofing', r'spear-phishing'],
            'Malware': [r'malware', r'trojan', r'virus', r'worm', r'spyware', r'keylogger', r'rootkit', r'adware'],
            'DDoS': [r'denial of service', r'ddos', r'dos attack', r'flood', r'botnet', r'traffic surge'],
            'Data Breach': [r'data breach', r'data exposure', r'unauthorized access', r'exfiltration', r'leak', r'unauthorized download', r'data theft', r'database compromise'],
            'Supply Chain': [r'supply chain', r'third party', r'vendor compromise', r'software update', r'upstream', r'dependency attack'],
            'Insider Threat': [r'insider', r'employee misconduct', r'unauthorized user', r'privilege abuse', r'internal sabotage'],
            'Web Attack': [r'sql injection', r'xss', r'cross-site scripting', r'web defacement', r'broken authentication'],
            'Vulnerability Exploitation': [r'vulnerability', r'exploit', r'patch management', r'zero-day']
        }

        for attack, patterns in attack_map.items():
            if any(re.search(p, description) for p in patterns):
                return attack
        return 'Unknown'

    df['attack_type'] = df['description'].apply(classify_attack_type)

    # Severity Classification
    def classify_severity(description):
        description = str(description).lower()
        
        # Weighted keywords for severity
        critical_keywords = [r'critical', r'major impact', r'catastrophic', r'significant data loss', r'business halt', r'systemic failure', r'national security']
        high_keywords = [r'high impact', r'compromise', r'sensitive data', r'financial loss', r'reputational damage', r'regulatory fine', r'widespread disruption']
        medium_keywords = [r'medium impact', r'disruption', r'partial outage', r'limited access', r'minor data loss', r'customer impact']
        low_keywords = [r'low impact', r'minor incident', r'brief interruption', r'contained', r'no data loss']

        if any(re.search(p, description) for p in critical_keywords):
            return 'Critical'
        if any(re.search(p, description) for p in high_keywords):
            return 'High'
        if any(re.search(p, description) for p in medium_keywords):
            return 'Medium'
        if any(re.search(p, description) for p in low_keywords):
            return 'Low'
        return 'Medium' # Default to Medium if no clear indicator

    df['severity'] = df['description'].apply(classify_severity)

    # Risk Score Calculation
    # Base scores are slightly lower as other factors will increase the score
    severity_to_score_base = {'Critical': 60, 'High': 45, 'Medium': 30, 'Low': 15}
    
    # Attack type weights (higher for more impactful attacks)
    attack_type_weights = {
        'Ransomware': 20,
        'Data Breach': 25,
        'Supply Chain': 30,
        'DDoS': 10,
        'Malware': 15,
        'Phishing': 10,
        'Insider Threat': 20,
        'Web Attack': 10,
        'Vulnerability Exploitation': 15,
        'Unknown': 5 # Minor penalty for unknown attack type
    }

    # Sector sensitivity (higher for more sensitive sectors)
    sector_sensitivity = {
        'Financial Services': 20,
        'Healthcare': 25,
        'Government': 30,
        'Energy': 15,
        'Technology': 15,
        'Manufacturing': 10,
        'Telecommunications': 10,
        'Retail': 5,
        'Unknown': 5 # Minor penalty for unknown sector
    }

    def calculate_risk_score(row):
        score = severity_to_score_base.get(row['severity'], 10) # Base on severity

        # Add score based on attack type
        score += attack_type_weights.get(row['attack_type'], 0)

        # Add score based on sector sensitivity
        score += sector_sensitivity.get(row['sector'], 0)

        # Incorporate Goldstein Scale for GDELT events (typically negative for conflict, so we invert and scale)
        if row['source'] == 'GDELT' and pd.notna(row['goldstein_scale']):
            # Goldstein scale ranges from -10 to +10. More negative means more conflict.
            # We want more negative to mean higher risk, so (10 - goldstein) will give a range from 0 to 20.
            # Scale this to contribute up to 10-20 points to risk.
            score += int((10 - row['goldstein_scale']) * 1) # Scaling factor 1

        # Time decay: more recent incidents are riskier (decay over 90 days)
        if pd.notna(row['incident_date']):
            days_since_incident = (current_date - row['incident_date']).days
            if days_since_incident < 0: days_since_incident = 0 # Future dates should not decay
            decay_factor = max(0, 1 - (days_since_incident / 90)) # Decays to 0 over 90 days
            score += int(decay_factor * 10) # Add up to 10 points for recency

        # Add a small random variance to avoid perfect ties, but keep it low
        score += np.random.randint(-2, 3) 

        # Ensure score is within 0-100
        return min(100, max(0, score))

    df['risk_score'] = df.apply(calculate_risk_score, axis=1)

    # Confidence Scoring (re-evaluate or keep existing)
    def calculate_confidence(row):
        confidence = 100
        
        if row['sector'] == 'Unknown':
            confidence -= 30
        if row['attack_type'] == 'Unknown':
            confidence -= 20
        if row['severity'] == 'Low' and len(str(row['description'])) < 50:
            confidence -= 10
        
        # If GDELT, and goldstein is null, reduce confidence
        if row['source'] == 'GDELT' and pd.isna(row['goldstein_scale']):
            confidence -= 10 # Data might be less rich without this key GDELT metric
            
        return max(0, confidence) # Ensure confidence doesn't go below 0

    df['confidence_score'] = df.apply(calculate_confidence, axis=1)

    return df

if __name__ == "__main__":
    # Example usage:
    from datetime import datetime, timedelta
    data = {
        'company': ['Tech Solutions Inc.', 'National Bank', 'HealthCare Corp', 'Retail Store LLC', 'Energy Co.', 'Gov Agency', 'GDELT Event Co'],
        'description': [
            'Major ransomware attack leading to data breach.',
            'Phishing incident, no critical data lost.',
            'System disruption, medium impact.',
            'Minor website defacement.',
            'DDoS attack on network, high impact.',
            'Supply chain attack on critical infrastructure.',
            'GDELT: CYBER_ATTACK event against ACME Corp.'
        ],
        'source': ['SEC EDGAR', 'SEC EDGAR', 'SEC EDGAR', 'SEC EDGAR', 'SEC EDGAR', 'SEC EDGAR', 'GDELT'],
        'goldstein_scale': [np.nan, np.nan, np.nan, np.nan, np.nan, np.nan, -7.0],
        'incident_date': [
            datetime.now() - timedelta(days=5),
            datetime.now() - timedelta(days=60),
            datetime.now() - timedelta(days=120),
            datetime.now() - timedelta(days=1),
            datetime.now() - timedelta(days=30),
            datetime.now() - timedelta(days=10),
            datetime.now() - timedelta(days=7)
        ]
    }
    test_df = pd.DataFrame(data)
    enriched_df = enrich_incidents(test_df)
    print(enriched_df[['company', 'sector', 'attack_type', 'severity', 'risk_score', 'confidence_score', 'goldstein_scale', 'incident_date']])
