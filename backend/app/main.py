from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.api.assistant_api import router as assistant_router
from app.api.pantry_api import router as pantry_router
from app.api.profile_api import router as profile_router
from app.api.recipe_api import router as recipe_router
from app.api.recipe_generation_api import router as ai_recipe_router
from app.config.settings import settings
from app.database.mongodb import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    print("MongoDB Connected Successfully")
    yield


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    lifespan=lifespan,
)

app.include_router(pantry_router)
app.include_router(recipe_router)
app.include_router(ai_recipe_router)
app.include_router(profile_router)
app.include_router(assistant_router)


@app.get("/")
async def root():
    return {"message": "Welcome to NutriChef AI"}


@app.get("/health")
async def health():
    return {"status": "healthy"}
