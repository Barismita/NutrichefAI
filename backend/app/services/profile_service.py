from datetime import datetime

from beanie import PydanticObjectId

from app.models.profile_model import Profile
from app.schemas.profile_schema import (
    CreateProfileRequest,
    UpdateProfileRequest,
)


class ProfileService:

    @staticmethod
    async def create_profile(data: CreateProfileRequest) -> Profile:
        profile = Profile(**data.model_dump())
        await profile.insert()
        return profile

    @staticmethod
    async def get_profile(profile_id: str):
        return await Profile.get(PydanticObjectId(profile_id))

    @staticmethod
    async def get_all_profiles():
        return await Profile.find_all().to_list()

    @staticmethod
    async def update_profile(
        profile_id: str,
        data: UpdateProfileRequest,
    ):
        profile = await Profile.get(PydanticObjectId(profile_id))

        if not profile:
            return None

        updates = data.model_dump(exclude_unset=True)

        for key, value in updates.items():
            setattr(profile, key, value)

        profile.updated_at = datetime.utcnow()

        await profile.save()

        return profile

    @staticmethod
    async def delete_profile(profile_id: str):
        profile = await Profile.get(PydanticObjectId(profile_id))

        if not profile:
            return False

        await profile.delete()
        return True
