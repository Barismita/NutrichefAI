# FastAPI API Design Skill

## Name
FastAPI RESTful API Endpoint Design

## Description
This skill guides the creation of production-ready FastAPI endpoints following RESTful principles, Clean Architecture patterns, and NutriChef AI coding standards. It covers route handlers, request/response models, error handling, validation, and async operations.

## Purpose
To ensure consistent, secure, and maintainable API endpoint development across the NutriChef AI platform using FastAPI, Pydantic v2, and Clean Architecture principles.

## When to Use
- Creating new API endpoints for resources (recipes, users, meal plans, pantry items)
- Implementing CRUD operations with proper HTTP methods
- Adding search, filter, or pagination functionality to existing resources
- Refactoring existing endpoints to follow project standards
- Designing API versioning strategies
- Implementing authentication-protected routes

## Inputs
- **Resource Name**: The entity being exposed (e.g., Recipe, User, MealPlan)
- **Operations Required**: CRUD operations needed (GET, POST, PUT, PATCH, DELETE)
- **Request Schema**: Pydantic models for request validation (e.g., RecipeCreate, RecipeUpdate)
- **Response Schema**: Pydantic models for response serialization (e.g., RecipeResponse)
- **Service Layer**: Business logic service class (e.g., RecipeService)
- **Authentication Requirements**: Whether endpoint requires authentication/authorization
- **Query Parameters**: Filters, pagination, sorting requirements

## Outputs
- **API Router File**: `backend/app/api/{resource}.py` with route handlers
- **HTTP Endpoints**: RESTful endpoints with proper HTTP methods and status codes
- **Request Validation**: Automatic validation using Pydantic schemas
- **Response Models**: Typed responses with proper serialization
- **Error Handling**: Custom exceptions with appropriate HTTP status codes
- **API Documentation**: Auto-generated OpenAPI docs at `/docs` and `/redoc`
- **Type Hints**: Full type annotations for all functions and parameters

## Best Practices

### 1. RESTful URL Design
- Use plural nouns for resources: `/api/v1/recipes`, `/api/v1/users`
- Use path parameters for resource IDs: `/api/v1/recipes/{recipe_id}`
- Use query parameters for filters: `/api/v1/recipes?ingredient=chicken&max_prep_time=30`
- Version your API: `/api/v1/`, `/api/v2/`

### 2. HTTP Methods and Status Codes
- `GET`: Retrieve resources → `200 OK`
- `POST`: Create resources → `201 Created`
- `PUT`: Full update → `200 OK`
- `PATCH`: Partial update → `200 OK`
- `DELETE`: Remove resources → `204 No Content`
- `400 Bad Request`: Invalid input
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server errors

### 3. Async/Await Pattern
- Always use `async def` for route handlers
- Await all database and I/O operations
- Use `asyncio.gather()` for concurrent operations

### 4. Dependency Injection
- Use FastAPI's dependency injection for services, authentication, pagination
- Keep route handlers thin, delegate to service layer

### 5. Error Handling
- Use custom HTTPException subclasses for domain-specific errors
- Provide clear, actionable error messages
- Log errors with appropriate severity levels

### 6. Validation
- Use Pydantic models for automatic request validation
- Validate business rules in service layer, not in route handlers
- Return validation errors with field-level details

### 7. Documentation
- Add docstrings to all route handlers
- Use `summary` and `description` parameters in decorators
- Provide example responses in schema docstrings

## Common Mistakes

### ❌ Mistake 1: Blocking Synchronous Code in Async Handlers
```python
# BAD: Synchronous database call in async handler
@router.get("/recipes/{recipe_id}")
async def get_recipe(recipe_id: str):
    recipe = Recipe.find_one({"_id": recipe_id})  # Blocking!
    return recipe
```
**Fix**: Always use async database operations
```python
# GOOD: Async database call
@router.get("/recipes/{recipe_id}")
async def get_recipe(recipe_id: str):
    recipe = await Recipe.get(recipe_id)
    return recipe
```

### ❌ Mistake 2: Business Logic in Route Handlers
```python
# BAD: Business logic mixed with route handler
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
**Fix**: Delegate to service layer
```python
# GOOD: Thin route handler, service layer handles logic
@router.post("/recipes", status_code=status.HTTP_201_CREATED)
async def create_recipe(recipe: RecipeCreate):
    return await RecipeService.create_recipe(recipe)
```

### ❌ Mistake 3: Missing Type Hints and Response Models
```python
# BAD: No type hints, no response model
@router.get("/recipes/{recipe_id}")
async def get_recipe(recipe_id):
    return await RecipeService.get_recipe_by_id(recipe_id)
```
**Fix**: Add type hints and response models
```python
# GOOD: Full type hints and response model
@router.get("/recipes/{recipe_id}", response_model=RecipeResponse)
async def get_recipe(recipe_id: str) -> RecipeResponse:
    return await RecipeService.get_recipe_by_id(recipe_id)
```

### ❌ Mistake 4: Generic Error Messages
```python
# BAD: Generic error message
if not recipe:
    raise HTTPException(404, "Not found")
```
**Fix**: Provide specific, actionable error messages
```python
# GOOD: Specific error message
if not recipe:
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Recipe with id {recipe_id} not found"
    )
```

### ❌ Mistake 5: Inconsistent URL Naming
```python
# BAD: Inconsistent naming
@router.get("/Recipe/{id}")  # PascalCase, singular
@router.get("/get-users")     # Verb in URL
```
**Fix**: Use consistent plural nouns
```python
# GOOD: Consistent plural nouns
@router.get("/recipes/{recipe_id}")
@router.get("/users/{user_id}")
```

## Examples

### Example 1: Complete CRUD API for Recipes

```python
# backend/app/api/recipe.py
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, status
from app.schemas.recipe import RecipeCreate, RecipeUpdate, RecipeResponse
from app.services.recipe_service import RecipeService

router = APIRouter(prefix="/api/v1/recipes", tags=["recipes"])

@router.get("/", response_model=List[RecipeResponse])
async def list_recipes(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    ingredient: Optional[str] = None
) -> List[RecipeResponse]:
    """Retrieve a list of recipes with optional filtering.
    
    Args:
        skip: Number of records to skip for pagination
        limit: Maximum number of records to return
        ingredient: Filter recipes by ingredient
        
    Returns:
        List of recipes matching the criteria
    """
    return await RecipeService.list_recipes(
        skip=skip, limit=limit, ingredient=ingredient
    )

@router.get("/{recipe_id}", response_model=RecipeResponse)
async def get_recipe(recipe_id: str) -> RecipeResponse:
    """Retrieve a single recipe by ID.
    
    Args:
        recipe_id: Unique identifier of the recipe
        
    Returns:
        Recipe details
        
    Raises:
        HTTPException: 404 if recipe not found
    """
    recipe = await RecipeService.get_recipe_by_id(recipe_id)
    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Recipe with id {recipe_id} not found"
        )
    return recipe

@router.post("/", response_model=RecipeResponse, status_code=status.HTTP_201_CREATED)
async def create_recipe(recipe: RecipeCreate) -> RecipeResponse:
    """Create a new recipe.
    
    Args:
        recipe: Recipe creation data
        
    Returns:
        The created recipe with generated ID
    """
    return await RecipeService.create_recipe(recipe)

@router.put("/{recipe_id}", response_model=RecipeResponse)
async def update_recipe(
    recipe_id: str,
    recipe: RecipeUpdate
) -> RecipeResponse:
    """Update an existing recipe (full update).
    
    Args:
        recipe_id: Unique identifier of the recipe
        recipe: Complete recipe data for update
        
    Returns:
        The updated recipe
        
    Raises:
        HTTPException: 404 if recipe not found
    """
    updated_recipe = await RecipeService.update_recipe(recipe_id, recipe)
    if not updated_recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Recipe with id {recipe_id} not found"
        )
    return updated_recipe

@router.delete("/{recipe_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_recipe(recipe_id: str) -> None:
    """Delete a recipe by ID.
    
    Args:
        recipe_id: Unique identifier of the recipe
        
    Raises:
        HTTPException: 404 if recipe not found
    """
    deleted = await RecipeService.delete_recipe(recipe_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Recipe with id {recipe_id} not found"
        )
```

### Example 2: Search Endpoint with Multiple Filters

```python
@router.get("/search", response_model=List[RecipeResponse])
async def search_recipes(
    query: Optional[str] = Query(None, min_length=1),
    ingredients: Optional[List[str]] = Query(None),
    max_prep_time: Optional[int] = Query(None, gt=0),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100)
) -> List[RecipeResponse]:
    """Search recipes with multiple filter criteria.
    
    Args:
        query: Text search in title and description
        ingredients: List of required ingredients
        max_prep_time: Maximum preparation time in minutes
        skip: Pagination offset
        limit: Maximum results to return
        
    Returns:
        List of recipes matching search criteria
    """
    return await RecipeService.search_recipes(
        query=query,
        ingredients=ingredients,
        max_prep_time=max_prep_time,
        skip=skip,
        limit=limit
    )
```

### Example 3: Custom Exception Handling

```python
# backend/app/api/exceptions.py
from fastapi import HTTPException, status

class RecipeNotFoundException(HTTPException):
    def __init__(self, recipe_id: str):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Recipe with id {recipe_id} not found"
        )

class DuplicateRecipeException(HTTPException):
    def __init__(self, title: str):
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Recipe with title '{title}' already exists"
        )

# Usage in route handler
@router.get("/{recipe_id}", response_model=RecipeResponse)
async def get_recipe(recipe_id: str) -> RecipeResponse:
    recipe = await RecipeService.get_recipe_by_id(recipe_id)
    if not recipe:
        raise RecipeNotFoundException(recipe_id)
    return recipe
```

## Related Skills
- **pydantic_schema_skill**: For creating request/response schemas
- **service_layer_skill**: For implementing business logic
- **beanie_model_skill**: For database model integration
- **code_review_skill**: For validating API design quality
- **unit_testing_skill**: For testing API endpoints
- **documentation_skill**: For API documentation standards

---

**Skill Version**: 1.0  
**Last Updated**: 2026-07-24  
**Maintained By**: NutriChef AI Development Team