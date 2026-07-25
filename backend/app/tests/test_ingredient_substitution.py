import pytest
from fastapi import status
from httpx import ASGITransport, AsyncClient
from pydantic import ValidationError

from app.config.constants import INGREDIENT_SUBSTITUTIONS
from app.main import app
from app.schemas.ingredient_substitution_schema import (
    IngredientSubstitutionRequest,
    IngredientSubstitutionResponse,
)
from app.services.ai_service import AIService

transport = ASGITransport(app=app)


# --------------------------------------------------------------------
# Service Tests
# --------------------------------------------------------------------


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "ingredient",
    [
        "cream",
        "CREAM",
        "CrEaM",
        "  cream  ",
        "egg",
        "MILK",
        "  Butter  ",
    ],
)
async def test_get_substitutes_valid_inputs(ingredient):
    expected = INGREDIENT_SUBSTITUTIONS.get(ingredient.strip().lower())

    result = await AIService.get_substitutes(ingredient)

    assert result == expected


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "ingredient",
    [
        "pizza",
        "abcdef",
        "unknown_ingredient",
    ],
)
async def test_get_substitutes_unknown_ingredient(ingredient):
    result = await AIService.get_substitutes(ingredient)

    assert result is None


@pytest.mark.asyncio
async def test_get_substitutes_returns_expected_list():
    result = await AIService.get_substitutes("cream")

    assert result == [
        "Milk + Butter",
        "Greek Yogurt",
        "Coconut Milk",
    ]


@pytest.mark.asyncio
async def test_get_substitutes_case_insensitive():
    lower = await AIService.get_substitutes("cream")
    upper = await AIService.get_substitutes("CREAM")
    mixed = await AIService.get_substitutes("CrEaM")

    assert lower == upper == mixed


@pytest.mark.asyncio
async def test_get_substitutes_trims_whitespace():
    result = await AIService.get_substitutes("   cream   ")

    assert result == INGREDIENT_SUBSTITUTIONS["cream"]


# --------------------------------------------------------------------
# Schema Tests
# --------------------------------------------------------------------


def test_request_schema_valid():
    request = IngredientSubstitutionRequest(ingredient="cream")

    assert request.ingredient == "cream"


@pytest.mark.parametrize(
    "invalid",
    [
        "",
        "   ",
        None,
    ],
)
def test_request_schema_invalid(invalid):
    with pytest.raises(ValidationError):
        IngredientSubstitutionRequest(ingredient=invalid)


def test_response_schema_valid():
    response = IngredientSubstitutionResponse(
        ingredient="cream",
        substitutes=[
            "Milk + Butter",
            "Greek Yogurt",
        ],
    )

    assert response.ingredient == "cream"
    assert response.substitutes == [
        "Milk + Butter",
        "Greek Yogurt",
    ]


def test_response_schema_empty_list():
    response = IngredientSubstitutionResponse(
        ingredient="egg",
        substitutes=[],
    )

    assert response.substitutes == []


# --------------------------------------------------------------------
# API Tests
# --------------------------------------------------------------------


@pytest.mark.asyncio
async def test_substitute_ingredient_success(monkeypatch):
    async def mock_get_substitutes(_):
        return [
            "Milk + Butter",
            "Greek Yogurt",
            "Coconut Milk",
        ]

    monkeypatch.setattr(
        AIService,
        "get_substitutes",
        mock_get_substitutes,
    )

    async with AsyncClient(
        transport=transport,
        base_url="http://test",
    ) as client:
        response = await client.post(
            "/recipes/substitute",
            json={
                "ingredient": "cream",
            },
        )

    assert response.status_code == status.HTTP_200_OK

    body = response.json()

    assert body["ingredient"] == "cream"
    assert body["substitutes"] == [
        "Milk + Butter",
        "Greek Yogurt",
        "Coconut Milk",
    ]


@pytest.mark.asyncio
async def test_substitute_ingredient_not_found(monkeypatch):
    async def mock_get_substitutes(_):
        return None

    monkeypatch.setattr(
        AIService,
        "get_substitutes",
        mock_get_substitutes,
    )

    async with AsyncClient(
        transport=transport,
        base_url="http://test",
    ) as client:
        response = await client.post(
            "/recipes/substitute",
            json={
                "ingredient": "unknown",
            },
        )

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert "No substitution found" in response.json()["detail"]


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "payload",
    [
        {},
        {"ingredient": ""},
        {"ingredient": "   "},
        {"ingredient": None},
    ],
)
async def test_substitute_invalid_payload(payload):
    async with AsyncClient(
        transport=transport,
        base_url="http://test",
    ) as client:
        response = await client.post(
            "/recipes/substitute",
            json=payload,
        )

    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


@pytest.mark.asyncio
async def test_substitute_returns_empty_list(monkeypatch):
    async def mock_get_substitutes(_):
        return []

    monkeypatch.setattr(
        AIService,
        "get_substitutes",
        mock_get_substitutes,
    )

    async with AsyncClient(
        transport=transport,
        base_url="http://test",
    ) as client:
        response = await client.post(
            "/recipes/substitute",
            json={
                "ingredient": "egg",
            },
        )

    assert response.status_code == status.HTTP_404_NOT_FOUND
