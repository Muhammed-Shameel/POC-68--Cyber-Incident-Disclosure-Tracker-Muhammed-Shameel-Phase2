import time
from typing import Dict, Optional
from ai.executive_summary import generate_executive_summary
from ai.sector_brief import generate_sector_brief
from ai.trend_brief import generate_trend_brief
from ai.risk_brief import generate_risk_brief

class AIService:
    def __init__(self):
        self._cache = {}
        self._cache_expiry = 3600  # AI summaries cache for 1 hour

    def _get_cached(self, key: str) -> Optional[str]:
        if key in self._cache:
            data, timestamp = self._cache[key]
            if time.time() - timestamp < self._cache_expiry:
                return data
        return None

    def _set_cache(self, key: str, data: str):
        self._cache[key] = (data, time.time())

    async def get_executive_summary(self, force_refresh: bool = False) -> str:
        cache_key = "executive_summary"
        if not force_refresh:
            cached = self._get_cached(cache_key)
            if cached: return cached
        
        result = await generate_executive_summary()
        self._set_cache(cache_key, result)
        return result

    async def get_sector_brief(self, force_refresh: bool = False) -> str:
        cache_key = "sector_brief"
        if not force_refresh:
            cached = self._get_cached(cache_key)
            if cached: return cached
        
        result = await generate_sector_brief()
        self._set_cache(cache_key, result)
        return result

    async def get_trend_brief(self, force_refresh: bool = False) -> str:
        cache_key = "trend_brief"
        if not force_refresh:
            cached = self._get_cached(cache_key)
            if cached: return cached
        
        result = await generate_trend_brief()
        self._set_cache(cache_key, result)
        return result

    async def get_risk_brief(self, force_refresh: bool = False) -> str:
        cache_key = "risk_brief"
        if not force_refresh:
            cached = self._get_cached(cache_key)
            if cached: return cached
        
        result = await generate_risk_brief()
        self._set_cache(cache_key, result)
        return result
