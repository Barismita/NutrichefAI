from datetime import UTC, datetime
from typing import List, Optional

from fastapi import HTTPException

from app.models.recipe_model import Recipe
from app.schemas.recipe_schema import RecipeCreate, RecipeUpdate


async def create_recipe(data: RecipeCreate) -> Recipe:
    recipe = Recipe(**data.model_dump())
    await recipe.insert()
    return recipe


async def get_recipes(
    cuisine: Optional[str] = None,
    difficulty: Optional[str] = None,
    dietary_tag: Optional[str] = None,
) -> List[Recipe]:
    query = {}
    if cuisine:
        query["cuisine"] = cuisine
    if difficulty:
        query["difficulty"] = difficulty
    if dietary_tag:
        query["dietary_tags"] = dietary_tag
    return await Recipe.find(query).to_list()


async def get_recipe(recipe_id: str) -> Recipe:
    recipe = await Recipe.get(recipe_id)
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return recipe


async def update_recipe(recipe_id: str, data: RecipeUpdate) -> Recipe:
    recipe = await get_recipe(recipe_id)
    update_data = data.model_dump(exclude_unset=True)
    if update_data:
        _validate_recipe_data_partial(update_data)
        for field, value in update_data.items():
            setattr(recipe, field, value)
        recipe.updated_at = datetime.now(UTC)
        await recipe.save()
    return recipe


async def delete_recipe(recipe_id: str) -> None:
    recipe = await get_recipe(recipe_id)
    await recipe.delete()


def _validate_recipe_data(data):
    if not data.title.strip():
        raise HTTPException(status_code=400, detail="Title cannot be empty")
    if not data.ingredients or not all(i.strip() for i in data.ingredients):
        raise HTTPException(status_code=400, detail="Ingredients cannot be empty")
    if not data.instructions or not all(i.strip() for i in data.instructions):
        raise HTTPException(status_code=400, detail="Instructions cannot be empty")
    if data.cooking_time_minutes <= 0:
        raise HTTPException(status_code=400, detail="Cooking time must be positive")
    if data.servings <= 0:
        raise HTTPException(status_code=400, detail="Servings must be positive")


def _validate_recipe_data_partial(data):
    if "title" in data and not data["title"].strip():
        raise HTTPException(status_code=400, detail="Title cannot be empty")
    if "ingredients" in data and (
        not data["ingredients"] or not all(i.strip() for i in data["ingredients"])
    ):
        raise HTTPException(status_code=400, detail="Ingredients cannot be empty")
    if "instructions" in data and (
        not data["instructions"] or not all(i.strip() for i in data["instructions"])
    ):
        raise HTTPException(status_code=400, detail="Instructions cannot be empty")
    if "cooking_time_minutes" in data and data["cooking_time_minutes"] <= 0:
        raise HTTPException(status_code=400, detail="Cooking time must be positive")
    if "servings" in data and data["servings"] <= 0:
        raise HTTPException(status_code=400, detail="Servings must be positive")
