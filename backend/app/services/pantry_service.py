from fastapi import HTTPException

from app.config.constants import USER_ID
from app.models.pantry_model import Pantry
from app.schemas.pantry_schema import Ingredient


async def get_pantry() -> Pantry | None:
    return await Pantry.find_one(Pantry.user_id == USER_ID)


async def add_ingredient(ingredient) -> Pantry:
    pantry = await Pantry.find_one(Pantry.user_id == USER_ID)

    new_ingredient = Ingredient(
        name=ingredient.name,
        quantity=ingredient.quantity,
        unit=ingredient.unit,
        category=ingredient.category,
        expiry_date=ingredient.expiry_date,
        notes=ingredient.notes,
    )

    if pantry:
        # Prevent duplicate ingredient names
        for item in pantry.ingredients:
            if item.name.lower() == new_ingredient.name.lower():
                raise HTTPException(
                    status_code=400,
                    detail=f"{new_ingredient.name} already exists in pantry.",
                )

        pantry.ingredients.append(new_ingredient)
        await pantry.save()

    else:
        pantry = Pantry(
            user_id=USER_ID,
            ingredients=[new_ingredient],
        )
        await pantry.insert()

    return pantry


async def delete_ingredient(name: str) -> Pantry:
    pantry = await Pantry.find_one(Pantry.user_id == USER_ID)

    if not pantry:
        raise HTTPException(status_code=404, detail="Pantry not found")

    original_count = len(pantry.ingredients)

    pantry.ingredients = [
        ingredient
        for ingredient in pantry.ingredients
        if ingredient.name.lower() != name.lower()
    ]

    if len(pantry.ingredients) == original_count:
        raise HTTPException(
            status_code=404,
            detail="Ingredient not found",
        )

    await pantry.save()

    return pantry
