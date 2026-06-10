import os
import json
from .base import AIProvider
from typing import Optional

MOCK_DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "data", "mock", "ai_fallbacks.json")

class LocalFallbackProvider(AIProvider):
    @property
    def name(self) -> str:
        return "Local Fallback"

    def _load_mock_data(self) -> dict:
        if os.path.exists(MOCK_DATA_PATH):
            try:
                with open(MOCK_DATA_PATH, "r") as f:
                    return json.load(f)
            except Exception:
                return {}
        return {}

    async def generate_text(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        mock_responses = self._load_mock_data()
        
        if "Executive Summary" in prompt:
            return mock_responses.get("executive_summary", "Executive summary unavailable.")
        
        if "Sector" in prompt:
            return mock_responses.get("sector_brief", "Sector brief unavailable.")
            
        if "Trend" in prompt:
            return mock_responses.get("trend_brief", "Trend brief unavailable.")

        if "Risk" in prompt:
            return mock_responses.get("risk_brief", "Risk brief unavailable.")

        return mock_responses.get("default", "AI analysis unavailable.")
