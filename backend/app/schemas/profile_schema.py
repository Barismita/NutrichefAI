from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field


class CreateProfileRequest(BaseModel):
    name: str = Field(..., min_length=1)
    category: str
    allergies: List[str] = []


class UpdateProfileRequest(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    allergies: Optional[List[str]] = None


class ProfileResponse(BaseModel):
    id: str

    name: str
    category: str
    allergies: List[str]

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
