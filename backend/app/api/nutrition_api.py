from fastapi import APIRouter, status

from app.schemas.nutrition_schema import (
    HealthyAlternativesRequest,
    HealthyAlternativesResponse,
    NutritionAnalysisRequest,
    NutritionAnalysisResponse,
)
from app.services.nutrition_service import (
    analyze_nutrition,
    suggest_healthy_alternatives,
)

router = APIRouter(
    prefix="/nutrition",
    tags=["Nutrition"],
)


@router.post(
    "/analyze",
    response_model=NutritionAnalysisResponse,
    status_code=status.HTTP_200_OK,
    summary="Analyze Recipe Nutrition",
    description=(
        "Analyze the nutritional value of a recipe including calories, "
        "macronutrients, dietary suitability and overall health score."
    ),
    responses={
        200: {"description": "Nutrition analysis generated successfully."},
        422: {"description": "Validation error."},
        502: {"description": "AI provider or response error."},
    },
)
async def analyze_recipe_nutrition(
    request: NutritionAnalysisRequest,
) -> NutritionAnalysisResponse:
    """
    Analyze the nutrition profile of a recipe.

    Args:
        request: Recipe details including name and ingredients.

    Returns:
        NutritionAnalysisResponse containing nutrition facts,
        health score, dietary tags and summary.
    """
    return await analyze_nutrition(request)


@router.post(
    "/healthy-alternatives",
    response_model=HealthyAlternativesResponse,
    status_code=status.HTTP_200_OK,
    summary="Suggest Healthy Alternatives",
    description=(
        "Suggest healthier ingredient alternatives with reasons "
        "and additional health tips."
    ),
    responses={
        200: {"description": "Healthy alternatives generated successfully."},
        422: {"description": "Validation error."},
        502: {"description": "AI provider or response error."},
    },
)
async def get_healthy_alternatives(
    request: HealthyAlternativesRequest,
) -> HealthyAlternativesResponse:
    """
    Suggest healthier ingredient substitutions.

    Args:
        request: List of ingredients.

    Returns:
        HealthyAlternativesResponse containing recommended substitutions.
    """
    return await suggest_healthy_alternatives(request)
