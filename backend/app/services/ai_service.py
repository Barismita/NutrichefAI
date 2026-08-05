import os

from app.services.providers.gemini_provider import GeminiProvider
from app.services.providers.ollama_provider import OllamaProvider
from app.services.providers.openrouter_provider import OpenRouterProvider


class AIService:

    provider_map = {
        "gemini": GeminiProvider,
        "openrouter": OpenRouterProvider,
        "ollama": OllamaProvider,
    }

    @classmethod
    def get_providers(cls):
        providers = []

        for key in ["PRIMARY_AI_PROVIDER", "FALLBACK_AI_PROVIDER", "LOCAL_PROVIDER"]:
            provider_name = os.getenv(key)

            if provider_name and provider_name in cls.provider_map:
                providers.append(cls.provider_map[provider_name]())
        return providers

    @classmethod
    async def generate(cls, prompt: str):

        last_error = None

        for provider in cls.get_providers():

            try:
                response = await provider.generate(prompt)

                return response.replace("```json", "").replace("```", "").strip()

            except Exception as e:
                print(f"{provider.__class__.__name__} failed: {e}")
                last_error = e

        raise RuntimeError(last_error)
