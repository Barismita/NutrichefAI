import json

from fastapi import HTTPException

from app.schemas.nutrition_schema import (
    HealthyAlternativesRequest,
    HealthyAlternativesResponse,
    NutritionAnalysisRequest,
    NutritionAnalysisResponse,
)
from app.services.ai_provider import AIProvider
from app.utils.nutrition_prompt_builder import (
    build_healthy_alternatives_prompt,
    build_nutrition_analysis_prompt,
)


async def analyze_nutrition(
    request: NutritionAnalysisRequest,
) -> NutritionAnalysisResponse:
    """
    Analyze the nutritional information of a recipe.
    """

    prompt = build_nutrition_analysis_prompt(request)

    provider = AIProvider()

    try:
        ai_response = await provider.generate(prompt)
    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail=f"AI provider error: {str(e)}",
        )

    try:
        nutrition_data = json.loads(ai_response)
    except Exception:
        raise HTTPException(
            status_code=502,
            detail="Malformed AI response (not valid JSON).",
        )

    required_fields = [
        "nutrition",
        "health_score",
        "dietary_tags",
        "summary",
    ]

    for field in required_fields:
        if field not in nutrition_data:
            raise HTTPException(
                status_code=502,
                detail=f"Missing field in AI response: {field}",
            )

    nutrition_required_fields = [
        "calories",
        "protein",
        "carbohydrates",
        "fat",
        "fibre",
        "sugar",
        "sodium",
    ]

    nutrition = nutrition_data.get("nutrition")

    if not isinstance(nutrition, dict):
        raise HTTPException(
            status_code=502,
            detail="Nutrition must be a JSON object.",
        )

    for field in nutrition_required_fields:
        if field not in nutrition:
            raise HTTPException(
                status_code=502,
                detail=f"Missing nutrition field: {field}",
            )

    try:
        return NutritionAnalysisResponse.model_validate(nutrition_data)
    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail=f"Invalid nutrition response: {str(e)}",
        )


async def suggest_healthy_alternatives(
    request: HealthyAlternativesRequest,
) -> HealthyAlternativesResponse:
    """
    Suggest healthier alternatives for ingredients.
    """

    prompt = build_healthy_alternatives_prompt(request)

    provider = AIProvider()

    try:
        ai_response = await provider.generate(prompt)
    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail=f"AI provider error: {str(e)}",
        )

    try:
        alternatives_data = json.loads(ai_response)
    except Exception:
        raise HTTPException(
            status_code=502,
            detail="Malformed AI response (not valid JSON).",
        )

    required_fields = [
        "alternatives",
        "tips",
    ]

    for field in required_fields:
        if field not in alternatives_data:
            raise HTTPException(
                status_code=502,
                detail=f"Missing field in AI response: {field}",
            )

    if not isinstance(alternatives_data["alternatives"], list):
        raise HTTPException(
            status_code=502,
            detail="alternatives must be a list.",
        )

    for alternative in alternatives_data["alternatives"]:

        if not isinstance(alternative, dict):
            raise HTTPException(
                status_code=502,
                detail="Each alternative must be an object.",
            )

        for field in [
            "ingredient",
            "alternative",
            "reason",
        ]:
            if field not in alternative:
                raise HTTPException(
                    status_code=502,
                    detail=f"Missing alternative field: {field}",
                )

    try:
        return HealthyAlternativesResponse.model_validate(alternatives_data)
    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail=f"Invalid alternatives response: {str(e)}",
        )
