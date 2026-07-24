from datetime import datetime
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field


class NutritionSchema(BaseModel):
    calories: float = Field(..., ge=0)
    protein: float = Field(..., ge=0)
    carbohydrates: float = Field(..., ge=0)
    fat: float = Field(..., ge=0)


class RecipeBase(BaseModel):
    title: str = Field(..., min_length=1)
    description: Optional[str] = None
    ingredients: List[str] = Field(..., min_items=1)
    instructions: List[str] = Field(..., min_items=1)
    cooking_time_minutes: int = Field(..., gt=0)
    servings: int = Field(..., gt=0)
    cuisine: str
    dietary_tags: list[str] = Field(default_factory=list)
    nutrition: NutritionSchema
    image_url: Optional[str] = None

    class Difficulty(str, Enum):
        EASY = "easy"
        MEDIUM = "medium"
        HARD = "hard"


class RecipeCreate(RecipeBase):
    pass


class RecipeUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1)
    description: Optional[str] = None
    ingredients: Optional[List[str]] = None
    instructions: Optional[List[str]] = None
    cooking_time_minutes: Optional[int] = Field(None, gt=0)
    servings: Optional[int] = Field(None, gt=0)
    difficulty: Optional[str] = None
    cuisine: Optional[str] = None
    dietary_tags: Optional[List[str]] = None
    nutrition: Optional[NutritionSchema] = None
    image_url: Optional[str] = None


class RecipeResponse(RecipeBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
