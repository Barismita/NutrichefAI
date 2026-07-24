from typing import List

from pydantic import BaseModel, Field


class IngredientSubstitutionRequest(BaseModel):
    """Request schema for ingredient substitution."""

    ingredient: str = Field(..., min_length=1, description="Ingredient to substitute")


class IngredientSubstitutionResponse(BaseModel):
    """Response schema for ingredient substitution."""

    ingredient: str
    substitutes: List[str]
