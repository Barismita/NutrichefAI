from typing import List

from pydantic import BaseModel, Field, field_validator

# --------------------------------------------------------------------
# Requests
# --------------------------------------------------------------------


class NutritionAnalysisRequest(BaseModel):
    """Request schema for nutrition analysis."""

    model_config = {"str_strip_whitespace": True}

    recipe_name: str = Field(
        ...,
        min_length=1,
        description="Recipe name",
    )

    ingredients: List[str] = Field(
        ...,
        min_length=1,
        description="List of recipe ingredients",
    )

    @field_validator("recipe_name")
    @classmethod
    def validate_recipe_name(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("Recipe name cannot be empty.")
        return value

    @field_validator("ingredients")
    @classmethod
    def validate_ingredients(cls, value: List[str]) -> List[str]:
        if not value:
            raise ValueError("At least one ingredient is required.")

        cleaned = [ingredient.strip() for ingredient in value if ingredient.strip()]

        if not cleaned:
            raise ValueError("Ingredients cannot be empty.")

        return cleaned


class HealthyAlternativesRequest(BaseModel):
    """Request schema for healthy alternatives."""

    model_config = {"str_strip_whitespace": True}

    ingredients: List[str] = Field(
        ...,
        min_length=1,
        description="Ingredients to replace",
    )

    @field_validator("ingredients")
    @classmethod
    def validate_ingredients(cls, value: List[str]) -> List[str]:
        if not value:
            raise ValueError("At least one ingredient is required.")

        cleaned = [ingredient.strip() for ingredient in value if ingredient.strip()]

        if not cleaned:
            raise ValueError("Ingredients cannot be empty.")

        return cleaned


# --------------------------------------------------------------------
# Shared Models
# --------------------------------------------------------------------


class NutritionFacts(BaseModel):
    calories: float = Field(..., ge=0)
    protein: float = Field(..., ge=0)
    carbohydrates: float = Field(..., ge=0)
    fat: float = Field(..., ge=0)
    fibre: float = Field(..., ge=0)
    sugar: float = Field(..., ge=0)
    sodium: float = Field(..., ge=0)


class HealthyAlternative(BaseModel):
    ingredient: str = Field(...)
    alternative: str = Field(...)
    reason: str = Field(...)


# --------------------------------------------------------------------
# Responses
# --------------------------------------------------------------------


class NutritionAnalysisResponse(BaseModel):
    nutrition: NutritionFacts

    health_score: int = Field(
        ...,
        ge=1,
        le=10,
        description="Overall health score",
    )

    dietary_tags: List[str] = Field(
        default_factory=list,
        description="Dietary suitability tags",
    )

    summary: str = Field(
        ...,
        description="Overall nutrition summary",
    )


class HealthyAlternativesResponse(BaseModel):
    alternatives: List[HealthyAlternative] = Field(
        default_factory=list,
        description="Healthy ingredient alternatives",
    )

    tips: List[str] = Field(
        default_factory=list,
        description="Additional health tips",
    )
