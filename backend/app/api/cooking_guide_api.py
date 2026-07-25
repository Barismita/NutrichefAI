from fastapi import APIRouter

from app.schemas.cooking_guide_schema import (
    CookingFinishResponse,
    CookingGuideResponse,
    CookingQuestionRequest,
    CookingQuestionResponse,
    StartCookingRequest,
    StepNavigationRequest,
)
from app.services.cooking_guide_service import (
    answer_question,
    finish_cooking,
    next_step,
    previous_step,
    repeat_step,
    start_cooking,
)

router = APIRouter(
    prefix="/cooking-guide",
    tags=["Step-by-Step Cooking Assistance"],
)


@router.post(
    "/start",
    response_model=CookingGuideResponse,
    summary="Start Cooking Guide",
)
async def start_cooking_endpoint(
    request: StartCookingRequest,
) -> CookingGuideResponse:
    """
    Start the cooking guide from the first recipe step.
    """
    return await start_cooking(request)


@router.post(
    "/next",
    response_model=CookingGuideResponse,
    summary="Next Cooking Step",
)
async def next_step_endpoint(
    request: StepNavigationRequest,
) -> CookingGuideResponse:
    """
    Move to the next cooking step.
    """
    return await next_step(request)


@router.post(
    "/previous",
    response_model=CookingGuideResponse,
    summary="Previous Cooking Step",
)
async def previous_step_endpoint(
    request: StepNavigationRequest,
) -> CookingGuideResponse:
    """
    Move to the previous cooking step.
    """
    return await previous_step(request)


@router.post(
    "/repeat",
    response_model=CookingGuideResponse,
    summary="Repeat Current Step",
)
async def repeat_step_endpoint(
    request: StepNavigationRequest,
) -> CookingGuideResponse:
    """
    Repeat the current cooking step with additional clarification.
    """
    return await repeat_step(request)


@router.post(
    "/question",
    response_model=CookingQuestionResponse,
    summary="Ask a Cooking Question",
)
async def cooking_question_endpoint(
    request: CookingQuestionRequest,
) -> CookingQuestionResponse:
    """
    Answer a cooking question related to the current recipe and step.
    """
    return await answer_question(request)


@router.post(
    "/finish",
    response_model=CookingFinishResponse,
    summary="Finish Cooking",
)
async def finish_cooking_endpoint() -> CookingFinishResponse:
    """
    Finish the cooking guide.
    """
    return await finish_cooking()
