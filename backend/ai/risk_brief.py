import json
from .providers.factory import get_provider
from .prompt_templates import SYSTEM_PROMPT, RISK_BRIEF_PROMPT
from services.intelligence_service import IntelligenceService

async def generate_risk_brief():
    intelligence_service = IntelligenceService()
    high_risk_data = intelligence_service.get_high_risk()
    
    prompt = RISK_BRIEF_PROMPT.format(
        high_risk_data=json.dumps(high_risk_data, indent=2)
    )
    
    provider = get_provider()
    return await provider.generate_text(prompt, system_prompt=SYSTEM_PROMPT)
