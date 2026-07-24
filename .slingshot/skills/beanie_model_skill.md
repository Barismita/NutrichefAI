# Beanie ODM Model Design Skill

## Name
Beanie ODM Document Model Design for MongoDB

## Description
This skill provides comprehensive guidance for creating production-ready Beanie ODM document models for MongoDB in the NutriChef AI platform. It covers schema design, indexing strategies, relationships, validation, and async query patterns.

## Purpose
To ensure consistent, performant, and maintainable database models using Beanie ODM, MongoDB, PyMongo Async, and Clean Architecture principles for the NutriChef AI data layer.

## When to Use
- Creating new database models for entities (Recipe, User, MealPlan, PantryItem)
- Defining document schemas with proper field types and validation
- Implementing indexes for query optimization
- Establishing relationships between collections (references, embedded documents)
- Migrating from synchronous MongoDB to async Beanie ODM
- Refactoring existing models to follow project standards
- Implementing soft deletes or audit trails

## Inputs
- **Entity Name**: The resource being modeled (e.g., Recipe, User, MealPlan)
- **Field Definitions**: Field names, types, constraints, defaults
- **Relationships**: References to other collections or embedded documents
- **Index Requirements**: Fields requiring indexes for query performance
- **Validation Rules**: Business rules for field validation
- **Collection Name**: MongoDB collection name (plural, lowercase)

## Outputs
- **Model File**: `backend/app/models/{entity}.py` with Beanie Document class
- **Type-Hinted Fields**: All fields with proper Python 3.11 type hints
- **Indexes**: Database indexes defined in Settings class
- **Validation**: Pydantic validators for business rules
- **Relationships**: Properly configured references or embedded documents
- **Async Methods**: Custom query methods using async/await
- **Collection Configuration**: Collection name and settings

## Best Practices

### 1. Document Class Structure
- Inherit from `beanie.Document`
- Use Pydantic v2 field types and validators
- Define indexes in nested `Settings` class
- Use `Indexed()` for frequently queried fields
- Add `default_factory` for timestamps

### 2. Field Type Selection
- Use `str` for text fields
- Use `int` for numeric fields
- Use `datetime` for timestamps (UTC only)
- Use `List[T]` for arrays
- Use `Optional[T]` for nullable fields
- Use `Decimal128` for precise decimal values (prices, measurements)

### 3. Indexing Strategy
- Index fields used in queries, filters, sorts
- Use compound indexes for multi-field queries
- Create descending indexes for reverse chronological sorts: `[("created_at", -1)]`
- Use unique indexes for fields requiring uniqueness (email, username)
- Monitor index usage with `.explain()`

### 4. Relationships
- Use `Link[T]` for references to other documents (lazy loading)
- Use embedded documents for tightly coupled data
- Avoid deep nesting (max 2-3 levels)
- Use `fetch_links=True` when querying to load referenced documents

### 5. Validation
- Use Pydantic `Field()` for basic validation (min_length, max_length, gt, lt)
- Use `@field_validator` for custom validation logic
- Validate business rules, not just data types
- Provide clear error messages

### 6. Collection Naming
- Use lowercase plural nouns: `recipes`, `users`, `meal_plans`
- Avoid special characters except underscores
- Be consistent across the project

### 7. Async Query Patterns
- Use `.find()` for queries returning multiple documents
- Use `.get()` for single document by ID
- Use `.find_one()` for single document by filter
- Use `.aggregate()` for complex queries
- Always `await` async operations

## Common Mistakes

### ❌ Mistake 1: Missing Indexes on Queried Fields
```python
# BAD: No index on frequently queried field
class Recipe(Document):
    title: str
    user_id: str  # Frequently queried, but not indexed
    
    class Settings:
        name = "recipes"
```
**Fix**: Add indexes for queried fields
```python
# GOOD: Index on queried field
class Recipe(Document):
    title: Indexed(str)
    user_id: Indexed(str)
    
    class Settings:
        name = "recipes"
        indexes = [
            "user_id",
            [("created_at", -1)]
        ]
```

### ❌ Mistake 2: Using Synchronous Methods
```python
# BAD: Synchronous query method
class Recipe(Document):
    @classmethod
    def get_by_title(cls, title: str):
        return cls.find_one({"title": title})  # Not async!
```
**Fix**: Use async methods
```python
# GOOD: Async query method
class Recipe(Document):
    @classmethod
    async def get_by_title(cls, title: str) -> Optional["Recipe"]:
        return await cls.find_one(cls.title == title)
```

### ❌ Mistake 3: Missing Type Hints
```python
# BAD: No type hints
class Recipe(Document):
    title = Field(...)
    ingredients = Field(...)
    prep_time = Field(...)
```
**Fix**: Add explicit type hints
```python
# GOOD: Full type hints
class Recipe(Document):
    title: str = Field(..., min_length=1, max_length=200)
    ingredients: List[str] = Field(..., min_items=1)
    prep_time: int = Field(..., gt=0)
```

### ❌ Mistake 4: Not Using UTC for Timestamps
```python
# BAD: Local timezone
from datetime import datetime

class Recipe(Document):
    created_at: datetime = Field(default_factory=datetime.now)  # Local time!
```
**Fix**: Always use UTC
```python
# GOOD: UTC timestamps
from datetime import datetime

class Recipe(Document):
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

### ❌ Mistake 5: Over-Embedding Documents
```python
# BAD: Deep nesting, tightly coupled
class Recipe(Document):
    author: dict  # Embedded user data
    comments: List[dict]  # Embedded comments with user data
```
**Fix**: Use references for loosely coupled data
```python
# GOOD: References for independent entities
from beanie import Link

class Recipe(Document):
    author_id: Link[User]  # Reference to User document
    # Comments in separate collection with recipe_id reference
```

## Examples

### Example 1: Complete Recipe Model with Indexes

```python
# backend/app/models/recipe.py
from typing import List, Optional
from datetime import datetime
from beanie import Document, Indexed, Link
from pydantic import Field, field_validator
from app.models.user import User

class Recipe(Document):
    """Recipe document model for MongoDB.
    
    Represents a recipe with ingredients, instructions, and metadata.
    """
    
    title: Indexed(str) = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    ingredients: List[str] = Field(..., min_items=1)
    instructions: str = Field(..., min_length=10)
    prep_time: int = Field(..., gt=0, description="Preparation time in minutes")
    cook_time: int = Field(..., gt=0, description="Cooking time in minutes")
    servings: int = Field(..., gt=0)
    
    # Relationships
    author_id: Link[User]
    
    # Metadata
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_deleted: bool = Field(default=False)  # Soft delete
    
    class Settings:
        name = "recipes"  # Collection name
        indexes = [
            "title",
            "author_id",
            [("created_at", -1)],  # Descending index for recent recipes
            [("author_id", 1), ("created_at", -1)],  # Compound index
        ]
    
    @field_validator('title')
    @classmethod
    def title_must_not_be_empty(cls, v: str) -> str:
        """Validate title is not empty or whitespace."""
        if not v.strip():
            raise ValueError('Title cannot be empty or whitespace')
        return v.strip()
    
    @field_validator('ingredients')
    @classmethod
    def ingredients_must_not_be_empty(cls, v: List[str]) -> List[str]:
        """Validate ingredients are not empty strings."""
        cleaned = [ing.strip() for ing in v if ing.strip()]
        if not cleaned:
            raise ValueError('At least one valid ingredient is required')
        return cleaned
    
    @classmethod
    async def get_by_title(cls, title: str) -> Optional["Recipe"]:
        """Find recipe by exact title match.
        
        Args:
            title: Recipe title to search for
            
        Returns:
            Recipe if found, None otherwise
        """
        return await cls.find_one(cls.title == title, cls.is_deleted == False)
    
    @classmethod
    async def get_user_recipes(
        cls,
        user_id: str,
        skip: int = 0,
        limit: int = 10
    ) -> List["Recipe"]:
        """Get all recipes for a specific user.
        
        Args:
            user_id: User ID to filter by
            skip: Number of records to skip
            limit: Maximum number of records to return
            
        Returns:
            List of recipes
        """
        return await cls.find(
            cls.author_id == user_id,
            cls.is_deleted == False
        ).sort(-cls.created_at).skip(skip).limit(limit).to_list()
```

### Example 2: Model with Embedded Documents

```python
# backend/app/models/meal_plan.py
from typing import List
from datetime import datetime
from beanie import Document, Link
from pydantic import BaseModel, Field
from app.models.recipe import Recipe
from app.models.user import User

class MealEntry(BaseModel):
    """Embedded document for a single meal in a meal plan."""
    recipe_id: str
    meal_type: str = Field(..., pattern="^(breakfast|lunch|dinner|snack)$")
    date: datetime
    servings: int = Field(..., gt=0)

class MealPlan(Document):
    """Meal plan document with embedded meal entries."""
    
    user_id: Link[User]
    name: str = Field(..., min_length=1, max_length=100)
    meals: List[MealEntry] = Field(default_factory=list)
    start_date: datetime
    end_date: datetime
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "meal_plans"
        indexes = [
            "user_id",
            [("start_date", 1)],
            [("user_id", 1), ("start_date", -1)]
        ]
    
    @field_validator('end_date')
    @classmethod
    def end_date_after_start_date(cls, v: datetime, info) -> datetime:
        """Validate end_date is after start_date."""
        if 'start_date' in info.data and v <= info.data['start_date']:
            raise ValueError('end_date must be after start_date')
        return v
```

### Example 3: Async Query Methods

```python
class Recipe(Document):
    # ... field definitions ...
    
    @classmethod
    async def search_by_ingredients(
        cls,
        ingredients: List[str]
    ) -> List["Recipe"]:
        """Search recipes containing specific ingredients.
        
        Args:
            ingredients: List of ingredient names to search for
            
        Returns:
            List of recipes containing any of the ingredients
        """
        return await cls.find(
            {"ingredients": {"$in": ingredients}},
            cls.is_deleted == False
        ).to_list()
    
    @classmethod
    async def get_recent_recipes(cls, limit: int = 10) -> List["Recipe"]:
        """Get most recently created recipes.
        
        Args:
            limit: Maximum number of recipes to return
            
        Returns:
            List of recent recipes
        """
        return await cls.find(
            cls.is_deleted == False
        ).sort(-cls.created_at).limit(limit).to_list()
    
    async def soft_delete(self) -> None:
        """Soft delete the recipe by setting is_deleted flag."""
        self.is_deleted = True
        self.updated_at = datetime.utcnow()
        await self.save()
```

### Example 4: Aggregation Pipeline

```python
class Recipe(Document):
    @classmethod
    async def get_recipes_by_prep_time_range(
        cls,
        min_time: int,
        max_time: int
    ) -> List[dict]:
        """Get recipes grouped by prep time range using aggregation.
        
        Args:
            min_time: Minimum prep time in minutes
            max_time: Maximum prep time in minutes
            
        Returns:
            List of aggregated recipe data
        """
        pipeline = [
            {"$match": {
                "prep_time": {"$gte": min_time, "$lte": max_time},
                "is_deleted": False
            }},
            {"$group": {
                "_id": "$author_id",
                "count": {"$sum": 1},
                "avg_prep_time": {"$avg": "$prep_time"}
            }},
            {"$sort": {"count": -1}}
        ]
        return await cls.aggregate(pipeline).to_list()
```

## Related Skills
- **pydantic_schema_skill**: For creating request/response schemas from models
- **fastapi_api_skill**: For exposing models through API endpoints
- **service_layer_skill**: For implementing business logic with models
- **unit_testing_skill**: For testing model validation and queries
- **code_review_skill**: For validating model design quality

---

**Skill Version**: 1.0  
**Last Updated**: 2026-07-24  
**Maintained By**: NutriChef AI Development Team