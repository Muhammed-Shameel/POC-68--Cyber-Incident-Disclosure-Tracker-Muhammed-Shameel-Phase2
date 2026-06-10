import sys
import os
import pandas as pd
from datetime import datetime

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from analytics.trend_analysis import calculate_trends
from analytics.sector_analysis import calculate_sector_intelligence
from analytics.attack_analysis import calculate_attack_intelligence
from analytics.risk_analysis import calculate_risk_intelligence
from analytics.insights import generate_insights

def test_analytics():
    # Load data
    data_path = 'backend/data/processed/incidents_clean.parquet'
    if not os.path.exists(data_path):
        print(f"Error: {data_path} not found")
        return
    
    df = pd.read_parquet(data_path)
    df['filing_date_dt'] = pd.to_datetime(df['filing_date'])
    if df['filing_date_dt'].dt.tz is not None:
        df['filing_date_dt'] = df['filing_date_dt'].dt.tz_localize(None)
    
    print("--- Trend Analysis ---")
    trends = calculate_trends(df)
    print(trends)
    
    print("\n--- Sector Intelligence ---")
    sectors = calculate_sector_intelligence(df)
    print(f"Most Targeted: {sectors['most_targeted']}")
    print(f"Fastest Growing: {sectors['fastest_growing']}")
    
    print("\n--- Attack Intelligence ---")
    attacks = calculate_attack_intelligence(df)
    print(attacks['attacks'][:3])
    
    print("\n--- Risk Intelligence ---")
    risk = calculate_risk_intelligence(df)
    print(f"Top 3 High Risk: {risk[:3]}")
    
    print("\n--- Executive Insights ---")
    insights = generate_insights(df)
    for i in insights:
        print(f"- {i}")

if __name__ == "__main__":
    test_analytics()
