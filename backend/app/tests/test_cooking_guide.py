import pytest
from fastapi import HTTPException, status
from httpx import ASGITransport, AsyncClient
from pydantic import ValidationError

from app.main import app
from app.schemas.cooking_guide_schema import (
    CookingFinishResponse,
    CookingGuideResponse,
    CookingQuestionRequest,
    CookingQuestionResponse,
    StartCookingRequest,
    StepNavigationRequest,
)
from app.schemas.recipe_generation_schema import (
    NutritionSchema,
    RecipeGenerationResponse,
)
from app.services import cooking_guide_service

transport = ASGITransport(app=app)


# --------------------------------------------------------------------
# Fixtures
# --------------------------------------------------------------------


@pytest.fixture
def sample_recipe():
    return RecipeGenerationResponse(
        title="Pasta",
        ingredients=[
            "Pasta",
            "Salt",
        ],
        instructions=[
            "Heat oil",
            "Cook pasta",
            "Serve",
        ],
        cooking_time_minutes=20,
        servings=2,
        difficulty="Easy",
        nutrition=NutritionSchema(
            calories=450,
            protein=15,
            carbohydrates=60,
            fat=12,
        ),
    )


@pytest.fixture
def sample_recipe_dict():
    return {
        "title": "Pasta",
        "ingredients": [
            "Pasta",
            "Salt",
        ],
        "instructions": [
            "Heat oil",
            "Cook pasta",
            "Serve",
        ],
        "cooking_time_minutes": 20,
        "servings": 2,
        "difficulty": "Easy",
        "nutrition": {
            "calories": 450,
            "protein": 15,
            "carbohydrates": 60,
            "fat": 12,
        },
    }


# --------------------------------------------------------------------
# Service Tests
# --------------------------------------------------------------------


@pytest.mark.asyncio
async def test_start_cooking_success(monkeypatch, sample_recipe):
    async def mock_generate(_):
        return CookingGuideResponse(
            current_step=1,
            instruction="Heat oil in a pan.",
            tips=["Keep flame medium."],
        )

    monkeypatch.setattr(
        cooking_guide_service,
        "_generate_step_response",
        mock_generate,
    )

    request = StartCookingRequest(recipe=sample_recipe)

    response = await cooking_guide_service.start_cooking(request)

    assert response.current_step == 1
    assert response.instruction == "Heat oil in a pan."
    assert response.tips == ["Keep flame medium."]


@pytest.mark.asyncio
async def test_start_cooking_no_steps():
    recipe = RecipeGenerationResponse(
        title="Tea",
        ingredients=["Water"],
        instructions=[],
        cooking_time_minutes=5,
        servings=1,
        difficulty="Easy",
        nutrition=NutritionSchema(
            calories=0,
            protein=0,
            carbohydrates=0,
            fat=0,
        ),
    )

    request = StartCookingRequest(recipe=recipe)

    with pytest.raises(HTTPException) as exc:
        await cooking_guide_service.start_cooking(request)

    assert exc.value.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.asyncio
async def test_next_step_success(monkeypatch, sample_recipe):
    async def mock_generate(_):
        return CookingGuideResponse(
            current_step=2,
            instruction="Cook pasta.",
            tips=["Stir continuously."],
        )

    monkeypatch.setattr(
        cooking_guide_service,
        "_generate_step_response",
        mock_generate,
    )

    request = StepNavigationRequest(
        recipe=sample_recipe,
        current_step=1,
    )

    response = await cooking_guide_service.next_step(request)

    assert response.current_step == 2
    assert response.instruction == "Cook pasta."


@pytest.mark.asyncio
async def test_next_step_last_step(sample_recipe):
    request = StepNavigationRequest(
        recipe=sample_recipe,
        current_step=3,
    )

    with pytest.raises(HTTPException) as exc:
        await cooking_guide_service.next_step(request)

    assert exc.value.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.asyncio
async def test_previous_step_first_step(sample_recipe):
    request = StepNavigationRequest(
        recipe=sample_recipe,
        current_step=1,
    )

    with pytest.raises(HTTPException) as exc:
        await cooking_guide_service.previous_step(request)

    assert exc.value.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.asyncio
async def test_repeat_step(monkeypatch, sample_recipe):
    async def mock_generate(_):
        return CookingGuideResponse(
            current_step=2,
            instruction="Cook pasta.",
            tips=["Use medium flame."],
        )

    monkeypatch.setattr(
        cooking_guide_service,
        "_generate_step_response",
        mock_generate,
    )

    request = StepNavigationRequest(
        recipe=sample_recipe,
        current_step=2,
    )

    response = await cooking_guide_service.repeat_step(request)

    assert response.current_step == 2


@pytest.mark.asyncio
async def test_finish_cooking():
    response = await cooking_guide_service.finish_cooking()

    assert isinstance(response, CookingFinishResponse)
    assert "Enjoy your meal" in response.message


# --------------------------------------------------------------------
# Schema Tests
# --------------------------------------------------------------------


def test_question_schema_valid(sample_recipe):
    request = CookingQuestionRequest(
        recipe=sample_recipe,
        current_step=1,
        question="Can I use butter?",
    )

    assert request.question == "Can I use butter?"


@pytest.mark.parametrize(
    "question",
    [
        "",
        "   ",
        None,
    ],
)
def test_question_schema_invalid(sample_recipe, question):
    with pytest.raises(ValidationError):
        CookingQuestionRequest(
            recipe=sample_recipe,
            current_step=1,
            question=question,
        )
