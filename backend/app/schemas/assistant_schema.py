from typing import List, Optional

from pydantic import BaseModel, Field, field_validator


class AssistantChatRequest(BaseModel):
    """Request schema for AI Cooking Assistant chat."""

    model_config = {"str_strip_whitespace": True}
    message: str = Field(
        ..., min_length=1, description="User's message to the AI assistant"
    )
    profile_id: Optional[str] = Field(None, description="Optional user profile ID")

    @field_validator("message")
    @classmethod
    def message_must_not_be_blank(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Message cannot be empty or whitespace")
        return v


class SuggestedRecipe(BaseModel):
    title: str = Field(..., description="Recipe title")
    reason: str = Field(
        ...,
        description="Reason why this recipe is recommended",
    )


class AssistantChatResponse(BaseModel):
    reply: str = Field(
        ...,
        description="Assistant's reply",
    )
    recipes: List[SuggestedRecipe] = Field(
        default_factory=list,
        description="Recommended recipes",
    )
    tips: List[str] = Field(
        default_factory=list,
        description="Cooking tips",
    )
    follow_up_questions: List[str] = Field(
        default_factory=list,
        description="Questions the assistant asks the user",
    )
