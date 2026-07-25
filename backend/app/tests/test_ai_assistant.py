import pytest
from fastapi import HTTPException, status
from httpx import ASGITransport
from pydantic import ValidationError

from app.main import app
from app.schemas.assistant_schema import (
    AssistantChatRequest,
    AssistantChatResponse,
)
from app.services import assistant_service

transport = ASGITransport(app=app)


# --------------------------------------------------------------------
# Fixtures
# --------------------------------------------------------------------


@pytest.fixture
def chat_request():
    return AssistantChatRequest(
        message="Suggest a healthy pasta recipe.",
        profile_id="profile123",
    )


@pytest.fixture
def ai_response():
    return {
        "reply": "You can prepare a healthy whole wheat pasta.",
        "recipes": [
            {
                "title": "Whole Wheat Pasta",
                "reason": "High fibre and balanced nutrition.",
            }
        ],
        "tips": [
            "Use olive oil.",
            "Add vegetables.",
        ],
        "follow_up_questions": [
            "Do you prefer vegetarian meals?",
        ],
    }


# --------------------------------------------------------------------
# Service Tests
# --------------------------------------------------------------------


@pytest.mark.asyncio
async def test_chat_success(monkeypatch, chat_request, ai_response):
    async def mock_generate(self, prompt):
        import json

        return json.dumps(ai_response)

    monkeypatch.setattr(
        assistant_service,
        "AIProvider",
        lambda: type(
            "MockProvider",
            (),
            {"generate": mock_generate},
        )(),
    )

    response = await assistant_service.chat_with_assistant(chat_request)

    assert isinstance(response, AssistantChatResponse)
    assert response.reply == ai_response["reply"]
    assert response.recipes[0].title == "Whole Wheat Pasta"


@pytest.mark.asyncio
async def test_provider_failure(monkeypatch, chat_request):
    async def mock_generate(self, prompt):
        raise Exception("Provider unavailable")

    monkeypatch.setattr(
        assistant_service,
        "AIProvider",
        lambda: type(
            "MockProvider",
            (),
            {"generate": mock_generate},
        )(),
    )

    with pytest.raises(HTTPException) as exc:
        await assistant_service.chat_with_assistant(chat_request)

    assert exc.value.status_code == status.HTTP_502_BAD_GATEWAY
    assert "AI provider error" in exc.value.detail


@pytest.mark.asyncio
async def test_invalid_json(monkeypatch, chat_request):
    async def mock_generate(self, prompt):
        return "not json"

    monkeypatch.setattr(
        assistant_service,
        "AIProvider",
        lambda: type(
            "MockProvider",
            (),
            {"generate": mock_generate},
        )(),
    )

    with pytest.raises(HTTPException) as exc:
        await assistant_service.chat_with_assistant(chat_request)

    assert exc.value.status_code == status.HTTP_502_BAD_GATEWAY
    assert "Malformed AI response" in exc.value.detail


@pytest.mark.asyncio
async def test_missing_required_field(monkeypatch, chat_request):
    import json

    async def mock_generate(self, prompt):
        return json.dumps(
            {
                "reply": "Hello",
                "recipes": [],
                "tips": [],
            }
        )

    monkeypatch.setattr(
        assistant_service,
        "AIProvider",
        lambda: type(
            "MockProvider",
            (),
            {"generate": mock_generate},
        )(),
    )

    with pytest.raises(HTTPException) as exc:
        await assistant_service.chat_with_assistant(chat_request)

    assert exc.value.status_code == status.HTTP_502_BAD_GATEWAY
    assert "Missing field" in exc.value.detail


@pytest.mark.asyncio
async def test_recipe_missing_reason(monkeypatch, chat_request):
    import json

    async def mock_generate(self, prompt):
        return json.dumps(
            {
                "reply": "Hello",
                "recipes": [{"title": "Pasta"}],
                "tips": [],
                "follow_up_questions": [],
            }
        )

    monkeypatch.setattr(
        assistant_service,
        "AIProvider",
        lambda: type(
            "MockProvider",
            (),
            {"generate": mock_generate},
        )(),
    )

    with pytest.raises(HTTPException) as exc:
        await assistant_service.chat_with_assistant(chat_request)

    assert exc.value.status_code == status.HTTP_502_BAD_GATEWAY
    assert "title and reason" in exc.value.detail


# --------------------------------------------------------------------
# Schema Tests
# --------------------------------------------------------------------


def test_chat_request_valid():
    request = AssistantChatRequest(
        message="Can I substitute butter with olive oil?",
        profile_id="123",
    )

    assert request.message.startswith("Can I")


@pytest.mark.parametrize(
    "message",
    [
        "",
        "   ",
        None,
    ],
)
def test_chat_request_invalid(message):
    with pytest.raises(ValidationError):
        AssistantChatRequest(
            message=message,
        )
