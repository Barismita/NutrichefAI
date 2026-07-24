from typing import List
from fastapi import HTTPException

from app.config.constants import USER_ID
from app.models.pantry_model import Pantry

USER_ID = USER_ID

def normalize_ingredients(ingredients: List[str]) -> List[str]:
    seen = set()
    result = []
    for item in ingredients:
        norm = item.strip().lower()
        if not norm:
            continue
        if norm not in seen:
            seen.add(norm)
            result.append(norm)
    return result

async def get_pantry() -> Pantry:
    pantry = await Pantry.find_one(Pantry.user_id == USER_ID)
    return pantry

async def create_or_update_pantry(ingredients: List[str]) -> Pantry:
    normalized = normalize_ingredients(ingredients)
    if not normalized:
        raise HTTPException(status_code=400, detail="No valid ingredients provided")
    pantry = await Pantry.find_one(Pantry.user_id == USER_ID)
    if pantry:
        merged = normalize_ingredients(pantry.ingredients + normalized)
        pantry.ingredients = merged
        await pantry.save()
    else:
        pantry = Pantry(user_id=USER_ID, ingredients=normalized)
        await pantry.insert()
    return pantry

async def delete_ingredient(ingredient: str) -> Pantry:
    norm = ingredient.strip().lower()
    if not norm:
        raise HTTPException(status_code=400, detail="Ingredient cannot be empty")
    pantry = await Pantry.find_one(Pantry.user_id == USER_ID)
    if not pantry or norm not in pantry.ingredients:
        raise HTTPException(status_code=404, detail="Ingredient not found")
    pantry.ingredients = [i for i in pantry.ingredients if i != norm]
    await pantry.save()
    return pantry
