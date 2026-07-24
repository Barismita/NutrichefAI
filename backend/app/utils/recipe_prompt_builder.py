from typing import List, Optional

def build_recipe_generation_prompt(
    ingredients: List[str],
    cuisine: Optional[str] = None,
    diet: Optional[str] = None,
    max_cooking_time: Optional[int] = None,
    servings: Optional[int] = None,
    additional_instructions: Optional[str] = None,
) -> str:
    parts = []
    parts.append(
        "You are an expert chef and nutritionist."
    )
    parts.append(
        "Generate ONE realistic recipe using ONLY the ingredients provided whenever possible."
    )
    parts.append(
        "Respond ONLY with valid JSON."
    )
    parts.append(
        """
The JSON must contain exactly these fields:

{
  "title": "",
  "description": "",
  "ingredients": [],
  "instructions": [],
  "cooking_time_minutes": 0,
  "servings": 0,
  "difficulty": "",
  "cuisine": "",
  "dietary_tags": [],
  "nutrition": {
      "calories": 0,
      "protein": 0,
      "carbohydrates": 0,
      "fat": 0
  },
  "image_prompt": ""
}
"""
    )
    parts.append(f"Available ingredients: {', '.join(ingredients)}")
    if cuisine:
        parts.append(f"Cuisine: {cuisine}")
    if diet:
        parts.append(f"Diet: {diet}")
    if max_cooking_time:
        parts.append(f"Maximum cooking time: {max_cooking_time} minutes")
    if servings:
        parts.append(f"Servings: {servings}")
    if additional_instructions:
        parts.append(f"Additional instructions: {additional_instructions}")
    parts.append(
        "Do not include markdown."
    )
    parts.append(
        "Do not wrap the response inside ```."
    )
    parts.append(
        "Return only the JSON object."
    )
    return "\n".join(parts)