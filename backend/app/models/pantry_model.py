from beanie import Document
from pydantic import Field


class Pantry(Document):
    user_id: str = Field(..., description="Owner of the pantry")
    ingredients: list[str] = Field(default_factory=list)

    class Settings:
        name = "pantries"
