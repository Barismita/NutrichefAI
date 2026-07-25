from datetime import UTC, datetime

import pytest
from fastapi import HTTPException, status
from httpx import ASGITransport, AsyncClient
from pydantic import ValidationError

import app.api.recipe_api as recipe_api
import app.services.recipe_service as recipe_service
from app.main import app
from app.schemas.recipe_schema import (
    NutritionSchema,
    RecipeCreate,
    RecipeResponse,
    RecipeUpdate,
)

transport = ASGITransport(app=app)


# ------------------------------------------------------------------
# Helper
# ------------------------------------------------------------------


def sample_recipe():
    now = datetime.now(UTC)

    return {
        "id": "recipe123",
        "title": "Veg Pasta",
        "description": "Healthy pasta",
        "ingredients": ["Pasta", "Tomato"],
        "instructions": ["Boil", "Cook"],
        "cooking_time_minutes": 20,
        "servings": 2,
        "cuisine": "Italian",
        "dietary_tags": ["Vegetarian"],
        "nutrition": {
            "calories": 320,
            "protein": 12,
            "carbohydrates": 45,
            "fat": 8,
        },
        "image_url": None,
        "created_at": now,
        "updated_at": now,
    }


# ------------------------------------------------------------------
# Service Tests
# ------------------------------------------------------------------


def test_validate_recipe_partial_valid():
    recipe_service._validate_recipe_data_partial(
        {
            "title": "Updated Recipe",
            "servings": 4,
        }
    )


def test_validate_recipe_partial_invalid_title():
    with pytest.raises(HTTPException):
        recipe_service._validate_recipe_data_partial(
            {
                "title": "   ",
            }
        )


# ------------------------------------------------------------------
# Schema Tests
# ------------------------------------------------------------------


def test_recipe_create_valid():
    recipe = RecipeCreate(
        title="Veg Pasta",
        description="Healthy",
        ingredients=["Pasta"],
        instructions=["Cook"],
        cooking_time_minutes=20,
        servings=2,
        cuisine="Italian",
        dietary_tags=["Vegetarian"],
        nutrition=NutritionSchema(
            calories=300,
            protein=10,
            carbohydrates=40,
            fat=8,
        ),
    )

    assert recipe.title == "Veg Pasta"


def test_recipe_create_invalid_title():
    with pytest.raises(ValidationError):
        RecipeCreate(
            title="",
            description="Healthy",
            ingredients=["Pasta"],
            instructions=["Cook"],
            cooking_time_minutes=20,
            servings=2,
            cuisine="Italian",
            dietary_tags=["Vegetarian"],
            nutrition=NutritionSchema(
                calories=300,
                protein=10,
                carbohydrates=40,
                fat=8,
            ),
        )


def test_recipe_update_valid():
    recipe = RecipeUpdate(
        title="Updated Recipe",
        servings=4,
    )

    assert recipe.title == "Updated Recipe"
    assert recipe.servings == 4


# ------------------------------------------------------------------
# API Tests
# ------------------------------------------------------------------


@pytest.mark.asyncio
async def test_create_recipe_success(monkeypatch):

    async def mock_create(recipe):
        return sample_recipe()

    monkeypatch.setattr(
        recipe_api,
        "create_recipe",
        mock_create,
    )

    async with AsyncClient(
        transport=transport,
        base_url="http://test",
    ) as client:

        response = await client.post(
            "/recipes/",
            json={
                "title": "Veg Pasta",
                "description": "Healthy",
                "ingredients": ["Pasta"],
                "instructions": ["Cook"],
                "cooking_time_minutes": 20,
                "servings": 2,
                "cuisine": "Italian",
                "dietary_tags": ["Vegetarian"],
                "nutrition": {
                    "calories": 300,
                    "protein": 10,
                    "carbohydrates": 40,
                    "fat": 8,
                },
            },
        )

    assert response.status_code == status.HTTP_201_CREATED
    assert response.json()["title"] == "Veg Pasta"


@pytest.mark.asyncio
async def test_list_recipes_success(monkeypatch):

    async def mock_get(*args):
        return [sample_recipe()]

    monkeypatch.setattr(
        recipe_api,
        "get_recipes",
        mock_get,
    )

    async with AsyncClient(
        transport=transport,
        base_url="http://test",
    ) as client:

        response = await client.get("/recipes/")

    assert response.status_code == status.HTTP_200_OK
    assert len(response.json()) == 1


@pytest.mark.asyncio
async def test_get_recipe_success(monkeypatch):

    async def mock_get(recipe_id):
        return sample_recipe()

    monkeypatch.setattr(
        recipe_api,
        "get_recipe",
        mock_get,
    )

    async with AsyncClient(
        transport=transport,
        base_url="http://test",
    ) as client:

        response = await client.get("/recipes/recipe123")

    assert response.status_code == status.HTTP_200_OK
    assert response.json()["id"] == "recipe123"


@pytest.mark.asyncio
async def test_update_recipe_success(monkeypatch):

    async def mock_update(recipe_id, data):
        recipe = sample_recipe()
        recipe["title"] = "Updated Recipe"
        return recipe

    monkeypatch.setattr(
        recipe_api,
        "update_recipe",
        mock_update,
    )

    async with AsyncClient(
        transport=transport,
        base_url="http://test",
    ) as client:

        response = await client.put(
            "/recipes/recipe123",
            json={
                "title": "Updated Recipe",
            },
        )

    assert response.status_code == status.HTTP_200_OK
    assert response.json()["title"] == "Updated Recipe"


@pytest.mark.asyncio
async def test_delete_recipe_success(monkeypatch):

    async def mock_delete(recipe_id):
        return None

    monkeypatch.setattr(
        recipe_api,
        "delete_recipe",
        mock_delete,
    )

    async with AsyncClient(
        transport=transport,
        base_url="http://test",
    ) as client:

        response = await client.delete("/recipes/recipe123")

    assert response.status_code == status.HTTP_200_OK
    assert response.json()["message"] == "Recipe deleted successfully"
