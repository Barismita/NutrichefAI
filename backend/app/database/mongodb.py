from beanie import init_beanie
from pymongo import AsyncMongoClient

from app.config.settings import settings
from app.models.pantry_model import Pantry
from app.models.profile_model import Profile
from app.models.recipe_model import Recipe

client = AsyncMongoClient(settings.mongo_uri)

database = client[settings.database_name]


async def init_db():
    await init_beanie(
        database=database,
        document_models=[Pantry, Recipe, Profile],
    )
