import json

from fastapi import HTTPException, status

from app.schemas.cooking_guide_schema import (
    CookingFinishResponse,
    CookingGuideResponse,
    CookingQuestionRequest,
    CookingQuestionResponse,
    StartCookingRequest,
    StepNavigationRequest,
)
from app.services.ai_provider import AIProvider
from app.utils.cooking_guide_prompt_builder import (
    build_question_prompt,
    build_step_prompt,
)


async def start_cooking(
    request: StartCookingRequest,
) -> CookingGuideResponse:
    """
    Start the cooking guide from the first step.
    """

    if not request.recipe.instructions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Recipe does not contain any instructions.",
        )

    prompt = build_step_prompt(request)

    return await _generate_step_response(prompt)


async def next_step(
    request: StepNavigationRequest,
) -> CookingGuideResponse:
    """
    Return the next cooking step.
    """

    total_steps = len(request.recipe.instructions)

    if request.current_step >= total_steps:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already reached the final step.",
        )

    next_request = StepNavigationRequest(
        recipe=request.recipe,
        current_step=request.current_step + 1,
    )

    prompt = build_step_prompt(next_request)

    return await _generate_step_response(prompt)


async def previous_step(
    request: StepNavigationRequest,
) -> CookingGuideResponse:
    """
    Return the previous cooking step.
    """

    if request.current_step <= 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already at the first step.",
        )

    previous_request = StepNavigationRequest(
        recipe=request.recipe,
        current_step=request.current_step - 1,
    )

    prompt = build_step_prompt(previous_request)

    return await _generate_step_response(prompt)


async def repeat_step(
    request: StepNavigationRequest,
) -> CookingGuideResponse:
    """
    Repeat the current cooking step.
    """

    prompt = build_step_prompt(request)

    return await _generate_step_response(prompt)


async def answer_question(
    request: CookingQuestionRequest,
) -> CookingQuestionResponse:
    """
    Answer a cooking question related to the current recipe.
    """

    prompt = build_question_prompt(request)

    provider = AIProvider()

    try:
        ai_response = await provider.generate(prompt)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"AI provider error: {str(e)}",
        )

    try:
        response = json.loads(ai_response)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Malformed AI response (not valid JSON).",
        )

    if "answer" not in response or not response["answer"]:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Missing field in AI response: answer",
        )

    try:
        return CookingQuestionResponse.model_validate(response)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Invalid AI response: {str(e)}",
        )


async def finish_cooking() -> CookingFinishResponse:
    """
    Finish the cooking session.
    """

    return CookingFinishResponse(message="Cooking completed. Enjoy your meal!")


async def _generate_step_response(
    prompt: str,
) -> CookingGuideResponse:
    """
    Generate a validated cooking step response using AI.
    """

    provider = AIProvider()

    try:
        ai_response = await provider.generate(prompt)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"AI provider error: {str(e)}",
        )

    try:
        response = json.loads(ai_response)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Malformed AI response (not valid JSON).",
        )

    required_fields = [
        "current_step",
        "instruction",
        "tips",
    ]

    for field in required_fields:
        if field not in response:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Missing field in AI response: {field}",
            )

    try:
        return CookingGuideResponse.model_validate(response)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Invalid AI response: {str(e)}",
        )
