from typing import List, Optional

from pydantic import BaseModel, Field


class RecipeGenerationRequest(BaseModel):
    ingredients: List[str] = Field(..., min_items=1)
    cuisine: Optional[str] = None
    diet: Optional[str] = None
    max_cooking_time: Optional[int] = Field(None, gt=0)
    servings: Optional[int] = Field(None, gt=0)
    additional_instructions: Optional[str] = None


class NutritionSchema(BaseModel):
    calories: float = Field(..., ge=0)
    protein: float = Field(..., ge=0)
    carbohydrates: float = Field(..., ge=0)
    fat: float = Field(..., ge=0)


class RecipeGenerationResponse(BaseModel):
    title: str
    description: Optional[str] = None
    ingredients: List[str]
    instructions: List[str]
    cooking_time_minutes: int
    servings: int
    difficulty: str
    cuisine: Optional[str] = None
    dietary_tags: List[str] = Field(default_factory=list)
    nutrition: NutritionSchema
    image_prompt: Optional[str] = None
