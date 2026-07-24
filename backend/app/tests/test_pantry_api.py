import pytest
from fastapi import status
from httpx import ASGITransport, AsyncClient
from pydantic import ValidationError

import app.api.pantry_api as pantry_api
import app.services.pantry_service as pantry_service
from app.main import app
from app.schemas.pantry_schema import PantryRequest, PantryResponse

transport = ASGITransport(app=app)


# --------------------------------------------------------------------
# Service Tests
# --------------------------------------------------------------------


def test_normalize_ingredients_removes_duplicates():
    ingredients = ["Milk", " milk ", "EGG", "egg"]

    result = pantry_service.normalize_ingredients(ingredients)

    assert result == ["milk", "egg"]


def test_normalize_ingredients_removes_blank_values():
    ingredients = ["milk", "", "   ", "egg"]

    result = pantry_service.normalize_ingredients(ingredients)

    assert result == ["milk", "egg"]


def test_normalize_ingredients_empty_input():
    assert pantry_service.normalize_ingredients([]) == []


# --------------------------------------------------------------------
# Schema Tests
# --------------------------------------------------------------------


def test_pantry_request_valid():
    request = PantryRequest(ingredients=["Milk", " Egg "])

    assert request.ingredients == ["milk", "egg"]


@pytest.mark.parametrize(
    "ingredients",
    [
        [""],
        ["   "],
        [None],
    ],
)
def test_pantry_request_invalid(ingredients):
    with pytest.raises(ValidationError):
        PantryRequest(ingredients=ingredients)


def test_pantry_response_valid():
    response = PantryResponse(ingredients=["milk", "egg"])

    assert response.ingredients == ["milk", "egg"]


# --------------------------------------------------------------------
# API Tests
# --------------------------------------------------------------------


@pytest.mark.asyncio
async def test_post_pantry_success(monkeypatch):
    class MockPantry:
        ingredients = ["milk", "egg"]

    async def mock_create_or_update(_):
        return MockPantry()

    monkeypatch.setattr(
        pantry_api,
        "create_or_update_pantry",
        mock_create_or_update,
    )

    async with AsyncClient(
        transport=transport,
        base_url="http://test",
    ) as client:
        response = await client.post(
            "/pantry",
            json={"ingredients": ["milk", "egg"]},
        )

    assert response.status_code == status.HTTP_200_OK
    assert response.json()["ingredients"] == ["milk", "egg"]


@pytest.mark.asyncio
async def test_get_pantry_success(monkeypatch):
    class MockPantry:
        ingredients = ["milk", "egg"]

    async def mock_get():
        return MockPantry()

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
    assert response.json()["ingredients"] == ["milk", "egg"]


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
async def test_delete_pantry_success(monkeypatch):
    class MockPantry:
        ingredients = ["egg"]

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
        response = await client.delete("/pantry/milk")

    assert response.status_code == status.HTTP_200_OK
    assert response.json()["ingredients"] == ["egg"]
