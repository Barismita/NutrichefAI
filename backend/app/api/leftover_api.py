from fastapi import APIRouter, status

from app.schemas.leftover_schema import (
    LeftoverRecipeRequest,
    LeftoverRecipeResponse,
)
from app.services.leftover_service import (
    suggest_leftover_recipes,
)

router = APIRouter(
    prefix="/leftovers",
    tags=["Leftover Recipes"],
)


@router.post(
    "/suggest",
    response_model=LeftoverRecipeResponse,
    status_code=status.HTTP_200_OK,
    summary="Suggest Recipes from Leftover Ingredients",
    description=(
        "Generate recipes using leftover ingredients while minimizing food waste."
    ),
    responses={
        200: {"description": "Recipes generated successfully."},
        422: {"description": "Validation error."},
        502: {"description": "AI provider or response error."},
    },
)
async def suggest_recipes(
    request: LeftoverRecipeRequest,
) -> LeftoverRecipeResponse:
    """
    Suggest recipes that can be prepared using leftover ingredients.

    Args:
        request: List of leftover ingredients.

    Returns:
        LeftoverRecipeResponse containing suggested recipes and waste
        reduction tips.
    """
    return await suggest_leftover_recipes(request)
