from typing import List

from pydantic import BaseModel, Field


class Ingredient(BaseModel):
    name: str = Field(..., min_length=1)
    quantity: float
    unit: str
    category: str
    expiry_date: str | None = None
    notes: str | None = None


class PantryResponse(BaseModel):
    ingredients: List[Ingredient]
