from datetime import datetime, UTC
from enum import Enum
from typing import List, Optional

from beanie import Document
from pydantic import BaseModel, Field

class Nutrition(BaseModel):
    calories: float = Field(..., ge=0)
    protein: float = Field(..., ge=0)
    carbohydrates: float = Field(..., ge=0)
    fat: float = Field(..., ge=0)

class Recipe(Document):
    title: str = Field(..., min_length=1)
    description: Optional[str] = None
    ingredients: List[str] = Field(..., min_items=1)
    instructions: List[str] = Field(..., min_items=1)
    cooking_time_minutes: int = Field(..., gt=0)
    servings: int = Field(..., gt=0)
    cuisine: str
    dietary_tags: list[str] = Field(default_factory=list)
    nutrition: Nutrition
    image_url: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC))

    class Settings:
        name = "recipes"

    class Difficulty(str, Enum):
        EASY = "easy"
        MEDIUM = "medium"
        HARD = "hard"