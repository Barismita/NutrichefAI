# Service Layer Design Skill

## Name
Service Layer Business Logic Implementation

## Description
This skill provides comprehensive guidance for implementing the service layer in the NutriChef AI platform following Clean Architecture principles. It covers business logic encapsulation, orchestration, transaction management, error handling, and async patterns.

## Purpose
To ensure consistent, maintainable, and testable business logic implementation using service classes that orchestrate database operations, external API calls, and business rules for the NutriChef AI platform.

## When to Use
- Implementing business logic for new features
- Creating service classes for entities (RecipeService, UserService, MealPlanService)
- Orchestrating multiple database operations in a single transaction
- Integrating external APIs (AI recipe generation, nutrition data)
- Implementing complex business rules and validation
- Refactoring business logic from route handlers to service layer
- Adding caching, logging, or monitoring to business operations

## Inputs
- **Entity Name**: The resource being managed (e.g., Recipe, User, MealPlan)
- **Business Operations**: CRUD operations and custom business logic
- **Beanie Models**: Database models to interact with
- **Pydantic Schemas**: Request/response schemas for validation
- **External Dependencies**: Third-party APIs, services, or libraries
- **Business Rules**: Validation rules, constraints, workflows

## Outputs
- **Service File**: `backend/app/services/{entity}_service.py` with service class
- **Static Methods**: Business logic methods using `@staticmethod`
- **Type Hints**: Full type annotations for all methods
- **Error Handling**: Custom exceptions for business rule violations
- **Async Operations**: All I/O operations using async/await
- **Logging**: Structured logging for operations and errors
- **Documentation**: Docstrings for all public methods

## Best Practices

### 1. Service Class Structure
- Use a single service class per entity (e.g., `RecipeService`)
- Use `@staticmethod` for stateless methods (no `self` needed)
- Group related operations together
- Keep methods focused on single responsibility

### 2. Business Logic Encapsulation
- All business logic in service layer, not in route handlers or models
- Route handlers should be thin, delegating to services
- Models should only contain data and simple validation
- Services orchestrate models, schemas, and external dependencies

### 3. Async/Await Pattern
- All service methods should be `async def`
- Await all database operations, external API calls, I/O
- Use `asyncio.gather()` for concurrent operations
- Never use blocking synchronous calls

### 4. Error Handling
- Raise custom exceptions for business rule violations
- Use HTTPException for API-specific errors
- Log errors with appropriate severity levels
- Provide clear, actionable error messages

### 5. Transaction Management
- Use Beanie's session management for multi-document transactions
- Rollback on errors to maintain data consistency
- Keep transactions short and focused

### 6. Validation
- Validate business rules in service layer
- Use Pydantic schemas for data validation
- Fail fast with clear error messages

### 7. Logging
- Log entry and exit of critical operations
- Log errors with full context and stack traces
- Use structured logging with correlation IDs

## Common Mistakes

### ❌ Mistake 1: Business Logic in Route Handlers
```python
# BAD: Business logic in route handler
@router.post("/recipes")
async def create_recipe(recipe: RecipeCreate):
    # Validation logic
    if not recipe.ingredients:
        raise HTTPException(400, "Ingredients required")
    # Database logic
    new_recipe = Recipe(**recipe.model_dump())
    await new_recipe.insert()
    return new_recipe
```
**Fix**: Move business logic to service layer
```python
# GOOD: Thin route handler, service handles logic
@router.post("/recipes", status_code=status.HTTP_201_CREATED)
async def create_recipe(recipe: RecipeCreate) -> RecipeResponse:
    return await RecipeService.create_recipe(recipe)

# Service layer
class RecipeService:
    @staticmethod
    async def create_recipe(recipe_data: RecipeCreate) -> Recipe:
        # Business logic here
        if not recipe_data.ingredients:
            raise ValueError("Ingredients required")
        recipe = Recipe(**recipe_data.model_dump())
        await recipe.insert()
        return recipe
```

### ❌ Mistake 2: Using Instance Methods Instead of Static Methods
```python
# BAD: Instance method with no state
class RecipeService:
    async def create_recipe(self, recipe_data: RecipeCreate) -> Recipe:
        # No use of self, should be static
        recipe = Recipe(**recipe_data.model_dump())
        await recipe.insert()
        return recipe
```
**Fix**: Use static methods for stateless operations
```python
# GOOD: Static method for stateless operations
class RecipeService:
    @staticmethod
    async def create_recipe(recipe_data: RecipeCreate) -> Recipe:
        recipe = Recipe(**recipe_data.model_dump())
        await recipe.insert()
        return recipe
```

### ❌ Mistake 3: Missing Error Handling
```python
# BAD: No error handling
class RecipeService:
    @staticmethod
    async def get_recipe_by_id(recipe_id: str) -> Recipe:
        return await Recipe.get(recipe_id)  # Returns None if not found
```
**Fix**: Handle errors and raise appropriate exceptions
```python
# GOOD: Proper error handling
from fastapi import HTTPException, status
import logging

logger = logging.getLogger(__name__)

class RecipeService:
    @staticmethod
    async def get_recipe_by_id(recipe_id: str) -> Recipe:
        try:
            recipe = await Recipe.get(recipe_id)
            if not recipe:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Recipe with id {recipe_id} not found"
                )
            return recipe
        except Exception as e:
            logger.error(f"Error fetching recipe {recipe_id}: {str(e)}")
            raise
```

### ❌ Mistake 4: Synchronous Operations in Async Methods
```python
# BAD: Blocking synchronous call in async method
class RecipeService:
    @staticmethod
    async def create_recipe(recipe_data: RecipeCreate) -> Recipe:
        recipe = Recipe(**recipe_data.model_dump())
        recipe.insert()  # Missing await! Blocking call
        return recipe
```
**Fix**: Always await async operations
```python
# GOOD: Properly awaited async operations
class RecipeService:
    @staticmethod
    async def create_recipe(recipe_data: RecipeCreate) -> Recipe:
        recipe = Recipe(**recipe_data.model_dump())
        await recipe.insert()
        return recipe
```

### ❌ Mistake 5: Missing Type Hints
```python
# BAD: No type hints
class RecipeService:
    @staticmethod
    async def create_recipe(recipe_data):
        recipe = Recipe(**recipe_data.model_dump())
        await recipe.insert()
        return recipe
```
**Fix**: Add full type hints
```python
# GOOD: Full type hints
from typing import List, Optional

class RecipeService:
    @staticmethod
    async def create_recipe(recipe_data: RecipeCreate) -> Recipe:
        recipe = Recipe(**recipe_data.model_dump())
        await recipe.insert()
        return recipe
```

## Examples

### Example 1: Complete Recipe Service with CRUD Operations

```python
# backend/app/services/recipe_service.py
from typing import List, Optional
from fastapi import HTTPException, status
import logging
from app.models.recipe import Recipe
from app.schemas.recipe import RecipeCreate, RecipeUpdate, RecipePatch

logger = logging.getLogger(__name__)

class RecipeService:
    """Service layer for recipe business logic."""
    
    @staticmethod
    async def create_recipe(recipe_data: RecipeCreate) -> Recipe:
        """Create a new recipe.
        
        Args:
            recipe_data: Recipe creation data
            
        Returns:
            The created recipe
            
        Raises:
            HTTPException: If recipe with same title already exists
        """
        logger.info(f"Creating recipe: {recipe_data.title}")
        
        # Check for duplicate title
        existing = await Recipe.get_by_title(recipe_data.title)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Recipe with title '{recipe_data.title}' already exists"
            )
        
        try:
            recipe = Recipe(**recipe_data.model_dump())
            await recipe.insert()
            logger.info(f"Recipe created successfully: {recipe.id}")
            return recipe
        except Exception as e:
            logger.error(f"Failed to create recipe: {str(e)}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create recipe"
            )
    
    @staticmethod
    async def get_recipe_by_id(recipe_id: str) -> Recipe:
        """Retrieve a recipe by ID.
        
        Args:
            recipe_id: Recipe unique identifier
            
        Returns:
            Recipe object
            
        Raises:
            HTTPException: 404 if recipe not found
        """
        recipe = await Recipe.get(recipe_id)
        if not recipe or recipe.is_deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Recipe with id {recipe_id} not found"
            )
        return recipe
    
    @staticmethod
    async def list_recipes(
        skip: int = 0,
        limit: int = 10,
        ingredient: Optional[str] = None
    ) -> List[Recipe]:
        """List recipes with optional filtering.
        
        Args:
            skip: Number of records to skip for pagination
            limit: Maximum number of records to return
            ingredient: Filter by ingredient name
            
        Returns:
            List of recipes
        """
        query = Recipe.find(Recipe.is_deleted == False)
        
        if ingredient:
            query = query.find({"ingredients": {"$in": [ingredient]}})
        
        recipes = await query.skip(skip).limit(limit).to_list()
        return recipes
    
    @staticmethod
    async def update_recipe(
        recipe_id: str,
        recipe_data: RecipeUpdate
    ) -> Recipe:
        """Update a recipe (full update).
        
        Args:
            recipe_id: Recipe unique identifier
            recipe_data: Complete recipe data for update
            
        Returns:
            Updated recipe
            
        Raises:
            HTTPException: 404 if recipe not found
        """
        recipe = await RecipeService.get_recipe_by_id(recipe_id)
        
        try:
            update_data = recipe_data.model_dump(exclude_unset=True)
            for field, value in update_data.items():
                setattr(recipe, field, value)
            
            await recipe.save()
            logger.info(f"Recipe updated successfully: {recipe_id}")
            return recipe
        except Exception as e:
            logger.error(f"Failed to update recipe {recipe_id}: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update recipe"
            )
    
    @staticmethod
    async def delete_recipe(recipe_id: str) -> bool:
        """Soft delete a recipe.
        
        Args:
            recipe_id: Recipe unique identifier
            
        Returns:
            True if deleted successfully
            
        Raises:
            HTTPException: 404 if recipe not found
        """
        recipe = await RecipeService.get_recipe_by_id(recipe_id)
        
        try:
            await recipe.soft_delete()
            logger.info(f"Recipe deleted successfully: {recipe_id}")
            return True
        except Exception as e:
            logger.error(f"Failed to delete recipe {recipe_id}: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to delete recipe"
            )
```

### Example 2: Service with External API Integration

```python
# backend/app/services/ai_recipe_service.py
import asyncio
import httpx
from typing import List
import logging
from app.models.recipe import Recipe
from app.schemas.recipe import RecipeCreate
from app.config.settings import settings

logger = logging.getLogger(__name__)

class AIRecipeService:
    """Service for AI-powered recipe generation."""
    
    @staticmethod
    async def generate_recipe_from_ingredients(
        ingredients: List[str]
    ) -> Recipe:
        """Generate a recipe using AI based on available ingredients.
        
        Args:
            ingredients: List of available ingredients
            
        Returns:
            Generated recipe
            
        Raises:
            HTTPException: If AI service fails
        """
        logger.info(f"Generating recipe for ingredients: {ingredients}")
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{settings.AI_SERVICE_URL}/generate-recipe",
                    json={"ingredients": ingredients},
                    timeout=30.0
                )
                response.raise_for_status()
                
            recipe_data = response.json()
            recipe_create = RecipeCreate(**recipe_data)
            
            # Save generated recipe
            recipe = Recipe(**recipe_create.model_dump())
            await recipe.insert()
            
            logger.info(f"Recipe generated successfully: {recipe.id}")
            return recipe
            
        except httpx.HTTPError as e:
            logger.error(f"AI service error: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="AI recipe generation service unavailable"
            )
        except Exception as e:
            logger.error(f"Failed to generate recipe: {str(e)}")
            raise
```

### Example 3: Service with Concurrent Operations

```python
# backend/app/services/meal_plan_service.py
import asyncio
from typing import List
from app.models.meal_plan import MealPlan
from app.models.recipe import Recipe
from app.schemas.meal_plan import MealPlanCreate

class MealPlanService:
    """Service for meal plan management."""
    
    @staticmethod
    async def create_meal_plan_with_recipes(
        meal_plan_data: MealPlanCreate,
        recipe_ids: List[str]
    ) -> MealPlan:
        """Create a meal plan and validate all recipes exist.
        
        Args:
            meal_plan_data: Meal plan creation data
            recipe_ids: List of recipe IDs to include
            
        Returns:
            Created meal plan
            
        Raises:
            HTTPException: If any recipe not found
        """
        # Fetch all recipes concurrently
        recipe_tasks = [Recipe.get(recipe_id) for recipe_id in recipe_ids]
        recipes = await asyncio.gather(*recipe_tasks)
        
        # Validate all recipes exist
        missing_ids = [
            recipe_id for recipe_id, recipe in zip(recipe_ids, recipes)
            if recipe is None
        ]
        if missing_ids:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Recipes not found: {', '.join(missing_ids)}"
            )
        
        # Create meal plan
        meal_plan = MealPlan(**meal_plan_data.model_dump())
        await meal_plan.insert()
        
        return meal_plan
```

## Related Skills
- **fastapi_api_skill**: For integrating services with API endpoints
- **beanie_model_skill**: For database operations in services
- **pydantic_schema_skill**: For validating service inputs/outputs
- **unit_testing_skill**: For testing service logic
- **code_review_skill**: For validating service design quality
- **documentation_skill**: For documenting service methods

---

**Skill Version**: 1.0  
**Last Updated**: 2026-07-24  
**Maintained By**: NutriChef AI Development Team