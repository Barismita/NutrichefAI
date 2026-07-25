import json

import pytest
from fastapi import HTTPException, status
from httpx import ASGITransport, AsyncClient
from pydantic import ValidationError

from app.main import app
from app.schemas.nutrition_schema import (
    HealthyAlternative,
    HealthyAlternativesRequest,
    HealthyAlternativesResponse,
    NutritionAnalysisRequest,
    NutritionAnalysisResponse,
)
from app.services import nutrition_service

transport = ASGITransport(app=app)

# --------------------------------------------------------------------
# Fixtures
# --------------------------------------------------------------------


@pytest.fixture
def nutrition_request():
    return NutritionAnalysisRequest(
        recipe_name="Grilled Chicken Salad",
        ingredients=[
            "Chicken Breast",
            "Lettuce",
            "Tomato",
            "Olive Oil",
        ],
    )


@pytest.fixture
def nutrition_response():
    return {
        "nutrition": {
            "calories": 430,
            "protein": 38,
            "carbohydrates": 15,
            "fat": 18,
            "fibre": 6,
            "sugar": 4,
            "sodium": 420,
        },
        "health_score": 9,
        "dietary_tags": [
            "High Protein",
            "Gluten Free",
        ],
        "summary": "Healthy balanced meal.",
    }


# --------------------------------------------------------------------
# Service Tests
# --------------------------------------------------------------------


@pytest.mark.asyncio
async def test_analyze_nutrition_success(
    monkeypatch,
    nutrition_request,
    nutrition_response,
):
    async def mock_generate(self, prompt):
        return json.dumps(nutrition_response)

    monkeypatch.setattr(
        nutrition_service,
        "AIProvider",
        lambda: type(
            "MockProvider",
            (),
            {"generate": mock_generate},
        )(),
    )

    response = await nutrition_service.analyze_nutrition(nutrition_request)

    assert isinstance(response, NutritionAnalysisResponse)
    assert response.health_score == 9
    assert response.nutrition.calories == 430


@pytest.mark.asyncio
async def test_provider_failure(
    monkeypatch,
    nutrition_request,
):
    async def mock_generate(self, prompt):
        raise Exception("Provider unavailable")

    monkeypatch.setattr(
        nutrition_service,
        "AIProvider",
        lambda: type(
            "MockProvider",
            (),
            {"generate": mock_generate},
        )(),
    )

    with pytest.raises(HTTPException) as exc:
        await nutrition_service.analyze_nutrition(nutrition_request)

    assert exc.value.status_code == status.HTTP_502_BAD_GATEWAY
    assert "AI provider error" in exc.value.detail


# --------------------------------------------------------------------
# Schema Tests
# --------------------------------------------------------------------


def test_valid_request():
    request = NutritionAnalysisRequest(
        recipe_name="Oats",
        ingredients=["Milk", "Oats"],
    )

    assert request.recipe_name == "Oats"


def test_invalid_recipe_name():
    with pytest.raises(ValidationError):
        NutritionAnalysisRequest(
            recipe_name="",
            ingredients=["Milk"],
        )


# --------------------------------------------------------------------
# Service Tests
# --------------------------------------------------------------------


@pytest.mark.asyncio
async def test_invalid_json(
    monkeypatch,
    nutrition_request,
):
    async def mock_generate(self, prompt):
        return "invalid json"

    monkeypatch.setattr(
        nutrition_service,
        "AIProvider",
        lambda: type(
            "MockProvider",
            (),
            {"generate": mock_generate},
        )(),
    )

    with pytest.raises(HTTPException) as exc:
        await nutrition_service.analyze_nutrition(nutrition_request)

    assert exc.value.status_code == status.HTTP_502_BAD_GATEWAY
    assert "Malformed AI response" in exc.value.detail


@pytest.mark.asyncio
async def test_healthy_alternatives_success(
    monkeypatch,
):
    response_data = {
        "alternatives": [
            {
                "ingredient": "Butter",
                "alternative": "Olive Oil",
                "reason": "Lower saturated fat",
            }
        ],
        "tips": [
            "Use healthy fats whenever possible.",
        ],
    }

    async def mock_generate(self, prompt):
        return json.dumps(response_data)

    monkeypatch.setattr(
        nutrition_service,
        "AIProvider",
        lambda: type(
            "MockProvider",
            (),
            {"generate": mock_generate},
        )(),
    )

    request = HealthyAlternativesRequest(
        ingredients=["Butter"],
    )

    response = await nutrition_service.suggest_healthy_alternatives(request)

    assert response.alternatives[0].alternative == "Olive Oil"
    assert len(response.tips) == 1


# --------------------------------------------------------------------
# API Tests
# --------------------------------------------------------------------


@pytest.mark.asyncio
async def test_analyze_nutrition_api(
    monkeypatch,
    nutrition_response,
):
    async def mock_service(request):
        return NutritionAnalysisResponse.model_validate(nutrition_response)

    monkeypatch.setattr(
        "app.api.nutrition_api.analyze_nutrition",
        mock_service,
    )

    async with AsyncClient(
        transport=transport,
        base_url="http://test",
    ) as client:

        response = await client.post(
            "/nutrition/analyze",
            json={
                "recipe_name": "Grilled Chicken Salad",
                "ingredients": [
                    "Chicken Breast",
                    "Tomato",
                ],
            },
        )

    assert response.status_code == 200
    assert response.json()["health_score"] == 9


@pytest.mark.asyncio
async def test_healthy_alternatives_api(
    monkeypatch,
):
    from app.schemas.nutrition_schema import (
        HealthyAlternativesResponse,
    )

    async def mock_service(request):
        return HealthyAlternativesResponse(
            alternatives=[
                HealthyAlternative(
                    ingredient="Butter",
                    alternative="Olive Oil",
                    reason="Lower saturated fat",
                )
            ],
            tips=["Cook with less oil."],
        )

    monkeypatch.setattr(
        "app.api.nutrition_api.suggest_healthy_alternatives",
        mock_service,
    )

    async with AsyncClient(
        transport=transport,
        base_url="http://test",
    ) as client:

        response = await client.post(
            "/nutrition/healthy-alternatives",
            json={
                "ingredients": [
                    "Butter",
                ]
            },
        )

    assert response.status_code == 200
    assert response.json()["alternatives"][0]["alternative"] == "Olive Oil"
