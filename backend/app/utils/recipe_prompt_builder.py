def build_recipe_generation_prompt(
    ingredients,
    diet,
    max_cooking_time,
    servings,
    use_pantry,
) -> str:
    prompt = f"""
You are a professional chef.

Generate ONE recipe.

Ingredients:
{", ".join(ingredients)}

Diet:
{diet or "Any"}

Maximum cooking time:
{max_cooking_time or "No limit"} minutes

Servings:
{servings or 2}
"""

    if use_pantry:
        prompt += """
IMPORTANT:
Use ONLY the ingredients provided by the user.
Do not introduce additional ingredients except water, salt, pepper and common cooking oil.
"""
    else:
        prompt += """
You may introduce additional ingredients if they improve the recipe.
"""

    prompt += """

Return ONLY valid JSON.
Do not include markdown, explanations or code fences.

The JSON MUST exactly match this schema:

{
  "title": "string",
  "description": "string",
  "ingredients": [
    "string"
  ],
  "instructions": [
    "string"
  ],
  "cooking_time_minutes": 30,
  "servings": 2,
  "difficulty": "Easy",
  "cuisine": "string",
  "dietary_tags": [
    "string"
  ],
  "nutrition": {
    "calories": 0,
    "protein": 0,
    "carbohydrates": 0,
    "fat": 0
  },
  "image_prompt": "string"
}
"""

    return prompt
