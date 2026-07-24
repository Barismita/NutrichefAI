from fastapi import APIRouter, status
from app.schemas.pantry_schema import PantryRequest, PantryResponse
from app.services.pantry_service import (
    get_pantry,
    create_or_update_pantry,
    delete_ingredient,
)

router = APIRouter(prefix="/pantry", tags=["Pantry"])

@router.post(
    "",
    response_model=PantryResponse,
    status_code=status.HTTP_200_OK,
    summary="Create or update pantry",
)
async def post_pantry(request: PantryRequest):
    pantry = await create_or_update_pantry(request.ingredients)
    return PantryResponse(ingredients=pantry.ingredients)

@router.get(
    "",
    response_model=PantryResponse,
    summary="Get pantry",
)
async def get_pantry_route():
    pantry = await get_pantry()
    if not pantry:
        return PantryResponse(ingredients=[])
    return PantryResponse(ingredients=pantry.ingredients)

@router.delete(
    "/{ingredient}",
    response_model=PantryResponse,
    summary="Delete ingredient from pantry",
)
async def delete_ingredient_route(ingredient: str):
    pantry = await delete_ingredient(ingredient)
    return PantryResponse(ingredients=pantry.ingredients)
