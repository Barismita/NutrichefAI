from fastapi import APIRouter

from app.services.saved_recipe_service import (
    save_recipe,
    list_saved,
    delete_saved,
)

router = APIRouter(prefix="/saved-recipes", tags=["Saved Recipes"])


@router.get("/")
async def get_saved():
    return await list_saved()


@router.post("/")
async def save(recipe: dict):
    return await save_recipe(recipe)


@router.delete("/{recipe_id}")
async def remove(recipe_id: str):
    await delete_saved(recipe_id)
    return {"message": "Deleted"}
