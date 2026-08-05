from abc import ABC, abstractmethod


class BaseAIProvider(ABC):

    @abstractmethod
    async def generate(self, prompt: str) -> str:
        pass
