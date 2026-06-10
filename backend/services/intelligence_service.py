import pandas as pd
from typing import Dict, List
from services.incident_service import IncidentService
from analytics.trend_analysis import calculate_trends
from analytics.sector_analysis import calculate_sector_intelligence
from analytics.attack_analysis import calculate_attack_intelligence
from analytics.risk_analysis import calculate_risk_intelligence
from analytics.insights import generate_insights
import time

class IntelligenceService:
    def __init__(self):
        self.incident_service = IncidentService()
        self._cache = {}
        self._cache_expiry = 300  # 5 minutes

    def _get_cached(self, key: str):
        if key in self._cache:
            data, timestamp = self._cache[key]
            if time.time() - timestamp < self._cache_expiry:
                return data
        return None

    def _set_cache(self, key: str, data):
        self._cache[key] = (data, time.time())

    def get_trends(self) -> Dict:
        cached = self._get_cached("trends")
        if cached: return cached
        
        df = self.incident_service.load_data()
        result = calculate_trends(df)
        self._set_cache("trends", result)
        return result

    def get_sectors(self) -> Dict:
        cached = self._get_cached("sectors")
        if cached: return cached
        
        df = self.incident_service.load_data()
        result = calculate_sector_intelligence(df)
        self._set_cache("sectors", result)
        return result

    def get_attacks(self) -> Dict:
        cached = self._get_cached("attacks")
        if cached: return cached
        
        df = self.incident_service.load_data()
        result = calculate_attack_intelligence(df)
        self._set_cache("attacks", result)
        return result

    def get_high_risk(self) -> List[Dict]:
        cached = self._get_cached("high_risk")
        if cached: return cached
        
        df = self.incident_service.load_data()
        result = calculate_risk_intelligence(df)
        self._set_cache("high_risk", result)
        return result

    def get_insights(self) -> List[str]:
        cached = self._get_cached("insights")
        if cached: return cached
        
        df = self.incident_service.load_data()
        result = generate_insights(df)
        self._set_cache("insights", result)
        return result
