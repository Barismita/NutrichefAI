from app.schemas.cooking_guide_schema import (
    CookingQuestionRequest,
    StartCookingRequest,
    StepNavigationRequest,
)


def build_step_prompt(request: StartCookingRequest | StepNavigationRequest) -> str:
    """
    Build a prompt for explaining a specific cooking step.
    """

    recipe = request.recipe

    if isinstance(request, StartCookingRequest):
        step_number = 1
    else:
        step_number = request.current_step

    total_steps = len(recipe.instructions)

    return f"""
You are NutriChef AI, an expert chef and cooking instructor.

Guide the user through cooking ONE STEP at a time.

Recipe Title:
{recipe.title}

Ingredients:
{chr(10).join(f"- {ingredient}" for ingredient in recipe.ingredients)}

Recipe Instructions:
{chr(10).join(f"{i + 1}. {instruction}" for i, instruction in enumerate(recipe.instructions))}

Current Step:
{step_number} of {total_steps}

Your task:

- Explain ONLY step {step_number}.
- Do NOT explain future steps.
- Keep the explanation concise and practical.
- Give 1-2 useful cooking tips related only to this step.
- Do not invent new recipe steps.
- Do not change the recipe.

Return ONLY valid JSON.

Expected JSON:

{{
    "current_step": {step_number},
    "instruction": "Detailed explanation of the current step.",
    "tips": [
        "Tip 1",
        "Tip 2"
    ]
}}
"""


def build_question_prompt(request: CookingQuestionRequest) -> str:
    """
    Build a prompt for answering cooking questions during a recipe.
    """

    recipe = request.recipe

    return f"""
You are NutriChef AI, an expert chef.

Recipe Title:
{recipe.title}

Ingredients:
{chr(10).join(f"- {ingredient}" for ingredient in recipe.ingredients)}

Recipe Instructions:
{chr(10).join(f"{i + 1}. {instruction}" for i, instruction in enumerate(recipe.instructions))}

Current Step:
{request.current_step}

User Question:
{request.question}

Instructions:

- Answer ONLY using the recipe above.
- If the user asks about substitutions, recommend suitable alternatives.
- Do not change recipe steps.
- Keep the answer concise.
- If the answer cannot be determined from the recipe, state that clearly.
- Return ONLY valid JSON.

Expected JSON:

{{
    "answer": "Your response here."
}}
"""
