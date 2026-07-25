from typing import List

from pydantic import BaseModel, Field, field_validator

from app.schemas.recipe_generation_schema import RecipeGenerationResponse


class StartCookingRequest(BaseModel):
    recipe: RecipeGenerationResponse


class StepNavigationRequest(BaseModel):
    recipe: RecipeGenerationResponse
    current_step: int = Field(..., ge=1)


class CookingQuestionRequest(BaseModel):
    recipe: RecipeGenerationResponse
    current_step: int = Field(..., ge=1)
    question: str = Field(..., min_length=1)

    model_config = {"str_strip_whitespace": True}

    @field_validator("question")
    @classmethod
    def validate_question(cls, value: str) -> str:
        if not value:
            raise ValueError("Question cannot be empty.")
        return value


class CookingGuideResponse(BaseModel):
    current_step: int
    instruction: str
    tips: List[str] = Field(default_factory=list)


class CookingQuestionResponse(BaseModel):
    answer: str


class CookingFinishResponse(BaseModel):
    message: str
