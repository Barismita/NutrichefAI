from datetime import datetime
from typing import List

from beanie import Document
from pydantic import ConfigDict, Field


class Profile(Document):
    name: str = Field(..., min_length=1, max_length=100)
    category: str = Field(..., min_length=1, max_length=50)
    allergies: List[str] = Field(default_factory=list)

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "profiles"

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "name": "John",
                "category": "Personal",
                "allergies": ["Peanuts"],
            }
        }
    )
