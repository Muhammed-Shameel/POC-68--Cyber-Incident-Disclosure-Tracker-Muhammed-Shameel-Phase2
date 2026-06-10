import pandas as pd
import numpy as np
import re

def enrich_incidents(df: pd.DataFrame) -> pd.DataFrame:
    if df.empty:
        return df

    # Ensure necessary columns exist, adding them if not
    for col in ["sector", "attack_type", "severity", "risk_score", "confidence_score"]:
        if col not in df.columns:
            df[col] = None

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
            'Telecommunications': [r'telecom', r'mobile', r'broadband', r'carrier', r'wireless', r'communication', r'satellite', r'fiber', r'network provider']
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
            'Ransomware': [r'ransomware', r'encrypted', r'ransom', r'cryptolocker', r'lockbit'],
            'Phishing': [r'phishing', r'social engineering', r'email lure', r'credential theft', r'spoofing'],
            'Malware': [r'malware', r'trojan', r'virus', r'worm', r'spyware', r'keylogger', r'rootkit'],
            'DDoS': [r'denial of service', r'ddos', r'dos attack', r'flood', r'botnet'],
            'Data Breach': [r'data breach', r'data exposure', r'unauthorized access', r'exfiltration', r'leak', r'unauthorized download', r'data theft'],
            'Supply Chain': [r'supply chain', r'third party', r'vendor compromise', r'software update', r'upstream'],
            'Insider Threat': [r'insider', r'employee misconduct', r'unauthorized user', r'privilege abuse']
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
        critical_keywords = [r'critical', r'major impact', r'catastrophic', r'significant data loss', r'business halt']
        high_keywords = [r'high impact', r'compromise', r'sensitive data', r'financial loss']
        medium_keywords = [r'medium impact', r'disruption', r'partial outage', r'limited access']

        if any(re.search(p, description) for p in critical_keywords):
            return 'Critical'
        if any(re.search(p, description) for p in high_keywords):
            return 'High'
        if any(re.search(p, description) for p in medium_keywords):
            return 'Medium'
        return 'Low'

    df['severity'] = df['description'].apply(classify_severity)

    # Risk Score Calculation
    severity_to_score_base = {'Critical': 85, 'High': 65, 'Medium': 45, 'Low': 20}
    
    def calculate_risk_score(row):
        base = severity_to_score_base.get(row['severity'], 10)
        # Add some variance based on attack type or sector if needed
        # For now, just a slight random variance for visual interest, plus penalty for 'Unknown'
        penalty = 0
        if row['sector'] == 'Unknown':
            penalty += 5
        if row['attack_type'] == 'Unknown':
            penalty += 5
            
        score = base + penalty
        return min(100, max(0, score))

    df['risk_score'] = df.apply(calculate_risk_score, axis=1)

    # Confidence Scoring
    def calculate_confidence(row):
        # Base confidence
        confidence = 100
        
        # Deduct for unknowns
        if row['sector'] == 'Unknown':
            confidence -= 30
        if row['attack_type'] == 'Unknown':
            confidence -= 20
        if row['severity'] == 'Low' and len(str(row['description'])) < 50:
            confidence -= 10
            
        return confidence

    df['confidence_score'] = df.apply(calculate_confidence, axis=1)

    return df

if __name__ == "__main__":
    # Example usage:
    data = {
        'company': ['Tech Solutions Inc.', 'National Bank', 'HealthCare Corp', 'Retail Store LLC', 'Energy Co.'],
        'description': [
            'Major ransomware attack leading to data breach.',
            'Phishing incident, no critical data lost.',
            'System disruption, medium impact.',
            'Minor website defacement.',
            'DDoS attack on network, high impact.'
        ]
    }
    test_df = pd.DataFrame(data)
    enriched_df = enrich_incidents(test_df)
    print(enriched_df[['company', 'sector', 'attack_type', 'severity', 'risk_score', 'confidence_score']])
