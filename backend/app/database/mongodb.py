from beanie import init_beanie
from pymongo import AsyncMongoClient

from app.config.settings import settings
from app.models.pantry_model import Pantry
from app.models.recipe_model import Recipe
from app.models.saved_recipe_model import SavedRecipe

client = AsyncMongoClient(settings.mongo_uri)

database = client[settings.database_name]
print("Database:", settings.database_name)
print("Mongo URI:", settings.mongo_uri)


async def init_db():
    await init_beanie(
        database=database,
        document_models=[Pantry, Recipe, SavedRecipe],
    )
