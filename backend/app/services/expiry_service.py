import json

from fastapi import HTTPException

from app.schemas.expiry_schema import (
    ExpiryRequest,
    ExpiryResponse,
)
from app.services.ai_provider import AIProvider
from app.utils.expiry_prompt_builder import (
    build_expiry_prompt,
)


async def analyze_expiry(
    request: ExpiryRequest,
) -> ExpiryResponse:
    """
    Analyze pantry ingredients for expiry using AI.
    """

    prompt = build_expiry_prompt(request)

    provider = AIProvider()

    try:
        ai_response = await provider.generate(prompt)
    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail=f"AI provider error: {str(e)}",
        )

    try:
        expiry_data = json.loads(ai_response)
    except Exception:
        raise HTTPException(
            status_code=502,
            detail="Malformed AI response (not valid JSON).",
        )

    required_fields = [
        "expiring_soon",
        "expired",
        "general_tips",
    ]

    for field in required_fields:
        if field not in expiry_data:
            raise HTTPException(
                status_code=502,
                detail=f"Missing field in AI response: {field}",
            )

    if not isinstance(expiry_data["expiring_soon"], list):
        raise HTTPException(
            status_code=502,
            detail="expiring_soon must be a list.",
        )

    if not isinstance(expiry_data["expired"], list):
        raise HTTPException(
            status_code=502,
            detail="expired must be a list.",
        )

    if not isinstance(expiry_data["general_tips"], list):
        raise HTTPException(
            status_code=502,
            detail="general_tips must be a list.",
        )

    expiring_required_fields = [
        "ingredient",
        "days_remaining",
        "urgency",
        "recommendation",
    ]

    for ingredient in expiry_data["expiring_soon"]:

        if not isinstance(ingredient, dict):
            raise HTTPException(
                status_code=502,
                detail="Each expiring ingredient must be an object.",
            )

        for field in expiring_required_fields:
            if field not in ingredient:
                raise HTTPException(
                    status_code=502,
                    detail=f"Missing expiring ingredient field: {field}",
                )

        if not isinstance(
            ingredient["days_remaining"],
            (int, float),
        ):
            raise HTTPException(
                status_code=502,
                detail="days_remaining must be numeric.",
            )

    expired_required_fields = [
        "ingredient",
        "recommendation",
    ]

    for ingredient in expiry_data["expired"]:

        if not isinstance(ingredient, dict):
            raise HTTPException(
                status_code=502,
                detail="Each expired ingredient must be an object.",
            )

        for field in expired_required_fields:
            if field not in ingredient:
                raise HTTPException(
                    status_code=502,
                    detail=f"Missing expired ingredient field: {field}",
                )

    try:
        return ExpiryResponse.model_validate(expiry_data)
    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail=f"Invalid expiry response: {str(e)}",
        )
