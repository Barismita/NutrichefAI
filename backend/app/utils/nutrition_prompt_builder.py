from app.schemas.nutrition_schema import (
    HealthyAlternativesRequest,
    NutritionAnalysisRequest,
)


def build_nutrition_analysis_prompt(
    request: NutritionAnalysisRequest,
) -> str:
    """
    Build the prompt for nutrition analysis.
    """

    ingredients = "\n".join(f"- {ingredient}" for ingredient in request.ingredients)

    return f"""
You are NutriChef AI, an expert nutritionist and dietician.

Analyze the following recipe.

Recipe Name:
{request.recipe_name}

Ingredients:
{ingredients}

Estimate the nutritional values as accurately as possible.

Return ONLY valid JSON.

Do NOT return markdown.

Do NOT include explanations outside JSON.

The JSON MUST exactly match this schema:

{{
    "nutrition": {{
        "calories": 0,
        "protein": 0,
        "carbohydrates": 0,
        "fat": 0,
        "fibre": 0,
        "sugar": 0,
        "sodium": 0
    }},
    "health_score": 0,
    "dietary_tags": [
        "string"
    ],
    "summary": "string"
}}

Rules:

- health_score must be between 1 and 10.
- All nutrition values must be numbers.
- dietary_tags must always be an array.
- summary should be concise (1–2 sentences).
"""


def build_healthy_alternatives_prompt(
    request: HealthyAlternativesRequest,
) -> str:
    """
    Build the prompt for healthy ingredient alternatives.
    """

    ingredients = "\n".join(f"- {ingredient}" for ingredient in request.ingredients)

    return f"""
You are NutriChef AI, an expert nutritionist.

Suggest healthier alternatives for the following ingredients.

Ingredients:

{ingredients}

Return ONLY valid JSON.

Do NOT return markdown.

Do NOT include explanations outside JSON.

The JSON MUST exactly match this schema:

{{
    "alternatives": [
        {{
            "ingredient": "",
            "alternative": "",
            "reason": ""
        }}
    ],
    "tips": [
        "string"
    ]
}}

Rules:

- Every ingredient should have one healthier alternative whenever possible.
- Keep the reason short.
- tips must always be an array.
- Return only JSON.
"""
