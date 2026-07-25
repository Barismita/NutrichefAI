from fastapi import APIRouter, status

from app.schemas.expiry_schema import (
    ExpiryRequest,
    ExpiryResponse,
)
from app.services.expiry_service import (
    analyze_expiry,
)

router = APIRouter(
    prefix="/expiry",
    tags=["Pantry Expiry"],
)


@router.post(
    "/analyze",
    response_model=ExpiryResponse,
    status_code=status.HTTP_200_OK,
    summary="Analyze Pantry Expiry",
    description=(
        "Analyze pantry ingredients and provide expiry " "recommendations using AI."
    ),
    responses={
        200: {"description": "Expiry analysis completed successfully."},
        422: {"description": "Validation error."},
        502: {"description": "AI provider or response error."},
    },
)
async def analyze_pantry_expiry(
    request: ExpiryRequest,
) -> ExpiryResponse:
    """
    Analyze pantry ingredients for expiry status.

    Args:
        request: Pantry ingredients with expiry dates.

    Returns:
        ExpiryResponse containing expiring ingredients,
        expired ingredients, and storage recommendations.
    """
    return await analyze_expiry(request)
