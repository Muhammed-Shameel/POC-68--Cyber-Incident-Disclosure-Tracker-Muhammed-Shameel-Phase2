from .base import AIProvider
from typing import Optional
import os
import anthropic

class AnthropicProvider(AIProvider):
    def __init__(self, api_key: str, model: str = "claude-3-5-sonnet-20240620"):
        self.client = anthropic.AsyncAnthropic(api_key=api_key)
        self.model = model

    @property
    def name(self) -> str:
        return f"Anthropic ({self.model})"

    async def generate_text(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        try:
            response = await self.client.messages.create(
                model=self.model,
                max_tokens=1000,
                system=system_prompt if system_prompt else "",
                messages=[
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7
            )
            return response.content[0].text
        except Exception as e:
            return f"Error generating text with Anthropic: {str(e)}"
