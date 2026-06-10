import pandas as pd
from typing import List, Dict
from datetime import datetime, timedelta

def calculate_attack_intelligence(df: pd.DataFrame) -> Dict:
    if df.empty:
        return {"attacks": []}

    total_incidents = len(df)
    
    # Attack counts and percentages
    attack_counts = df['attack_type'].value_counts().reset_index()
    attack_counts.columns = ['attack_type', 'count']
    attack_counts['percentage'] = (attack_counts['count'] / total_incidents * 100).round(2)

    # Growth trend (Last 90 days vs Previous 90 days)
    now = datetime.now()
    ninety_days_ago = now - timedelta(days=90)
    one_eighty_days_ago = now - timedelta(days=180)

    recent_df = df[df['filing_date_dt'] >= ninety_days_ago]
    previous_df = df[(df['filing_date_dt'] >= one_eighty_days_ago) & (df['filing_date_dt'] < ninety_days_ago)]

    recent_counts = recent_df['attack_type'].value_counts()
    previous_counts = previous_df['attack_type'].value_counts()

    attacks = []
    for _, row in attack_counts.iterrows():
        attack_type = row['attack_type']
        count = row['count']
        percentage = row['percentage']
        
        recent = recent_counts.get(attack_type, 0)
        previous = previous_counts.get(attack_type, 0)
        
        if previous == 0:
            growth = None if recent > 0 else 0.0
        else:
            growth = ((recent - previous) / previous) * 100
        
        attacks.append({
            "attack_type": attack_type,
            "count": int(count),
            "percentage": float(percentage),
            "growth": round(growth, 2) if growth is not None else None
        })

    return {"attacks": attacks}
