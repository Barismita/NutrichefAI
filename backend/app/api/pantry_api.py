from fastapi import APIRouter, HTTPException, status

from app.schemas.pantry_schema import (
    Ingredient,
    PantryResponse,
)
from app.services.pantry_service import (
    add_ingredient,
    delete_ingredient,
    get_pantry,
    update_ingredient
)

router = APIRouter(
    prefix="/pantry",
    tags=["Pantry"],
)


@router.get(
    "",
    response_model=PantryResponse,
    summary="Get pantry",
)
async def get_pantry_route():
    pantry = await get_pantry()

    if pantry is None:
        return PantryResponse(ingredients=[])

    return PantryResponse(ingredients=pantry.ingredients)


@router.post(
    "",
    response_model=PantryResponse,
    status_code=status.HTTP_201_CREATED,
)
async def add_ingredient_route(request: Ingredient):
    pantry = await add_ingredient(request)
    return PantryResponse(ingredients=pantry.ingredients)

@router.put(
    "/{ingredient_name}",
    response_model=PantryResponse,
    summary="Update ingredient",
)
async def update_ingredient_route(
    ingredient_name: str,
    request: Ingredient,
):
    pantry = await update_ingredient(
        ingredient_name,
        request,
    )

    return PantryResponse(
        ingredients=pantry.ingredients,
    )

@router.delete(
    "/{ingredient_name}",
    response_model=PantryResponse,
    summary="Delete ingredient",
)
async def delete_ingredient_route(ingredient_name: str):
    pantry = await delete_ingredient(ingredient_name)

    if pantry is None:
        raise HTTPException(
            status_code=404,
            detail="Pantry not found",
        )

    return PantryResponse(
        ingredients=pantry.ingredients,
    )
