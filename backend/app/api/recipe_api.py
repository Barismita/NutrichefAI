from typing import List, Optional

from fastapi import APIRouter, HTTPException, Query, status

from app.schemas.ingredient_substitution_schema import (
    IngredientSubstitutionRequest,
    IngredientSubstitutionResponse,
)
from app.schemas.recipe_schema import RecipeCreate, RecipeResponse, RecipeUpdate
from app.services.ai_service import AIService
from app.services.recipe_service import (
    create_recipe,
    delete_recipe,
    get_recipe,
    get_recipes,
    update_recipe,
)

router = APIRouter(prefix="/recipes", tags=["Recipes"])


@router.post("/", response_model=RecipeResponse, status_code=status.HTTP_201_CREATED)
async def create_recipe_endpoint(recipe: RecipeCreate):
    created = await create_recipe(recipe)
    return RecipeResponse.model_validate(created)


@router.get("/", response_model=List[RecipeResponse])
async def list_recipes(
    cuisine: Optional[str] = Query(None),
    difficulty: Optional[str] = Query(None),
    dietary_tag: Optional[str] = Query(None),
):
    recipes = await get_recipes(difficulty, dietary_tag)
    return [RecipeResponse.model_validate(r) for r in recipes]


@router.get("/{recipe_id}", response_model=RecipeResponse)
async def get_recipe_endpoint(recipe_id: str):
    recipe = await get_recipe(recipe_id)
    return RecipeResponse.model_validate(recipe)


@router.put("/{recipe_id}", response_model=RecipeResponse)
async def update_recipe_endpoint(recipe_id: str, data: RecipeUpdate):
    updated = await update_recipe(recipe_id, data)
    return RecipeResponse.model_validate(updated)


@router.delete("/{recipe_id}", status_code=status.HTTP_200_OK)
async def delete_recipe_endpoint(recipe_id: str):
    await delete_recipe(recipe_id)
    return {"message": "Recipe deleted successfully"}


@router.post(
    "/substitute",
    response_model=IngredientSubstitutionResponse,
    status_code=status.HTTP_200_OK,
    summary="Suggest ingredient substitutions",
    description="Suggests AI-powered ingredient substitutions for a given ingredient.",
    responses={
        200: {"description": "Substitutes found"},
        404: {"description": "No substitution available"},
        422: {"description": "Validation error"},
    },
)
async def substitute_ingredient(
    request: IngredientSubstitutionRequest,
) -> IngredientSubstitutionResponse:
    """
    Suggest ingredient substitutions using AI (mocked).

    Args:
        request: IngredientSubstitutionRequest with the ingredient to substitute.

    Returns:
        IngredientSubstitutionResponse with substitutes.

    Raises:
        HTTPException 404 if no substitutes found.
    """
    substitutes = await AIService.get_substitutes(request.ingredient)
    if not substitutes:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No substitution found for ingredient '{request.ingredient}'.",
        )
    return IngredientSubstitutionResponse(
        ingredient=request.ingredient,
        substitutes=substitutes,
    )
