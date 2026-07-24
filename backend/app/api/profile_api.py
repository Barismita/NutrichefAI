from typing import List

from fastapi import APIRouter, HTTPException, status

from app.schemas.profile_schema import (
    CreateProfileRequest,
    ProfileResponse,
    UpdateProfileRequest,
)
from app.services.profile_service import ProfileService

router = APIRouter(
    prefix="/profiles",
    tags=["Profiles"],
)


@router.post(
    "/",
    response_model=ProfileResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_profile(data: CreateProfileRequest):
    try:
        profile = await ProfileService.create_profile(data)
        return ProfileResponse.model_validate(profile)

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=str(exc),
        )


@router.get(
    "/",
    response_model=List[ProfileResponse],
)
async def get_profiles():
    profiles = await ProfileService.get_all_profiles()
    return [ProfileResponse.model_validate(p) for p in profiles]


@router.get(
    "/{profile_id}",
    response_model=ProfileResponse,
)
async def get_profile(profile_id: str):
    profile = await ProfileService.get_profile(profile_id)

    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Profile not found",
        )

    return ProfileResponse.model_validate(profile)


@router.put(
    "/{profile_id}",
    response_model=ProfileResponse,
)
async def update_profile(
    profile_id: str,
    data: UpdateProfileRequest,
):
    profile = await ProfileService.update_profile(
        profile_id,
        data,
    )

    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Profile not found",
        )

    return ProfileResponse.model_validate(profile)


@router.delete(
    "/{profile_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_profile(profile_id: str):
    deleted = await ProfileService.delete_profile(profile_id)

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Profile not found",
        )
