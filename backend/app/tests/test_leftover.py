import json

import pytest
from fastapi import HTTPException
from httpx import ASGITransport, AsyncClient

from app.main import app
from app.schemas.leftover_schema import (
    LeftoverRecipeRequest,
)
from app.services.ai_provider import AIProvider
from app.services.leftover_service import (
    suggest_leftover_recipes,
)


@pytest.mark.asyncio
async def test_suggest_leftover_recipes_success(monkeypatch):
    async def mock_generate(self, prompt):
        return json.dumps(
            {
                "recipes": [
                    {
                        "title": "Vegetable Fried Rice",
                        "description": "A quick fried rice recipe.",
                        "difficulty": "Easy",
                        "estimated_time": 20,
                        "required_ingredients": [
                            "Rice",
                            "Carrot",
                        ],
                        "optional_ingredients": [
                            "Spring Onion",
                        ],
                        "waste_reduction_tip": ("Use day-old rice for better texture."),
                    }
                ],
                "general_tips": ["Store leftovers in airtight containers."],
            }
        )

    monkeypatch.setattr(
        AIProvider,
        "generate",
        mock_generate,
    )

    request = LeftoverRecipeRequest(
        ingredients=[
            "Rice",
            "Carrot",
        ]
    )

    response = await suggest_leftover_recipes(request)

    assert len(response.recipes) == 1
    assert response.recipes[0].title == "Vegetable Fried Rice"
    assert response.general_tips == ["Store leftovers in airtight containers."]


@pytest.mark.asyncio
async def test_suggest_leftover_recipes_provider_failure(monkeypatch):
    async def mock_generate(self, prompt):
        raise Exception("Provider unavailable")

    monkeypatch.setattr(
        AIProvider,
        "generate",
        mock_generate,
    )

    request = LeftoverRecipeRequest(ingredients=["Rice"])

    with pytest.raises(HTTPException) as exc:
        await suggest_leftover_recipes(request)

    assert exc.value.status_code == 502
    assert "AI provider error" in exc.value.detail


def test_leftover_request_validation():
    request = LeftoverRecipeRequest(
        ingredients=[
            "Rice",
            "Tomato",
        ]
    )

    assert request.ingredients == [
        "Rice",
        "Tomato",
    ]


def test_leftover_request_invalid():
    with pytest.raises(ValueError):
        LeftoverRecipeRequest(ingredients=[])


@pytest.mark.asyncio
async def test_suggest_leftover_recipes_invalid_json(monkeypatch):
    async def mock_generate(self, prompt):
        return "This is not JSON"

    monkeypatch.setattr(
        AIProvider,
        "generate",
        mock_generate,
    )

    request = LeftoverRecipeRequest(ingredients=["Rice"])

    with pytest.raises(HTTPException) as exc:
        await suggest_leftover_recipes(request)

    assert exc.value.status_code == 502
    assert "Malformed AI response" in exc.value.detail


@pytest.mark.asyncio
async def test_suggest_leftover_recipes_missing_required_field(
    monkeypatch,
):
    async def mock_generate(self, prompt):
        return json.dumps({"general_tips": ["Store leftovers properly."]})

    monkeypatch.setattr(
        AIProvider,
        "generate",
        mock_generate,
    )

    request = LeftoverRecipeRequest(ingredients=["Rice"])

    with pytest.raises(HTTPException) as exc:
        await suggest_leftover_recipes(request)

    assert exc.value.status_code == 502
    assert "Missing field in AI response: recipes" in exc.value.detail


@pytest.mark.asyncio
async def test_leftover_api_success(monkeypatch):
    async def mock_generate(self, prompt):
        return json.dumps(
            {
                "recipes": [
                    {
                        "title": "Vegetable Fried Rice",
                        "description": "A quick fried rice recipe.",
                        "difficulty": "Easy",
                        "estimated_time": 20,
                        "required_ingredients": [
                            "Rice",
                            "Carrot",
                        ],
                        "optional_ingredients": [
                            "Spring Onion",
                        ],
                        "waste_reduction_tip": ("Use leftover vegetables."),
                    }
                ],
                "general_tips": ["Keep leftovers refrigerated."],
            }
        )

    monkeypatch.setattr(
        AIProvider,
        "generate",
        mock_generate,
    )

    transport = ASGITransport(app=app)

    async with AsyncClient(
        transport=transport,
        base_url="http://test",
    ) as client:

        response = await client.post(
            "/leftovers/suggest",
            json={
                "ingredients": [
                    "Rice",
                    "Carrot",
                ]
            },
        )

    assert response.status_code == 200

    body = response.json()

    assert body["recipes"][0]["title"] == "Vegetable Fried Rice"
    assert body["general_tips"] == ["Keep leftovers refrigerated."]


@pytest.mark.asyncio
async def test_leftover_api_validation():
    transport = ASGITransport(app=app)

    async with AsyncClient(
        transport=transport,
        base_url="http://test",
    ) as client:

        response = await client.post(
            "/leftovers/suggest",
            json={"ingredients": []},
        )

    assert response.status_code == 422
