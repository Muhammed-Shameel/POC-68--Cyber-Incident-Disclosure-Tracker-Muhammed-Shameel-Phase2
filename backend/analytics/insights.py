from typing import List, Dict
import pandas as pd
from .trend_analysis import calculate_trends
from .sector_analysis import calculate_sector_intelligence
from .attack_analysis import calculate_attack_intelligence

def generate_insights(df: pd.DataFrame) -> List[str]:
    if df.empty:
        return ["No data available to generate insights."]

    insights = []
    
    # 1. Sector Insights (Handling Uncertainty)
    total_count = len(df)
    unknown_sector_count = len(df[df['sector'] == 'Unknown'])
    unknown_sector_pct = round((unknown_sector_count / total_count) * 100)
    
    sector_intel = calculate_sector_intelligence(df)
    most_targeted = sector_intel['most_targeted']
    
    if unknown_sector_pct > 50:
        insights.append(f"{unknown_sector_pct}% of incidents could not be definitively classified into a sector, reducing confidence in sector-level attribution.")
    elif most_targeted and most_targeted['sector'] != 'Unknown':
        insights.append(f"{most_targeted['sector']} is currently the most targeted sector, representing {most_targeted['incident_count']} disclosures.")
    
    # 2. Attack Insights (Handling Uncertainty)
    unknown_attack_count = len(df[df['attack_type'] == 'Unknown'])
    unknown_attack_pct = round((unknown_attack_count / total_count) * 100)
    
    attack_intel = calculate_attack_intelligence(df)
    if unknown_attack_pct > 40:
        insights.append(f"Attack vector identification is limited; {unknown_attack_pct}% of disclosures lack sufficient technical detail for classification.")
    elif attack_intel['attacks']:
        top_attack = attack_intel['attacks'][0]
        if top_attack['attack_type'] != 'Unknown':
            insights.append(f"{top_attack['attack_type']} remains the primary attack vector, accounting for {top_attack['percentage']}% of classified incidents.")

    # 3. Trend Insights
    trends = calculate_trends(df)
    growth = trends['monthly']['growth']
    if growth is not None:
        if growth > 20:
            insights.append(f"Significant acceleration detected: Incident disclosures increased by {growth}% this month.")
        elif growth > 0:
            insights.append(f"Disclosure activity is trending upward, with a {growth}% increase over the previous period.")
    else:
        insights.append("Historical comparison is limited due to recent dataset initialization; trend confidence is currently low.")

    # 4. Severity & Risk Insights
    critical_count = len(df[df['severity'] == 'Critical'])
    if critical_count > 0:
        insights.append(f"High-priority alert: {critical_count} critical-severity incidents have been disclosed in the current period.")
    
    avg_risk = df['risk_score'].mean()
    if avg_risk > 70.0:
        insights.append(f"The aggregate risk posture is elevated ({round(avg_risk, 1)}), driven by a high concentration of material impacts.")
    
    # 5. Confidence Score
    avg_confidence = df['confidence_score'].mean()
    if avg_confidence < 70:
        insights.append(f"Overall intelligence confidence is Medium ({round(avg_confidence, 1)}%) due to incomplete disclosure narratives in SEC filings.")
    else:
        insights.append(f"Intelligence confidence is High ({round(avg_confidence, 1)}%) based on high attribution rates across the current dataset.")

    return insights[:6]
