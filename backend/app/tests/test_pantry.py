import pytest
from fastapi import status
from httpx import ASGITransport, AsyncClient
from pydantic import ValidationError

import app.api.pantry_api as pantry_api
from app.main import app
from app.schemas.pantry_schema import (
    Ingredient,
    PantryResponse,
)

transport = ASGITransport(app=app)


# --------------------------------------------------------------------
# Helpers
# --------------------------------------------------------------------


def sample_ingredient():
    return Ingredient(
        name="Milk",
        quantity=2,
        unit="L",
        category="Dairy",
        expiry_date="2026-08-01",
        notes="Toned",
    )


def sample_pantry():
    class MockPantry:
        ingredients = [sample_ingredient()]

    return MockPantry()


# --------------------------------------------------------------------
# Schema Tests
# --------------------------------------------------------------------


def test_ingredient_schema_valid():
    ingredient = sample_ingredient()

    assert ingredient.name == "Milk"
    assert ingredient.quantity == 2
    assert ingredient.unit == "L"
    assert ingredient.category == "Dairy"
    assert ingredient.expiry_date == "2026-08-01"
    assert ingredient.notes == "Toned"


def test_ingredient_name_required():
    with pytest.raises(ValidationError):
        Ingredient(
            name="",
            quantity=1,
            unit="kg",
            category="Grains",
        )


def test_pantry_response_valid():
    response = PantryResponse(ingredients=[sample_ingredient()])

    assert len(response.ingredients) == 1
    assert response.ingredients[0].name == "Milk"


def test_pantry_response_empty():
    response = PantryResponse(ingredients=[])

    assert response.ingredients == []


# --------------------------------------------------------------------
# API Tests
# --------------------------------------------------------------------


@pytest.mark.asyncio
async def test_get_pantry_success(monkeypatch):
    async def mock_get():
        return sample_pantry()

    monkeypatch.setattr(
        pantry_api,
        "get_pantry",
        mock_get,
    )

    async with AsyncClient(
        transport=transport,
        base_url="http://test",
    ) as client:

        response = await client.get("/pantry")

    assert response.status_code == status.HTTP_200_OK

    body = response.json()

    assert len(body["ingredients"]) == 1
    assert body["ingredients"][0]["name"] == "Milk"


@pytest.mark.asyncio
async def test_get_pantry_empty(monkeypatch):
    async def mock_get():
        return None

    monkeypatch.setattr(
        pantry_api,
        "get_pantry",
        mock_get,
    )

    async with AsyncClient(
        transport=transport,
        base_url="http://test",
    ) as client:

        response = await client.get("/pantry")

    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {"ingredients": []}


@pytest.mark.asyncio
async def test_add_ingredient_success(monkeypatch):
    async def mock_add(_):
        return sample_pantry()

    monkeypatch.setattr(
        pantry_api,
        "add_ingredient",
        mock_add,
    )

    payload = {
        "name": "Milk",
        "quantity": 2,
        "unit": "L",
        "category": "Dairy",
        "expiry_date": "2026-08-01",
        "notes": "Toned",
    }

    async with AsyncClient(
        transport=transport,
        base_url="http://test",
    ) as client:

        response = await client.post(
            "/pantry",
            json=payload,
        )

    assert response.status_code == status.HTTP_201_CREATED

    body = response.json()

    assert len(body["ingredients"]) == 1
    assert body["ingredients"][0]["name"] == "Milk"


@pytest.mark.asyncio
async def test_delete_ingredient_success(monkeypatch):
    class MockPantry:
        ingredients = []

    async def mock_delete(_):
        return MockPantry()

    monkeypatch.setattr(
        pantry_api,
        "delete_ingredient",
        mock_delete,
    )

    async with AsyncClient(
        transport=transport,
        base_url="http://test",
    ) as client:

        response = await client.delete("/pantry/Milk")

    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {"ingredients": []}


@pytest.mark.asyncio
async def test_add_ingredient_validation():
    async with AsyncClient(
        transport=transport,
        base_url="http://test",
    ) as client:

        response = await client.post(
            "/pantry",
            json={
                "name": "",
                "quantity": 2,
                "unit": "L",
                "category": "Dairy",
            },
        )

    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
