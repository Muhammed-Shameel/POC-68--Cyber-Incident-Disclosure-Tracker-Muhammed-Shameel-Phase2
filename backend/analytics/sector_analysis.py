import pandas as pd
from typing import List, Dict
from datetime import datetime, timedelta

def calculate_sector_intelligence(df: pd.DataFrame) -> Dict:
    if df.empty:
        return {
            "most_targeted": None,
            "fastest_growing": None,
            "highest_risk": None,
            "all_sectors": []
        }

    # Most Targeted
    sector_counts = df['sector'].value_counts().reset_index()
    sector_counts.columns = ['sector', 'incident_count']
    most_targeted = sector_counts.iloc[0].to_dict() if not sector_counts.empty else None

    # Highest Risk
    sector_risk = df.groupby('sector')['risk_score'].mean().reset_index()
    sector_risk.columns = ['sector', 'avg_risk_score']
    sector_risk['avg_risk_score'] = sector_risk['avg_risk_score'].round(2)
    sector_risk = sector_risk.sort_values(by='avg_risk_score', ascending=False)
    highest_risk = sector_risk.iloc[0].to_dict() if not sector_risk.empty else None

    # Fastest Growing (Last 90 days vs Previous 90 days)
    now = datetime.now()
    ninety_days_ago = now - timedelta(days=90)
    one_eighty_days_ago = now - timedelta(days=180)

    recent_df = df[df['filing_date_dt'] >= ninety_days_ago]
    previous_df = df[(df['filing_date_dt'] >= one_eighty_days_ago) & (df['filing_date_dt'] < ninety_days_ago)]

    recent_counts = recent_df['sector'].value_counts()
    previous_counts = previous_df['sector'].value_counts()

    growth_rates = []
    for sector in df['sector'].unique():
        recent = recent_counts.get(sector, 0)
        previous = previous_counts.get(sector, 0)
        
        if previous == 0:
            growth = None if recent > 0 else 0.0
        else:
            growth = ((recent - previous) / previous) * 100
        
        growth_rates.append({
            "sector": sector,
            "growth": round(growth, 2) if growth is not None else None,
            "recent_count": int(recent),
            "previous_count": int(previous)
        })
    
    # Filter out Unknown for top metrics if it's the leader
    metric_eligible_sectors = [g for g in growth_rates if g['sector'] != 'Unknown']
    
    fastest_growing = None
    if metric_eligible_sectors:
        metric_eligible_sectors.sort(key=lambda x: (x['growth'] if x['growth'] is not None else -1), reverse=True)
        fastest_growing = metric_eligible_sectors[0]

    # All Sectors Stats
    all_sectors = []
    for _, row in sector_counts.iterrows():
        sector_name = row['sector']
        avg_risk_series = sector_risk[sector_risk['sector'] == sector_name]['avg_risk_score'].values
        avg_risk = avg_risk_series[0] if len(avg_risk_series) > 0 else 0.0
        all_sectors.append({
            "sector": sector_name,
            "incident_count": int(row['incident_count']),
            "avg_risk_score": float(avg_risk)
        })

    # For most_targeted and highest_risk, also prefer known sectors for the top summary
    known_sector_counts = sector_counts[sector_counts['sector'] != 'Unknown']
    most_targeted_known = known_sector_counts.iloc[0].to_dict() if not known_sector_counts.empty else None
    
    known_sector_risk = sector_risk[sector_risk['sector'] != 'Unknown']
    highest_risk_known = known_sector_risk.iloc[0].to_dict() if not known_sector_risk.empty else None

    return {
        "most_targeted": most_targeted_known or (sector_counts.iloc[0].to_dict() if not sector_counts.empty else None),
        "fastest_growing": fastest_growing,
        "highest_risk": highest_risk_known or (sector_risk.iloc[0].to_dict() if not sector_risk.empty else None),
        "all_sectors": all_sectors
    }
