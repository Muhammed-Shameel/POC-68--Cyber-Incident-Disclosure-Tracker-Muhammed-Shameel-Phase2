import json
from .providers.factory import get_provider
from .prompt_templates import SYSTEM_PROMPT, EXECUTIVE_SUMMARY_PROMPT
from services.analytics_service import AnalyticsService
from services.intelligence_service import IntelligenceService

async def generate_executive_summary():
    analytics_service = AnalyticsService()
    intelligence_service = IntelligenceService()
    
    summary_stats = analytics_service.get_summary()
    rule_based_insights = intelligence_service.get_insights()
    trend_data = intelligence_service.get_trends()
    
    prompt = EXECUTIVE_SUMMARY_PROMPT.format(
        summary_stats=json.dumps(summary_stats, indent=2),
        rule_based_insights=json.dumps(rule_based_insights, indent=2),
        trend_data=json.dumps(trend_data, indent=2)
    )
    
    provider = get_provider()
    return await provider.generate_text(prompt, system_prompt=SYSTEM_PROMPT)
