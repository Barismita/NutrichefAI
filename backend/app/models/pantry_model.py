from typing import List

from beanie import Document
from pydantic import Field

from app.schemas.pantry_schema import Ingredient


class Pantry(Document):
    user_id: str = Field(...)
    ingredients: List[Ingredient] = Field(default_factory=list)

    class Settings:
        name = "pantries"
