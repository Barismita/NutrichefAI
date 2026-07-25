from fastapi import APIRouter, HTTPException, status

from app.schemas.assistant_schema import AssistantChatRequest, AssistantChatResponse
from app.services.assistant_service import chat_with_assistant

router = APIRouter(prefix="/assistant", tags=["Assistant"])


@router.post(
    "/chat",
    response_model=AssistantChatResponse,
    status_code=status.HTTP_200_OK,
    summary="Chat with the AI Cooking Assistant",
    description="Send a message to the AI Cooking Assistant and receive cooking guidance, recipe suggestions, and tips.",
    responses={
        200: {"description": "AI response returned successfully."},
        422: {"description": "Validation error."},
        502: {"description": "AI provider or response error."},
    },
)
async def assistant_chat(
    request: AssistantChatRequest,
) -> AssistantChatResponse:
    """
    Chat with the AI Cooking Assistant.

    Args:
        request: AssistantChatRequest containing the user's message and optional profile_id.

    Returns:
        AssistantChatResponse with the AI's reply, suggested recipes, and tips.

    Raises:
        HTTPException: On validation or AI provider errors.
    """
    return await chat_with_assistant(request)
