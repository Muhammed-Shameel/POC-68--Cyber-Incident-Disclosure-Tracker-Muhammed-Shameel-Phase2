import json
from .providers.factory import get_provider
from .prompt_templates import SYSTEM_PROMPT, SECTOR_BRIEF_PROMPT
from services.intelligence_service import IntelligenceService

async def generate_sector_brief():
    intelligence_service = IntelligenceService()
    sector_data = intelligence_service.get_sectors()
    
    prompt = SECTOR_BRIEF_PROMPT.format(
        sector_data=json.dumps(sector_data, indent=2)
    )
    
    provider = get_provider()
    return await provider.generate_text(prompt, system_prompt=SYSTEM_PROMPT)
