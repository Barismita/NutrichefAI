from typing import List

from pydantic import BaseModel, Field, field_validator

# --------------------------------------------------------------------
# Requests
# --------------------------------------------------------------------


class LeftoverRecipeRequest(BaseModel):
    """Request schema for leftover recipe suggestions."""

    model_config = {"str_strip_whitespace": True}

    ingredients: List[str] = Field(
        ...,
        min_length=1,
        description="List of leftover ingredients",
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


class SuggestedRecipe(BaseModel):
    title: str = Field(
        ...,
        description="Recipe title",
    )

    description: str = Field(
        ...,
        description="Recipe description",
    )

    difficulty: str = Field(
        ...,
        description="Recipe difficulty",
    )

    estimated_time: int = Field(
        ...,
        ge=1,
        description="Estimated cooking time in minutes",
    )

    required_ingredients: List[str] = Field(
        default_factory=list,
        description="Ingredients available with the user",
    )

    optional_ingredients: List[str] = Field(
        default_factory=list,
        description="Optional ingredients that improve the recipe",
    )

    waste_reduction_tip: str = Field(
        ...,
        description="Tip to reduce food waste",
    )


# --------------------------------------------------------------------
# Response
# --------------------------------------------------------------------


class LeftoverRecipeResponse(BaseModel):
    recipes: List[SuggestedRecipe] = Field(
        default_factory=list,
        description="Suggested recipes",
    )

    general_tips: List[str] = Field(
        default_factory=list,
        description="General food storage and waste reduction tips",
    )
