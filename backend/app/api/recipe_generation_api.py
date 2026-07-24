from fastapi import APIRouter, status

from app.schemas.recipe_generation_schema import (
    RecipeGenerationRequest,
    RecipeGenerationResponse,
)
from app.services.recipe_generation_service import generate_recipe

router = APIRouter(
    prefix="/recipes",
    tags=["AI Recipe Generation"],
)


@router.post(
    "/generate",
    response_model=RecipeGenerationResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate a recipe using AI",
    description="""
    Generate a recipe using the supplied ingredients and user preferences.
    The generated recipe is returned to the client and is not automatically saved.
    """,
)
async def generate_recipe_endpoint(
    request: RecipeGenerationRequest,
):
    return await generate_recipe(request)
