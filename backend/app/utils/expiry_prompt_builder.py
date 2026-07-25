from app.schemas.expiry_schema import ExpiryRequest


def build_expiry_prompt(
    request: ExpiryRequest,
) -> str:
    """
    Build the AI prompt for pantry expiry analysis.
    """

    ingredients = "\n".join(
        f"- {ingredient.name}: {ingredient.expiry_date}"
        for ingredient in request.ingredients
    )

    return f"""
You are NutriChef AI, an expert in food safety, pantry management, and food waste reduction.

Your task is to analyze the user's pantry ingredients based on their expiry dates.

Today's pantry inventory:

{ingredients}

Guidelines:

- Determine which ingredients are already expired.
- Determine which ingredients are expiring soon.
- Estimate the number of days remaining for ingredients that have not yet expired.
- Assign an urgency level.
- Recommend how the user should use ingredients before they expire.
- Recommend safe disposal for expired ingredients.
- Provide general food storage tips to reduce food waste.

Return ONLY valid JSON.

Do NOT return markdown.

Do NOT return explanations.

Do NOT include any text before or after the JSON.

The JSON MUST exactly match this schema:

{{
    "expiring_soon": [
        {{
            "ingredient": "",
            "days_remaining": 0,
            "urgency": "",
            "recommendation": ""
        }}
    ],
    "expired": [
        {{
            "ingredient": "",
            "recommendation": ""
        }}
    ],
    "general_tips": [
        ""
    ]
}}

Rules:

- days_remaining must be a number.
- urgency must be one of:
  - Low
  - Medium
  - High
- expiring_soon must always be an array.
- expired must always be an array.
- general_tips must always be an array.
- Return only valid JSON.
"""
