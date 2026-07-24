from pymongo import AsyncMongoClient
from beanie import init_beanie

from app.config.settings import settings
from app.models.recipe_model import Recipe
from app.models.pantry_model import Pantry

client = AsyncMongoClient(settings.mongo_uri)

database = client[settings.database_name]


async def init_db():
    await init_beanie(
        database=database,
        document_models=[
            Pantry,
            Recipe,
        ],
    )