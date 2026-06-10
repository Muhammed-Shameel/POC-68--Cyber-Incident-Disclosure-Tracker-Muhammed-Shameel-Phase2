import pandas as pd
from typing import Dict, List, Any
from services.incident_service import IncidentService
from services.analytics_service import AnalyticsService
from services.intelligence_service import IntelligenceService

class ReportService:
    def __init__(self):
        self.incident_service = IncidentService()
        self.analytics_service = AnalyticsService()
        self.intelligence_service = IntelligenceService()

    async def get_executive_summary_report(self) -> Dict[str, Any]:
        # Note: AnalyticsService and IntelligenceService methods are not async in current implementation
        # But we'll keep the await structure for future-proofing if they become async
        summary_data = self.analytics_service.get_summary()
        sector_intel_data = self.intelligence_service.get_sectors()
        attack_intel_data = self.intelligence_service.get_attacks()
        insights_data = self.intelligence_service.get_insights()

        report = {
            "title": "Executive Summary Report",
            "date_generated": pd.Timestamp.now().strftime("%Y-%m-%d %H:%M:%S"),
            "total_incidents": summary_data['total_incidents'],
            "average_risk_score": summary_data['average_risk_score'],
            "top_sector": sector_intel_data['most_targeted']['sector'] if sector_intel_data['most_targeted'] else 'N/A',
            "most_common_attack_types": [a['attack_type'] for a in attack_intel_data['attacks'][:3]] if attack_intel_data['attacks'] else [],
            "key_insights": insights_data,
        }
        return report

    async def get_data_quality_report(self) -> Dict[str, Any]:
        df = self.incident_service.load_data()
        
        if df.empty:
            return {
                "title": "Data Quality Report",
                "date_generated": pd.Timestamp.now().strftime("%Y-%m-%d %H:%M:%S"),
                "total_records": 0,
                "missing_sector_percentage": 100.0,
                "missing_attack_type_percentage": 100.0,
                "missing_incident_dates_percentage": 100.0,
                "data_completeness_percentage": 0.0,
                "notes": "No data available."
            }

        total_records = len(df)
        
        # Missing sector %
        missing_sector = df['sector'].isin(['Unknown', None, '']).sum()
        missing_sector_percentage = (missing_sector / total_records) * 100 if total_records > 0 else 0.0

        # Missing attack type %
        missing_attack_type = df['attack_type'].isin(['Unknown', None, '']).sum()
        missing_attack_type_percentage = (missing_attack_type / total_records) * 100 if total_records > 0 else 0.0
        
        # Missing incident dates %
        # Assuming incident_date can be None or an empty string, or not a valid date
        missing_incident_dates = df['incident_date'].isnull().sum() + df['incident_date'].apply(lambda x: x == '' or x == 'Unknown').sum()
        missing_incident_dates_percentage = (missing_incident_dates / total_records) * 100 if total_records > 0 else 0.0

        data_completeness_percentage = (
            (100 - missing_sector_percentage)
            + (100 - missing_attack_type_percentage)
            + (100 - missing_incident_dates_percentage)
        ) / 3.0

        report = {
            "title": "Data Quality Report",
            "date_generated": pd.Timestamp.now().strftime("%Y-%m-%d %H:%M:%S"),
            "total_records": total_records,
            "missing_sector_percentage": round(missing_sector_percentage, 2),
            "missing_attack_type_percentage": round(missing_attack_type_percentage, 2),
            "missing_incident_dates_percentage": round(missing_incident_dates_percentage, 2),
            "data_completeness_percentage": round(data_completeness_percentage, 2),
            "notes": "Calculated from the processed incident dataset. 'Unknown' or empty values are counted as missing."
        }
        return report
