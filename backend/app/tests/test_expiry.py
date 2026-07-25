import json

import pytest
from fastapi import HTTPException
from httpx import ASGITransport, AsyncClient

from app.main import app
from app.schemas.expiry_schema import (
    ExpiryIngredient,
    ExpiryRequest,
)
from app.services.ai_provider import AIProvider
from app.services.expiry_service import (
    analyze_expiry,
)


@pytest.mark.asyncio
async def test_analyze_expiry_success(monkeypatch):
    async def mock_generate(self, prompt):
        return json.dumps(
            {
                "expiring_soon": [
                    {
                        "ingredient": "Milk",
                        "days_remaining": 2,
                        "urgency": "Medium",
                        "recommendation": ("Use it for smoothies."),
                    }
                ],
                "expired": [
                    {
                        "ingredient": "Bread",
                        "recommendation": ("Discard safely."),
                    }
                ],
                "general_tips": ["Store milk below 4°C."],
            }
        )

    monkeypatch.setattr(
        AIProvider,
        "generate",
        mock_generate,
    )

    request = ExpiryRequest(
        ingredients=[
            ExpiryIngredient(
                name="Milk",
                expiry_date="2026-07-28",
            ),
            ExpiryIngredient(
                name="Bread",
                expiry_date="2026-07-25",
            ),
        ]
    )

    response = await analyze_expiry(request)

    assert len(response.expiring_soon) == 1
    assert len(response.expired) == 1
    assert response.expiring_soon[0].ingredient == "Milk"
    assert response.expired[0].ingredient == "Bread"


@pytest.mark.asyncio
async def test_analyze_expiry_provider_failure(monkeypatch):
    async def mock_generate(self, prompt):
        raise Exception("Provider unavailable")

    monkeypatch.setattr(
        AIProvider,
        "generate",
        mock_generate,
    )

    request = ExpiryRequest(
        ingredients=[
            ExpiryIngredient(
                name="Milk",
                expiry_date="2026-07-28",
            )
        ]
    )

    with pytest.raises(HTTPException) as exc:
        await analyze_expiry(request)

    assert exc.value.status_code == 502
    assert "AI provider error" in exc.value.detail


def test_expiry_request_validation():
    request = ExpiryRequest(
        ingredients=[
            ExpiryIngredient(
                name="Milk",
                expiry_date="2026-07-28",
            )
        ]
    )

    assert request.ingredients[0].name == "Milk"


def test_expiry_request_invalid():
    with pytest.raises(ValueError):
        ExpiryRequest(ingredients=[])


@pytest.mark.asyncio
async def test_analyze_expiry_invalid_json(monkeypatch):
    async def mock_generate(self, prompt):
        return "This is not JSON"

    monkeypatch.setattr(
        AIProvider,
        "generate",
        mock_generate,
    )

    request = ExpiryRequest(
        ingredients=[
            ExpiryIngredient(
                name="Milk",
                expiry_date="2026-07-28",
            )
        ]
    )

    with pytest.raises(HTTPException) as exc:
        await analyze_expiry(request)

    assert exc.value.status_code == 502
    assert "Malformed AI response" in exc.value.detail


@pytest.mark.asyncio
async def test_analyze_expiry_missing_required_field(
    monkeypatch,
):
    async def mock_generate(self, prompt):
        return json.dumps(
            {
                "expired": [],
                "general_tips": ["Store food properly."],
            }
        )

    monkeypatch.setattr(
        AIProvider,
        "generate",
        mock_generate,
    )

    request = ExpiryRequest(
        ingredients=[
            ExpiryIngredient(
                name="Milk",
                expiry_date="2026-07-28",
            )
        ]
    )

    with pytest.raises(HTTPException) as exc:
        await analyze_expiry(request)

    assert exc.value.status_code == 502
    assert "Missing field in AI response: expiring_soon" in exc.value.detail


@pytest.mark.asyncio
async def test_expiry_api_success(monkeypatch):
    async def mock_generate(self, prompt):
        return json.dumps(
            {
                "expiring_soon": [
                    {
                        "ingredient": "Milk",
                        "days_remaining": 2,
                        "urgency": "Medium",
                        "recommendation": ("Use it in smoothies."),
                    }
                ],
                "expired": [],
                "general_tips": ["Store dairy below 4°C."],
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
            "/expiry/analyze",
            json={
                "ingredients": [
                    {
                        "name": "Milk",
                        "expiry_date": "2026-07-28",
                    }
                ]
            },
        )

    assert response.status_code == 200

    body = response.json()

    assert body["expiring_soon"][0]["ingredient"] == "Milk"
    assert body["general_tips"] == ["Store dairy below 4°C."]


@pytest.mark.asyncio
async def test_expiry_api_validation():
    transport = ASGITransport(app=app)

    async with AsyncClient(
        transport=transport,
        base_url="http://test",
    ) as client:

        response = await client.post(
            "/expiry/analyze",
            json={"ingredients": []},
        )

    assert response.status_code == 422
