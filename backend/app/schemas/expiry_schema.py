from typing import List

from pydantic import BaseModel, Field, field_validator

# --------------------------------------------------------------------
# Requests
# --------------------------------------------------------------------


class ExpiryIngredient(BaseModel):
    """Represents a pantry ingredient with its expiry date."""

    model_config = {"str_strip_whitespace": True}

    name: str = Field(
        ...,
        description="Ingredient name",
    )

    expiry_date: str = Field(
        ...,
        description="Expiry date in YYYY-MM-DD format",
    )

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("Ingredient name cannot be empty.")
        return value

    @field_validator("expiry_date")
    @classmethod
    def validate_expiry_date(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("Expiry date cannot be empty.")
        return value


class ExpiryRequest(BaseModel):
    """Request schema for pantry expiry analysis."""

    ingredients: List[ExpiryIngredient] = Field(
        ...,
        min_length=1,
        description="List of pantry ingredients",
    )

    @field_validator("ingredients")
    @classmethod
    def validate_ingredients(
        cls,
        value: List[ExpiryIngredient],
    ) -> List[ExpiryIngredient]:
        if not value:
            raise ValueError("At least one ingredient is required.")
        return value


# --------------------------------------------------------------------
# Shared Models
# --------------------------------------------------------------------


class ExpiringIngredient(BaseModel):
    ingredient: str = Field(
        ...,
        description="Ingredient name",
    )

    days_remaining: int = Field(
        ...,
        ge=0,
        description="Number of days remaining until expiry",
    )

    urgency: str = Field(
        ...,
        description="Urgency level",
    )

    recommendation: str = Field(
        ...,
        description="Suggested way to use the ingredient",
    )


class ExpiredIngredient(BaseModel):
    ingredient: str = Field(
        ...,
        description="Expired ingredient name",
    )

    recommendation: str = Field(
        ...,
        description="Safe disposal recommendation",
    )


# --------------------------------------------------------------------
# Response
# --------------------------------------------------------------------


class ExpiryResponse(BaseModel):
    expiring_soon: List[ExpiringIngredient] = Field(
        default_factory=list,
        description="Ingredients nearing expiry",
    )

    expired: List[ExpiredIngredient] = Field(
        default_factory=list,
        description="Expired ingredients",
    )

    general_tips: List[str] = Field(
        default_factory=list,
        description="General food storage tips",
    )
