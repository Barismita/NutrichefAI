import json
import traceback

from fastapi import HTTPException

from app.schemas.recipe_generation_schema import (
    RecipeGenerationRequest,
    RecipeGenerationResponse,
)
from app.services.ai_service import AIService
from app.utils.recipe_prompt_builder import build_recipe_generation_prompt


async def generate_recipe(request: RecipeGenerationRequest) -> RecipeGenerationResponse:
    if not request.ingredients or not all(i.strip() for i in request.ingredients):
        raise HTTPException(status_code=400, detail="Ingredients list cannot be empty.")

    prompt = build_recipe_generation_prompt(
        ingredients=request.ingredients,
        diet=request.diet,
        max_cooking_time=request.max_cooking_time,
        servings=request.servings,
        use_pantry=request.use_pantry,
    )

    ai_service = AIService()
    try:
        ai_response = await ai_service.generate(prompt)
    except Exception as e:
        traceback.print_exc()
        raise
    try:
        clean_response = ai_response.replace("```json", "").replace("```", "").strip()

        recipe_data = json.loads(clean_response)
    except Exception as e:
        traceback.print_exc()

        raise HTTPException(status_code=502, detail=f"{type(e).__name__}: {e}")

    required_fields = [
        "title",
        "ingredients",
        "instructions",
        "cooking_time_minutes",
        "servings",
        "difficulty",
        "nutrition",
    ]
    for field in required_fields:
        if field not in recipe_data or not recipe_data[field]:
            raise HTTPException(
                status_code=502,
                detail=f"Missing or empty field in AI response: {field}",
            )

    # Validate nutrition
    nutrition = recipe_data["nutrition"]
    for n_field in ["calories", "protein", "carbohydrates", "fat"]:
        if n_field not in nutrition:
            raise HTTPException(
                status_code=502, detail=f"Missing nutrition field: {n_field}"
            )

    # Validate positive numbers
    if recipe_data["cooking_time_minutes"] <= 0 or recipe_data["servings"] <= 0:
        raise HTTPException(
            status_code=502, detail="Cooking time and servings must be positive."
        )

    # Final schema validation
    try:
        return RecipeGenerationResponse.model_validate(recipe_data)
    except Exception as e:
        raise HTTPException(
            status_code=502, detail=f"Invalid recipe structure: {str(e)}"
        )
