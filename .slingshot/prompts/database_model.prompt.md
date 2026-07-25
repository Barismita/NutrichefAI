## Objective

Create well-structured Beanie ODM document models for MongoDB with proper field types, indexes, validation, and relationships.

## Context

**Tech Stack:**
- Beanie ODM for document modeling
- MongoDB for data storage
- PyMongo Async for async operations
- Pydantic v2 for validation
- Python 3.11

**Model Location:**
- `backend/app/models/`

**Database Configuration:**
- `backend/app/database/mongodb.py`

## Instructions

### Step 1: Analyze Requirements
- Identify entity attributes and relationships
- Determine required vs optional fields
- Plan indexing strategy for query patterns
- Consider data access patterns

### Step 2: Define Document Model
```python
from beanie import Document, Indexed, Link
from pydantic import Field, field_validator
from typing import Optional, List
from datetime import datetime
from enum import Enum

class DifficultyLevel(str, Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"

class Recipe(Document):
    """Recipe document model."""
    
    # Indexed fields for query optimization
    title: Indexed(str) = Field(..., min_length=1, max_length=200)
    user_id: Indexed(str)
    
    # Regular fields
    description: Optional[str] = Field(None, max_length=1000)
    ingredients: List[str] = Field(..., min_items=1)
    instructions: str = Field(..., min_length=10)
    prep_time: int = Field(..., gt=0, description="Preparation time in minutes")
    cook_time: int = Field(..., gt=0, description="Cooking time in minutes")
    servings: int = Field(..., gt=0)
    difficulty: DifficultyLevel = DifficultyLevel.MEDIUM
    cuisine_type: Optional[str] = None
    dietary_tags: List[str] = Field(default_factory=list)
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    # ingredients_details: Optional[List[Link[Ingredient]]] = None
    
    class Settings:
        name = "recipes"  # Collection name
        indexes = [
            "title",
            "user_id",
            [("user_id", 1), ("created_at", -1)],  # Compound index
            [("title", "text"), ("description", "text")],  # Text search
        ]
    
    @field_validator("title")
    @classmethod
    def validate_title(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Title cannot be empty")
        return v.strip()
    
    def update_timestamp(self):
        """Update the updated_at timestamp."""
        self.updated_at = datetime.utcnow()
```

### Step 3: Define Field Types
- **Indexed(type)**: For frequently queried fields
- **Link[Model]**: For relationships to other documents
- **Optional[type]**: For nullable fields
- **List[type]**: For arrays
- **Enum**: For fields with fixed choices
- Use Pydantic Field() for validation constraints

### Step 4: Create Indexes
- **Single field index**: `"field_name"`
- **Compound index**: `[("field1", 1), ("field2", -1)]`
- **Text index**: `[("field", "text")]` for full-text search
- **Unique index**: Use `Indexed(str, unique=True)`
- Index fields used in:
  - WHERE clauses
  - Sorting operations
  - Join operations
  - Aggregations

### Step 5: Add Validation
- Use Pydantic field validators
- Validate field constraints (min/max length, ranges)
- Custom validation logic with @field_validator
- Cross-field validation if needed

### Step 6: Define Relationships
- Use `Link[Model]` for references to other documents
- Use `BackLink[Model]` for reverse relationships
- Consider embedding vs referencing based on access patterns
- Fetch linked documents with `.fetch_link()` or `.fetch_all_links()`

### Step 7: Add Helper Methods
- Methods for common operations
- Timestamp update methods
- Computed properties
- Serialization methods

### Step 8: Register Model
- Add model to database initialization in `backend/app/database/mongodb.py`:
```python
await init_beanie(
    database=client[settings.DATABASE_NAME],
    document_models=[Recipe, User, PantryItem]  # Add new model here
)
```

### Step 9: Write Model Tests
- Test model creation and validation
- Test index creation
- Test relationships
- Test custom validators

## Expected Output

**Files:**
- `backend/app/models/{resource}.py` - Document model
- `backend/app/tests/unit/test_{resource}_model.py` - Model tests
- Updated `backend/app/database/mongodb.py` - Model registration

**Model Features:**
- Proper field types with validation
- Strategic indexes for query optimization
- Relationships to other models
- Custom validators for business rules
- Helper methods for common operations
- Timestamps for auditing

## Constraints

- **MUST** use Beanie Document as base class
- **MUST** define collection name in Settings.name
- **MUST** add indexes for frequently queried fields
- **MUST** use Pydantic v2 field validators
- **MUST** include created_at and updated_at timestamps
- **MUST** use type hints for all fields
- **MUST** validate required fields are not None
- **MUST NOT** over-index (impacts write performance)
- **MUST** use Enum for fields with fixed choices
- **MUST** document field purposes in descriptions

## Notes

- Monitor index usage with MongoDB explain() plans
- Consider partial indexes for conditional queries
- Use sparse indexes for optional fields
- Plan for data migration when schema changes
- Consider implementing soft deletes with is_deleted field
- Add version field for optimistic locking if needed
- Use embedded documents for tightly coupled data
- Use references for loosely coupled data
- Consider denormalization for read-heavy workloads
- Plan for sharding strategy if scaling is needed