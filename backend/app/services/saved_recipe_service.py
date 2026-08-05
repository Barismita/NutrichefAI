from app.models.saved_recipe_model import SavedRecipe


async def save_recipe(recipe: dict):
    obj = SavedRecipe(**recipe)
    await obj.insert()
    return obj


async def list_saved():
    recipes = await SavedRecipe.find_all().sort(-SavedRecipe.created_at).to_list()

    print(recipes)

    return recipes


async def delete_saved(recipe_id: str):
    recipe = await SavedRecipe.get(recipe_id)

    if recipe:
        await recipe.delete()
