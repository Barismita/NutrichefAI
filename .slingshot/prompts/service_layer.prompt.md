## Objective

Implement service layer classes that encapsulate business logic, orchestrate database operations, handle external integrations, and maintain Clean Architecture principles.

## Context

**Tech Stack:**
- Python 3.11
- Async/await for I/O operations
- Beanie ODM for database access
- Pydantic v2 for data validation

**Architecture:**
- Service Layer: `backend/app/services/`
- Model Layer: `backend/app/models/`
- Schema Layer: `backend/app/schemas/`

**Principles:**
- Single Responsibility Principle
- Dependency Injection
- Separation of Concerns
- Business logic isolated from API layer

## Instructions

### Step 1: Analyze Business Requirements
- Identify business operations and workflows
- Determine data access patterns
- Plan transaction boundaries
- Identify external service dependencies

### Step 2: Define Service Class Structure
```python
from typing import List, Optional
from beanie import PydanticObjectId
from app.models.recipe import Recipe
from app.schemas.recipe import RecipeCreate, RecipeUpdate
from app.exceptions import RecipeNotFoundException, UnauthorizedException
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class RecipeService:
    """Service layer for recipe business logic."""
    
    @staticmethod
    async def create_recipe(recipe_data: RecipeCreate, user_id: str) -> Recipe:
        """Create a new recipe.
        
        Args:
            recipe_data: Recipe creation data
            user_id: ID of the user creating the recipe
            
        Returns:
            Created recipe document
            
        Raises:
            ValueError: If recipe data is invalid
        """
        logger.info(f"Creating recipe for user {user_id}: {recipe_data.title}")
        
        # Business logic: validate ingredients exist
        # await IngredientService.validate_ingredients(recipe_data.ingredients)
        
        recipe = Recipe(
            **recipe_data.model_dump(),
            user_id=user_id,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        await recipe.insert()
        logger.info(f"Recipe created successfully: {recipe.id}")
        return recipe
    
    @staticmethod
    async def get_recipe_by_id(recipe_id: str) -> Optional[Recipe]:
        """Retrieve a recipe by ID.
        
        Args:
            recipe_id: Recipe identifier
            
        Returns:
            Recipe if found, None otherwise
        """
        try:
            return await Recipe.get(PydanticObjectId(recipe_id))
        except Exception as e:
            logger.error(f"Error fetching recipe {recipe_id}: {str(e)}")
            return None
    
    @staticmethod
    async def get_user_recipes(
        user_id: str, 
        skip: int = 0, 
        limit: int = 20
    ) -> List[Recipe]:
        """Get all recipes for a user with pagination.
        
        Args:
            user_id: User identifier
            skip: Number of records to skip
            limit: Maximum number of records to return
            
        Returns:
            List of user's recipes
        """
        return await Recipe.find(
            Recipe.user_id == user_id
        ).skip(skip).limit(limit).sort(-Recipe.created_at).to_list()
    
    @staticmethod
    async def update_recipe(
        recipe_id: str, 
        recipe_data: RecipeUpdate, 
        user_id: str
    ) -> Recipe:
        """Update a recipe.
        
        Args:
            recipe_id: Recipe identifier
            recipe_data: Updated recipe data
            user_id: ID of user making the update
            
        Returns:
            Updated recipe
            
        Raises:
            RecipeNotFoundException: If recipe doesn't exist
            UnauthorizedException: If user doesn't own the recipe
        """
        recipe = await Recipe.get(PydanticObjectId(recipe_id))
        if not recipe:
            raise RecipeNotFoundException(recipe_id)
        
        if recipe.user_id != user_id:
            raise UnauthorizedException("Cannot update another user's recipe")
        
        # Update only provided fields
        update_data = recipe_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(recipe, field, value)
        
        recipe.update_timestamp()
        await recipe.save()
        
        logger.info(f"Recipe {recipe_id} updated by user {user_id}")
        return recipe
    
    @staticmethod
    async def delete_recipe(recipe_id: str, user_id: str) -> None:
        """Delete a recipe.
        
        Args:
            recipe_id: Recipe identifier
            user_id: ID of user making the deletion
            
        Raises:
            RecipeNotFoundException: If recipe doesn't exist
            UnauthorizedException: If user doesn't own the recipe
        """
        recipe = await Recipe.get(PydanticObjectId(recipe_id))
        if not recipe:
            raise RecipeNotFoundException(recipe_id)
        
        if recipe.user_id != user_id:
            raise UnauthorizedException("Cannot delete another user's recipe")
        
        await recipe.delete()
        logger.info(f"Recipe {recipe_id} deleted by user {user_id}")
    
    @staticmethod
    async def search_recipes(query: str, skip: int = 0, limit: int = 20) -> List[Recipe]:
        """Search recipes by text.
        
        Args:
            query: Search query string
            skip: Number of records to skip
            limit: Maximum number of records to return
            
        Returns:
            List of matching recipes
        """
        return await Recipe.find(
            {"$text": {"$search": query}}
        ).skip(skip).limit(limit).to_list()
```

### Step 3: Implement CRUD Operations
- Create: Insert new documents
- Read: Fetch single or multiple documents
- Update: Modify existing documents
- Delete: Remove documents
- Use async/await for all database operations

### Step 4: Add Business Logic
- Validation beyond schema validation
- Business rule enforcement
- Data transformation
- Calculations and aggregations
- Workflow orchestration

### Step 5: Handle Transactions
- Use MongoDB transactions for multi-document operations
- Ensure atomicity for critical operations
- Implement rollback logic for failures

### Step 6: Integrate External Services
- Call external APIs
- Handle external service failures
- Implement retry logic
- Add circuit breakers for resilience

### Step 7: Implement Error Handling
- Define custom exceptions
- Handle database errors
- Log errors with context
- Return meaningful error messages

### Step 8: Add Logging
- Log important operations
- Include user context in logs
- Log errors with stack traces
- Use appropriate log levels

### Step 9: Write Service Tests
- Unit tests with mocked database
- Test business logic thoroughly
- Test error scenarios
- Test edge cases

## Expected Output

**Files:**
- `backend/app/services/{resource}_service.py` - Service class
- `backend/app/exceptions.py` - Custom exceptions (if new)
- `backend/app/tests/unit/test_{resource}_service.py` - Service tests

**Service Features:**
- Complete CRUD operations
- Business logic implementation
- Error handling and logging
- External service integration
- Transaction management
- Type hints and docstrings

## Constraints

- **MUST** use async/await for all I/O operations
- **MUST** implement proper error handling
- **MUST** validate business rules
- **MUST** include logging for important operations
- **MUST** use type hints for all methods
- **MUST** add comprehensive docstrings
- **MUST NOT** include HTTP-specific logic (status codes, headers)
- **MUST NOT** directly access request/response objects
- **MUST** keep services stateless
- **MUST** use dependency injection for external dependencies

## Notes

- Consider implementing service interfaces for testing
- Use dependency injection for database and external clients
- Implement caching for frequently accessed data
- Add metrics and monitoring for service operations
- Consider implementing event publishing for state changes
- Plan for background task processing
- Implement idempotency for critical operations
- Add rate limiting for resource-intensive operations
- Consider implementing saga pattern for distributed transactions