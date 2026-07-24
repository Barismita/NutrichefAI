from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field


class CreateProfileRequest(BaseModel):
    name: str = Field(..., min_length=1)
    category: str

    dietary_preferences: List[str] = []
    allergies: List[str] = []
    health_goal: Optional[str] = None
    favorite_cuisines: List[str] = []
    spice_level: Optional[str] = None


class UpdateProfileRequest(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None

    dietary_preferences: Optional[List[str]] = None
    allergies: Optional[List[str]] = None
    health_goal: Optional[str] = None
    favorite_cuisines: Optional[List[str]] = None
    spice_level: Optional[str] = None


class ProfileResponse(BaseModel):
    id: str

    name: str
    category: str

    dietary_preferences: List[str]
    allergies: List[str]
    health_goal: Optional[str]
    favorite_cuisines: List[str]
    spice_level: Optional[str]

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
