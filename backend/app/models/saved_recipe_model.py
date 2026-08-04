from datetime import UTC, datetime

from beanie import Document
from pydantic import Field


class SavedRecipe(Document):
    title: str
    description: str

    ingredients: list[str] = Field(default_factory=list)
    instructions: list[str] = Field(default_factory=list)

    cooking_time_minutes: int
    servings: int

    difficulty: str
    cuisine: str

    dietary_tags: list[str] = Field(default_factory=list)

    nutrition: dict = Field(default_factory=dict)

    image_prompt: str = ""

    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))

    class Settings:
        name = "saved_recipes"
