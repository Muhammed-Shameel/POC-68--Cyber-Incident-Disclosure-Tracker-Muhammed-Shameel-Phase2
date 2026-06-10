from services.incident_service import IncidentService
from typing import Dict, List
import pandas as pd

class AnalyticsService:
    def __init__(self):
        self.incident_service = IncidentService()

    def get_summary(self, company=None, sector=None, severity=None, attack_type=None) -> Dict:
        df = self.incident_service.get_filtered_df(company, sector, severity, attack_type)
        if df.empty:
            return {
                "total_incidents": 0,
                "total_companies": 0,
                "sectors_affected": 0,
                "average_risk_score": 0.0
            }
        
        return {
            "total_incidents": len(df),
            "total_companies": df['company'].nunique(),
            "sectors_affected": df['sector'].nunique(),
            "average_risk_score": round(df['risk_score'].mean(), 2)
        }

    def get_sector_stats(self, company=None, sector=None, severity=None, attack_type=None) -> List[Dict]:
        df = self.incident_service.get_filtered_df(company, sector, severity, attack_type)
        if df.empty:
            return []
        
        stats = df.groupby('sector').agg(
            count=('incident_id', 'count'),
            average_risk=('risk_score', 'mean')
        ).reset_index()
        
        stats['average_risk'] = stats['average_risk'].round(2)
        return stats.to_dict(orient='records')

    def get_severity_distribution(self, company=None, sector=None, severity=None, attack_type=None) -> Dict[str, int]:
        df = self.incident_service.get_filtered_df(company, sector, severity, attack_type)
        if df.empty:
            return {"Low": 0, "Medium": 0, "High": 0, "Critical": 0}
        
        dist = df['severity'].value_counts().to_dict()
        # Ensure all categories are present
        for sev in ["Low", "Medium", "High", "Critical"]:
            if sev not in dist:
                dist[sev] = 0
        return dist

    def get_timeline(self, company=None, sector=None, severity=None, attack_type=None) -> List[Dict]:
        df = self.incident_service.get_filtered_df(company, sector, severity, attack_type)
        if df.empty:
            return []
        
        # Group by month
        df['filing_date_dt'] = pd.to_datetime(df['filing_date'])
        df['month'] = df['filing_date_dt'].dt.to_period('M').astype(str)
        timeline = df.groupby('month').size().reset_index(name='count')
        timeline.rename(columns={'month': 'date'}, inplace=True)
        
        return timeline.to_dict(orient='records')
