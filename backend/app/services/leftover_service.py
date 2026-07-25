import json

from fastapi import HTTPException

from app.schemas.leftover_schema import (
    LeftoverRecipeRequest,
    LeftoverRecipeResponse,
)
from app.services.ai_provider import AIProvider
from app.utils.leftover_prompt_builder import (
    build_leftover_prompt,
)


async def suggest_leftover_recipes(
    request: LeftoverRecipeRequest,
) -> LeftoverRecipeResponse:
    """
    Generate leftover recipe suggestions using AI.
    """

    prompt = build_leftover_prompt(request)

    provider = AIProvider()

    try:
        ai_response = await provider.generate(prompt)
    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail=f"AI provider error: {str(e)}",
        )

    try:
        leftover_data = json.loads(ai_response)
    except Exception:
        raise HTTPException(
            status_code=502,
            detail="Malformed AI response (not valid JSON).",
        )

    required_fields = [
        "recipes",
        "general_tips",
    ]

    for field in required_fields:
        if field not in leftover_data:
            raise HTTPException(
                status_code=502,
                detail=f"Missing field in AI response: {field}",
            )

    if not isinstance(leftover_data["recipes"], list):
        raise HTTPException(
            status_code=502,
            detail="recipes must be a list.",
        )

    recipe_required_fields = [
        "title",
        "description",
        "difficulty",
        "estimated_time",
        "required_ingredients",
        "optional_ingredients",
        "waste_reduction_tip",
    ]

    for recipe in leftover_data["recipes"]:

        if not isinstance(recipe, dict):
            raise HTTPException(
                status_code=502,
                detail="Each recipe must be an object.",
            )

        for field in recipe_required_fields:
            if field not in recipe:
                raise HTTPException(
                    status_code=502,
                    detail=f"Missing recipe field: {field}",
                )

        if not isinstance(recipe["required_ingredients"], list):
            raise HTTPException(
                status_code=502,
                detail="required_ingredients must be a list.",
            )

        if not isinstance(recipe["optional_ingredients"], list):
            raise HTTPException(
                status_code=502,
                detail="optional_ingredients must be a list.",
            )

        if not isinstance(recipe["estimated_time"], (int, float)):
            raise HTTPException(
                status_code=502,
                detail="estimated_time must be numeric.",
            )

    if not isinstance(leftover_data["general_tips"], list):
        raise HTTPException(
            status_code=502,
            detail="general_tips must be a list.",
        )

    try:
        return LeftoverRecipeResponse.model_validate(leftover_data)
    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail=f"Invalid leftover response: {str(e)}",
        )
