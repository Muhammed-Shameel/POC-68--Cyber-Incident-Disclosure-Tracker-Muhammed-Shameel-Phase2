import pandas as pd
from typing import List, Dict

def calculate_risk_intelligence(df: pd.DataFrame) -> List[Dict]:
    if df.empty:
        return []

    # Top 10 High Risk Incidents
    high_risk = df.sort_values(by='risk_score', ascending=False).head(10)
    
    # Return specific fields: company, sector, severity, risk_score
    result = high_risk[['incident_id', 'company', 'sector', 'severity', 'risk_score']].to_dict(orient='records')
    
    return result
