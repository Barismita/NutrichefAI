from app.config.constants import INGREDIENT_SUBSTITUTIONS


class AIService:
    """
    Provides AI-powered culinary assistance.
    Currently supports mock ingredient substitution.
    Future implementations may integrate OpenAI,
    Gemini or other LLM providers.
    """

    @classmethod
    async def get_substitutes(cls, ingredient: str) -> list[str] | None:
        return INGREDIENT_SUBSTITUTIONS.get(ingredient.strip().lower())
