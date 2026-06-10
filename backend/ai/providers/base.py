from abc import ABC, abstractmethod
from typing import Optional

class AIProvider(ABC):
    @abstractmethod
    async def generate_text(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        pass

    @property
    @abstractmethod
    def name(self) -> str:
        pass
