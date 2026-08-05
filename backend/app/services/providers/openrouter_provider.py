import os

from openai import AsyncOpenAI

from .base import BaseAIProvider


class OpenRouterProvider(BaseAIProvider):

    def __init__(self):

        self.client = AsyncOpenAI(
            api_key=os.getenv("OPENROUTER_API_KEY"),
            base_url="https://openrouter.ai/api/v1",
        )

    async def generate(self, prompt: str):

        response = await self.client.chat.completions.create(
            model="google/gemma-3-27b-it",
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
        )

        return response.choices[0].message.content
