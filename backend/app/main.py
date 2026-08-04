from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.assistant_api import router as assistant_router
from app.api.cooking_guide_api import router as cooking_guide_router
from app.api.expiry_api import router as expiry_router
from app.api.leftover_api import router as leftover_router
from app.api.nutrition_api import router as nutrition_router
from app.api.pantry_api import router as pantry_router
from app.api.recipe_api import router as recipe_router
from app.api.recipe_generation_api import router as recipe_generation_router
from app.api.saved_recipe_api import router as saved_recipe_router
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

# Core
app.include_router(recipe_router)
app.include_router(recipe_generation_router)
app.include_router(saved_recipe_router)

# Pantry
app.include_router(pantry_router)

# AI
app.include_router(assistant_router)
app.include_router(cooking_guide_router)
app.include_router(nutrition_router)
app.include_router(leftover_router)
app.include_router(expiry_router)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Welcome to NutriChef AI"}


@app.get("/health")
async def health():
    return {"status": "healthy"}
