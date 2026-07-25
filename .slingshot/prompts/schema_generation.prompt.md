## Objective

Create comprehensive Pydantic v2 schemas for API request validation and response serialization with custom validators, field constraints, and proper configuration.

## Context

**Tech Stack:**
- Pydantic v2 for data validation
- Python 3.11 with type hints
- FastAPI for API framework

**Schema Location:**
- `backend/app/schemas/`

**Schema Types:**
- Create schemas: For POST requests
- Update schemas: For PUT/PATCH requests
- Response schemas: For API responses
- Query schemas: For query parameters

## Instructions

### Step 1: Analyze Data Requirements
- Identify required vs optional fields
- Determine validation rules
- Plan field constraints (min/max, patterns)
- Consider nested schemas

### Step 2: Create Base Schema Structure
```python
from pydantic import BaseModel, Field, field_validator, ConfigDict
from typing import Optional, List
from datetime import datetime
from enum import Enum

class DifficultyLevel(str, Enum):
    """Recipe difficulty levels."""
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"

class RecipeBase(BaseModel):
    """Base recipe schema with common fields."""
    title: str = Field(..., min_length=1, max_length=200, description="Recipe title")
    description: Optional[str] = Field(None, max_length=1000, description="Recipe description")
    ingredients: List[str] = Field(..., min_items=1, description="List of ingredients")
    instructions: str = Field(..., min_length=10, description="Cooking instructions")
    prep_time: int = Field(..., gt=0, le=1440, description="Preparation time in minutes")
    cook_time: int = Field(..., gt=0, le=1440, description="Cooking time in minutes")
    servings: int = Field(..., gt=0, le=100, description="Number of servings")
    difficulty: DifficultyLevel = Field(default=DifficultyLevel.MEDIUM)
    cuisine_type: Optional[str] = Field(None, max_length=50)
    dietary_tags: List[str] = Field(default_factory=list, description="Dietary tags (vegan, gluten-free, etc.)")

class RecipeCreate(RecipeBase):
    """Schema for creating a new recipe."""
    
    @field_validator("title")
    @classmethod
    def validate_title(cls, v: str) -> str:
        """Ensure title is not empty or whitespace."""
        if not v.strip():
            raise ValueError("Title cannot be empty or whitespace")
        return v.strip()
    
    @field_validator("ingredients")
    @classmethod
    def validate_ingredients(cls, v: List[str]) -> List[str]:
        """Ensure ingredients are not empty strings."""
        cleaned = [ingredient.strip() for ingredient in v if ingredient.strip()]
        if not cleaned:
            raise ValueError("At least one valid ingredient is required")
        return cleaned
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "title": "Spaghetti Carbonara",
                "description": "Classic Italian pasta dish",
                "ingredients": ["spaghetti", "eggs", "bacon", "parmesan"],
                "instructions": "Cook pasta, fry bacon, mix with eggs and cheese",
                "prep_time": 10,
                "cook_time": 20,
                "servings": 4,
                "difficulty": "medium",
                "cuisine_type": "Italian",
                "dietary_tags": []
            }
        }
    )

class RecipeUpdate(BaseModel):
    """Schema for updating a recipe (all fields optional)."""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    ingredients: Optional[List[str]] = Field(None, min_items=1)
    instructions: Optional[str] = Field(None, min_length=10)
    prep_time: Optional[int] = Field(None, gt=0, le=1440)
    cook_time: Optional[int] = Field(None, gt=0, le=1440)
    servings: Optional[int] = Field(None, gt=0, le=100)
    difficulty: Optional[DifficultyLevel] = None
    cuisine_type: Optional[str] = Field(None, max_length=50)
    dietary_tags: Optional[List[str]] = None
    
    @field_validator("title")
    @classmethod
    def validate_title(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and not v.strip():
            raise ValueError("Title cannot be empty or whitespace")
        return v.strip() if v else v

class RecipeResponse(RecipeBase):
    """Schema for recipe responses."""
    id: str = Field(..., description="Recipe unique identifier")
    user_id: str = Field(..., description="Owner user ID")
    created_at: datetime = Field(..., description="Creation timestamp")
    updated_at: datetime = Field(..., description="Last update timestamp")
    
    model_config = ConfigDict(
        from_attributes=True,  # Pydantic v2: replaces orm_mode
        json_schema_extra={
            "example": {
                "id": "507f1f77bcf86cd799439011",
                "user_id": "507f1f77bcf86cd799439012",
                "title": "Spaghetti Carbonara",
                "description": "Classic Italian pasta dish",
                "ingredients": ["spaghetti", "eggs", "bacon", "parmesan"],
                "instructions": "Cook pasta, fry bacon, mix with eggs and cheese",
                "prep_time": 10,
                "cook_time": 20,
                "servings": 4,
                "difficulty": "medium",
                "cuisine_type": "Italian",
                "dietary_tags": [],
                "created_at": "2024-01-15T10:30:00Z",
                "updated_at": "2024-01-15T10:30:00Z"
            }
        }
    )
```

### Step 3: Add Field Validators
- Use `@field_validator` for custom validation
- Validate single fields or multiple fields
- Return cleaned/transformed values
- Raise ValueError with clear messages

### Step 4: Configure Schema Settings
- Use `ConfigDict` for Pydantic v2 configuration
- `from_attributes=True`: Enable ORM mode for Beanie models
- `json_schema_extra`: Add examples for documentation
- `validate_assignment=True`: Validate on attribute assignment

### Step 5: Create Nested Schemas
```python
class NutritionalInfo(BaseModel):
    """Nested schema for nutritional information."""
    calories: int = Field(..., ge=0)
    protein: float = Field(..., ge=0)
    carbs: float = Field(..., ge=0)
    fat: float = Field(..., ge=0)

class RecipeWithNutrition(RecipeResponse):
    """Recipe response with nutritional data."""
    nutritional_info: Optional[NutritionalInfo] = None
```

### Step 6: Add Query Parameter Schemas
```python
class RecipeSearchQuery(BaseModel):
    """Schema for recipe search query parameters."""
    q: Optional[str] = Field(None, min_length=1, description="Search query")
    cuisine_type: Optional[str] = None
    difficulty: Optional[DifficultyLevel] = None
    max_prep_time: Optional[int] = Field(None, gt=0)
    dietary_tags: Optional[List[str]] = None
    skip: int = Field(default=0, ge=0)
    limit: int = Field(default=20, ge=1, le=100)
```

### Step 7: Add Response List Schemas
```python
class RecipeListResponse(BaseModel):
    """Paginated recipe list response."""
    items: List[RecipeResponse]
    total: int
    skip: int
    limit: int
```

### Step 8: Write Schema Tests
- Test validation rules
- Test field validators
- Test serialization/deserialization
- Test error messages

## Expected Output

**Files:**
- `backend/app/schemas/{resource}.py` - All schemas for resource
- `backend/app/tests/unit/test_{resource}_schema.py` - Schema tests

**Schema Types:**
- Create schema with validation
- Update schema (optional fields)
- Response schema with from_attributes
- Query parameter schema
- List response schema

## Constraints

- **MUST** use Pydantic v2 syntax (ConfigDict, field_validator)
- **MUST** separate Create, Update, and Response schemas
- **MUST** use Field() for constraints and descriptions
- **MUST** add examples in json_schema_extra
- **MUST** use type hints for all fields
- **MUST** validate required fields are not None
- **MUST** use Enum for fields with fixed choices
- **MUST** set from_attributes=True for response schemas
- **MUST NOT** include sensitive data in response schemas
- **MUST** provide clear validation error messages

## Notes

- Use BaseModel inheritance to reduce duplication
- Consider using Pydantic computed_field for derived values
- Add regex patterns for string format validation
- Use constr, conint for constrained types
- Implement custom validators for complex business rules
- Consider using model_validator for cross-field validation
- Add serialization_alias for field name mapping
- Use exclude_unset=True when updating to ignore unset fields
- Consider implementing schema versioning for API evolution