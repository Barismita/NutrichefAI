from datetime import UTC, datetime

from beanie import Document
from pydantic import Field


class SavedRecipe(Document):
    title: str
    description: str = ""

    difficulty: str = ""

    estimated_time: int = 0
    prep_time: int = 0
    cook_time: int = 0

    servings: int = 1

    required_ingredients: list[str] = Field(default_factory=list)
    optional_ingredients: list[str] = Field(default_factory=list)

    steps: list[str] = Field(default_factory=list)

    nutrition: dict = Field(default_factory=dict)

    waste_reduction_tip: str = ""

    source: str = "generated"

    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))

    class Settings:
        name = "saved_recipes"
