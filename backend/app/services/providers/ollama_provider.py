import os

import ollama

from app.services.providers.base import BaseAIProvider


class OllamaProvider(BaseAIProvider):

    async def generate(self, prompt: str) -> str:
        response = ollama.chat(
            model=os.getenv("OLLAMA_MODEL", "qwen3:8b"),
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
        )

        return response["message"]["content"]
