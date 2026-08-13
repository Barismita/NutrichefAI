import os

from app.services.providers.gemini_provider import GeminiProvider
from app.services.providers.openrouter_provider import OpenRouterProvider


class AIService:

    provider_map = {
        "gemini": GeminiProvider,
        "openrouter": OpenRouterProvider,
    }

    @classmethod
    def get_providers(cls):
        providers = []

        for key in [
            "PRIMARY_AI_PROVIDER",
            "FALLBACK_AI_PROVIDER",
            "LOCAL_PROVIDER",
        ]:
            provider_name = os.getenv(key)

            if not provider_name:
                continue

            provider_name = provider_name.lower()

            if provider_name == "ollama":
                try:
                    from app.services.providers.ollama_provider import OllamaProvider

                    providers.append(OllamaProvider())
                except ImportError as e:
                    print(f"Ollama provider unavailable: {e}")

            elif provider_name in cls.provider_map:
                providers.append(cls.provider_map[provider_name]())

        return providers

    @classmethod
    async def generate(cls, prompt: str):

        providers = cls.get_providers()

        if not providers:
            raise RuntimeError(
                "No AI provider configured. "
                "Set PRIMARY_AI_PROVIDER or FALLBACK_AI_PROVIDER."
            )

        last_error = None

        for provider in providers:
            try:
                response = await provider.generate(prompt)

                return (
                    response
                    .replace("```json", "")
                    .replace("```", "")
                    .strip()
                )

            except Exception as e:
                print(
                    f"{provider.__class__.__name__} failed: {e}"
                )
                last_error = e

        raise RuntimeError(last_error)
