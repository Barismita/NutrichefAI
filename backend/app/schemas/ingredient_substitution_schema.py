from typing import List

from pydantic import BaseModel, Field, field_validator


class IngredientSubstitutionRequest(BaseModel):
    ingredient: str = Field(..., min_length=1)

    @field_validator("ingredient")
    @classmethod
    def validate_ingredient(cls, value: str):
        if not value.strip():
            raise ValueError("Ingredient cannot be blank")
        return value.strip()


class IngredientSubstitutionResponse(BaseModel):
    """Response schema for ingredient substitution."""

    ingredient: str
    substitutes: List[str]
