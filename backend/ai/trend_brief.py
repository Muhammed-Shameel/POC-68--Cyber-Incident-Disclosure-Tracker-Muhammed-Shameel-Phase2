import json
from .providers.factory import get_provider
from .prompt_templates import SYSTEM_PROMPT, ATTACK_TREND_PROMPT
from services.intelligence_service import IntelligenceService

async def generate_trend_brief():
    intelligence_service = IntelligenceService()
    attack_data = intelligence_service.get_attacks()
    
    prompt = ATTACK_TREND_PROMPT.format(
        attack_data=json.dumps(attack_data, indent=2)
    )
    
    provider = get_provider()
    return await provider.generate_text(prompt, system_prompt=SYSTEM_PROMPT)
