from typing import List

from pydantic import BaseModel, field_validator


class PantryRequest(BaseModel):
    ingredients: List[str]

    @field_validator("ingredients")
    @classmethod
    def validate_ingredients(cls, v):
        normalized = []
        for item in v:
            norm = item.strip().lower()
            if not norm:
                raise ValueError("Ingredient cannot be empty or whitespace")
            normalized.append(norm)
        return normalized


class PantryResponse(BaseModel):
    ingredients: List[str]
