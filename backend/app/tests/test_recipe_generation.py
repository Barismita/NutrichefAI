import json

import pytest
from fastapi import HTTPException, status
from httpx import ASGITransport, AsyncClient
from pydantic import ValidationError

import app.api.recipe_generation_api as recipe_generation_api
import app.services.recipe_generation_service as recipe_generation_service
from app.main import app
from app.schemas.recipe_generation_schema import RecipeGenerationRequest
from app.utils.recipe_prompt_builder import build_recipe_generation_prompt

transport = ASGITransport(app=app)


def valid_request():
    return RecipeGenerationRequest(
        ingredients=["Chicken", "Rice"],
        cuisine="Indian",
        diet="High Protein",
        max_cooking_time=30,
        servings=2,
        additional_instructions="Less spicy",
    )


def valid_ai_response():
    return {
        "title": "Grilled Chicken Rice",
        "description": "Healthy meal",
        "ingredients": ["Chicken", "Rice"],
        "instructions": ["Cook chicken", "Cook rice"],
        "cooking_time_minutes": 30,
        "servings": 2,
        "difficulty": "easy",
        "cuisine": "Indian",
        "dietary_tags": ["High Protein"],
        "nutrition": {
            "calories": 450,
            "protein": 40,
            "carbohydrates": 35,
            "fat": 12,
        },
        "image_prompt": "Grilled chicken with rice",
    }


# ------------------------------------------------------------------
# Success
# ------------------------------------------------------------------


@pytest.mark.asyncio
async def test_generate_recipe_success(monkeypatch):
    class MockProvider:
        async def generate(self, prompt):
            return json.dumps(valid_ai_response())

    monkeypatch.setattr(
        recipe_generation_service,
        "AIProvider",
        MockProvider,
    )

    monkeypatch.setattr(
        recipe_generation_service,
        "build_recipe_generation_prompt",
        lambda **kwargs: "prompt",
    )

    result = await recipe_generation_service.generate_recipe(valid_request())

    assert result.title == "Grilled Chicken Rice"
    assert result.servings == 2
    assert result.nutrition.calories == 450


# ------------------------------------------------------------------
# Validation
# ------------------------------------------------------------------


@pytest.mark.asyncio
def test_generate_recipe_empty_ingredients():
    with pytest.raises(ValidationError):
        RecipeGenerationRequest(
            ingredients=[],
        )


@pytest.mark.asyncio
async def test_generate_recipe_blank_ingredients():
    request = RecipeGenerationRequest(
        ingredients=[" ", ""],
    )

    with pytest.raises(HTTPException) as exc:
        await recipe_generation_service.generate_recipe(request)

    assert exc.value.status_code == 400


# ------------------------------------------------------------------
# AI Errors
# ------------------------------------------------------------------


@pytest.mark.asyncio
async def test_generate_recipe_ai_provider_error(monkeypatch):
    class MockProvider:
        async def generate(self, prompt):
            raise Exception("AI unavailable")

    monkeypatch.setattr(
        recipe_generation_service,
        "AIProvider",
        MockProvider,
    )

    monkeypatch.setattr(
        recipe_generation_service,
        "build_recipe_generation_prompt",
        lambda **kwargs: "prompt",
    )

    with pytest.raises(HTTPException) as exc:
        await recipe_generation_service.generate_recipe(valid_request())

    assert exc.value.status_code == 502
    assert "AI provider error" in exc.value.detail


@pytest.mark.asyncio
async def test_generate_recipe_invalid_json(monkeypatch):
    class MockProvider:
        async def generate(self, prompt):
            return "not-json"

    monkeypatch.setattr(
        recipe_generation_service,
        "AIProvider",
        MockProvider,
    )

    monkeypatch.setattr(
        recipe_generation_service,
        "build_recipe_generation_prompt",
        lambda **kwargs: "prompt",
    )

    with pytest.raises(HTTPException) as exc:
        await recipe_generation_service.generate_recipe(valid_request())

    assert exc.value.status_code == 502
    assert "Malformed AI response" in exc.value.detail


# ------------------------------------------------------------------
# Required fields
# ------------------------------------------------------------------


@pytest.mark.asyncio
async def test_generate_recipe_missing_required_field(monkeypatch):
    data = valid_ai_response()
    del data["title"]

    class MockProvider:
        async def generate(self, prompt):
            return json.dumps(data)

    monkeypatch.setattr(
        recipe_generation_service,
        "AIProvider",
        MockProvider,
    )

    monkeypatch.setattr(
        recipe_generation_service,
        "build_recipe_generation_prompt",
        lambda **kwargs: "prompt",
    )

    with pytest.raises(HTTPException) as exc:
        await recipe_generation_service.generate_recipe(valid_request())

    assert exc.value.status_code == 502
    assert "title" in exc.value.detail


@pytest.mark.asyncio
async def test_generate_recipe_missing_nutrition_field(monkeypatch):
    data = valid_ai_response()
    del data["nutrition"]["protein"]

    class MockProvider:
        async def generate(self, prompt):
            return json.dumps(data)

    monkeypatch.setattr(
        recipe_generation_service,
        "AIProvider",
        MockProvider,
    )

    monkeypatch.setattr(
        recipe_generation_service,
        "build_recipe_generation_prompt",
        lambda **kwargs: "prompt",
    )

    with pytest.raises(HTTPException) as exc:
        await recipe_generation_service.generate_recipe(valid_request())

    assert exc.value.status_code == 502
    assert "protein" in exc.value.detail


# ------------------------------------------------------------------
# Numeric validation
# ------------------------------------------------------------------


@pytest.mark.asyncio
async def test_generate_recipe_invalid_positive_numbers(monkeypatch):
    data = valid_ai_response()
    data["cooking_time_minutes"] = 0

    class MockProvider:
        async def generate(self, prompt):
            return json.dumps(data)

    monkeypatch.setattr(
        recipe_generation_service,
        "AIProvider",
        MockProvider,
    )

    monkeypatch.setattr(
        recipe_generation_service,
        "build_recipe_generation_prompt",
        lambda **kwargs: "prompt",
    )

    with pytest.raises(HTTPException) as exc:
        await recipe_generation_service.generate_recipe(valid_request())

    assert exc.value.status_code == 502
    assert "cooking_time_minutes" in exc.value.detail


# ------------------------------------------------------------------
# Schema validation
# ------------------------------------------------------------------


@pytest.mark.asyncio
async def test_generate_recipe_invalid_schema(monkeypatch):
    data = valid_ai_response()
    data["ingredients"] = "Chicken"

    class MockProvider:
        async def generate(self, prompt):
            return json.dumps(data)

    monkeypatch.setattr(
        recipe_generation_service,
        "AIProvider",
        MockProvider,
    )

    monkeypatch.setattr(
        recipe_generation_service,
        "build_recipe_generation_prompt",
        lambda **kwargs: "prompt",
    )

    with pytest.raises(HTTPException) as exc:
        await recipe_generation_service.generate_recipe(valid_request())

    assert exc.value.status_code == 502
    assert "Invalid recipe structure" in exc.value.detail


# ------------------------------------------------------------------
# Prompt Builder Tests
# ------------------------------------------------------------------


def test_prompt_contains_required_sections():
    prompt = build_recipe_generation_prompt(
        ingredients=["Chicken", "Rice"],
    )

    assert "You are an expert chef and nutritionist." in prompt
    assert "Respond ONLY with valid JSON." in prompt
    assert "Available ingredients: Chicken, Rice" in prompt
    assert '"title"' in prompt
    assert '"nutrition"' in prompt
    assert "Return only the JSON object." in prompt


def test_prompt_contains_optional_fields():
    prompt = build_recipe_generation_prompt(
        ingredients=["Chicken", "Rice"],
        cuisine="Indian",
        diet="High Protein",
        max_cooking_time=30,
        servings=2,
        additional_instructions="Less spicy",
    )

    assert "Cuisine: Indian" in prompt
    assert "Diet: High Protein" in prompt
    assert "Maximum cooking time: 30 minutes" in prompt
    assert "Servings: 2" in prompt
    assert "Additional instructions: Less spicy" in prompt


def test_prompt_omits_optional_fields():
    prompt = build_recipe_generation_prompt(
        ingredients=["Chicken"],
    )

    assert "Cuisine:" not in prompt
    assert "Diet:" not in prompt
    assert "Maximum cooking time:" not in prompt
    assert "Servings:" not in prompt
    assert "Additional instructions:" not in prompt


def test_prompt_contains_all_ingredients():
    prompt = build_recipe_generation_prompt(
        ingredients=[
            "Chicken",
            "Rice",
            "Tomato",
            "Onion",
        ],
    )

    assert "Available ingredients: Chicken, Rice, Tomato, Onion" in prompt


def test_prompt_contains_json_structure():
    prompt = build_recipe_generation_prompt(
        ingredients=["Chicken"],
    )

    expected_fields = [
        '"title"',
        '"description"',
        '"ingredients"',
        '"instructions"',
        '"cooking_time_minutes"',
        '"servings"',
        '"difficulty"',
        '"cuisine"',
        '"dietary_tags"',
        '"nutrition"',
        '"image_prompt"',
    ]

    for field in expected_fields:
        assert field in prompt


def test_prompt_contains_response_instructions():
    prompt = build_recipe_generation_prompt(
        ingredients=["Chicken"],
    )

    assert "Do not include markdown." in prompt
    assert "Do not wrap the response inside ```." in prompt
    assert "Return only the JSON object." in prompt


def valid_response():
    return {
        "title": "Grilled Chicken Rice",
        "description": "Healthy meal",
        "ingredients": ["Chicken", "Rice"],
        "instructions": ["Cook chicken", "Cook rice"],
        "cooking_time_minutes": 30,
        "servings": 2,
        "difficulty": "easy",
        "cuisine": "Indian",
        "dietary_tags": ["High Protein"],
        "nutrition": {
            "calories": 450,
            "protein": 40,
            "carbohydrates": 35,
            "fat": 12,
        },
        "image_prompt": "Grilled chicken with rice",
    }


def valid_request_payload():
    return {
        "ingredients": ["Chicken", "Rice"],
        "cuisine": "Indian",
        "diet": "High Protein",
        "max_cooking_time": 30,
        "servings": 2,
        "additional_instructions": "Less spicy",
    }


# ------------------------------------------------------------------
# API Tests
# ------------------------------------------------------------------


@pytest.mark.asyncio
async def test_generate_recipe_endpoint_success(monkeypatch):

    async def mock_generate_recipe(request):
        return valid_response()

    monkeypatch.setattr(
        recipe_generation_api,
        "generate_recipe",
        mock_generate_recipe,
    )

    async with AsyncClient(
        transport=transport,
        base_url="http://test",
    ) as client:
        response = await client.post(
            "/recipes/generate",
            json=valid_request_payload(),
        )

    assert response.status_code == status.HTTP_200_OK

    body = response.json()

    assert body["title"] == "Grilled Chicken Rice"
    assert body["servings"] == 2
    assert body["nutrition"]["protein"] == 40


@pytest.mark.asyncio
async def test_generate_recipe_endpoint_failure(monkeypatch):

    async def mock_generate_recipe(request):
        raise HTTPException(
            status_code=502,
            detail="AI provider error",
        )

    monkeypatch.setattr(
        recipe_generation_api,
        "generate_recipe",
        mock_generate_recipe,
    )

    async with AsyncClient(
        transport=transport,
        base_url="http://test",
    ) as client:
        response = await client.post(
            "/recipes/generate",
            json=valid_request_payload(),
        )

    assert response.status_code == status.HTTP_502_BAD_GATEWAY
    assert response.json()["detail"] == "AI provider error"
