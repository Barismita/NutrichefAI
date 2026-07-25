import json

from fastapi import HTTPException

from app.schemas.assistant_schema import (
    AssistantChatRequest,
    AssistantChatResponse,
)
from app.services.ai_provider import AIProvider
from app.utils.assistant_prompt_builder import build_assistant_prompt


async def chat_with_assistant(
    request: AssistantChatRequest,
) -> AssistantChatResponse:
    """
    Process a user message using the AI Cooking Assistant.
    """

    prompt = build_assistant_prompt(request)

    provider = AIProvider()

    try:
        ai_response = await provider.generate(prompt)
    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail=f"AI provider error: {str(e)}",
        )

    try:
        assistant_data = json.loads(ai_response)
    except Exception:
        raise HTTPException(
            status_code=502,
            detail="Malformed AI response (not valid JSON).",
        )

    required_fields = [
        "reply",
        "recipes",
        "tips",
        "follow_up_questions",
    ]

    for field in required_fields:
        if field not in assistant_data:
            raise HTTPException(
                status_code=502,
                detail=f"Missing field in AI response: {field}",
            )

    for recipe in assistant_data["recipes"]:
        if "title" not in recipe or "reason" not in recipe:
            raise HTTPException(
                status_code=502,
                detail="Each recipe must contain title and reason.",
            )

    try:
        return AssistantChatResponse.model_validate(assistant_data)
    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail=f"Invalid assistant response: {str(e)}",
        )
