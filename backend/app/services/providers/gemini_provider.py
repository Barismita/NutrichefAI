import os

from google import genai

from .base import BaseAIProvider


class GeminiProvider(BaseAIProvider):

    def __init__(self):

        self.client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

    async def generate(self, prompt: str):

        response = self.client.models.generate_content(
            model="gemini-2.5-flash-lite",
            contents=prompt,
        )

        return response.text
