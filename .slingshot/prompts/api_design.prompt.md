---
name: "RESTful API Endpoint Design"
description: "Guide creation of well-structured FastAPI endpoints following REST principles and best practices"
category: "Architecture & Design"
tags: ["api", "fastapi", "rest", "endpoints", "http"]
---

## Objective

Design and implement RESTful API endpoints using FastAPI that follow industry best practices, proper HTTP semantics, and Clean Architecture principles.

## Context

**Tech Stack:**
- FastAPI for API framework
- Pydantic v2 for request/response validation
- Python 3.11 with type hints
- Async/await for I/O operations

**Architecture:**
- API Layer: `backend/app/api/`
- Service Layer: `backend/app/services/`
- Schema Layer: `backend/app/schemas/`

**REST Principles:**
- Resource-based URLs
- HTTP method semantics (GET, POST, PUT, PATCH, DELETE)
- Proper status codes
- Stateless communication

## Instructions

### Step 1: Define Resource
- Identify the resource (e.g., users, recipes, pantry items)
- Use plural nouns for resource names
- Plan resource hierarchy and relationships

### Step 2: Design URL Structure
- Base path: `/api/v1/{resource}`
- Collection endpoint: `/api/v1/recipes`
- Single resource: `/api/v1/recipes/{recipe_id}`
- Nested resources: `/api/v1/users/{user_id}/recipes`
- Actions: `/api/v1/recipes/{recipe_id}/publish`
- Avoid verbs in URLs (use HTTP methods instead)

### Step 3: Select HTTP Methods
- **GET**: Retrieve resources (list or single)
  - `/api/v1/recipes` - List all recipes
  - `/api/v1/recipes/{id}` - Get single recipe
- **POST**: Create new resources
  - `/api/v1/recipes` - Create recipe
- **PUT**: Full replacement of resource
  - `/api/v1/recipes/{id}` - Replace entire recipe
- **PATCH**: Partial update of resource
  - `/api/v1/recipes/{id}` - Update specific fields
- **DELETE**: Remove resource
  - `/api/v1/recipes/{id}` - Delete recipe

### Step 4: Define Status Codes
- **200 OK**: Successful GET, PUT, PATCH
- **201 Created**: Successful POST with resource creation
- **204 No Content**: Successful DELETE or update with no response body
- **400 Bad Request**: Invalid input data
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: Authenticated but not authorized
- **404 Not Found**: Resource doesn't exist
- **409 Conflict**: Resource conflict (e.g., duplicate)
- **422 Unprocessable Entity**: Validation errors
- **500 Internal Server Error**: Server-side errors

### Step 5: Create Request/Response Schemas
- Define Pydantic models in `backend/app/schemas/`
- Separate schemas for Create, Update, Response
- Use field validators for custom validation
- Include examples in schema for documentation

### Step 6: Implement Endpoint
```python
from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from app.schemas.recipe import RecipeCreate, RecipeUpdate, RecipeResponse
from app.services.recipe_service import RecipeService

router = APIRouter(prefix="/api/v1/recipes", tags=["recipes"])

@router.post("/", response_model=RecipeResponse, status_code=status.HTTP_201_CREATED)
async def create_recipe(recipe: RecipeCreate, service: RecipeService = Depends()):
    """Create a new recipe."""
    return await service.create_recipe(recipe)

@router.get("/", response_model=List[RecipeResponse])
async def list_recipes(skip: int = 0, limit: int = 20, service: RecipeService = Depends()):
    """List all recipes with pagination."""
    return await service.get_recipes(skip=skip, limit=limit)

@router.get("/{recipe_id}", response_model=RecipeResponse)
async def get_recipe(recipe_id: str, service: RecipeService = Depends()):
    """Get a single recipe by ID."""
    recipe = await service.get_recipe_by_id(recipe_id)
    if not recipe:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recipe not found")
    return recipe

@router.patch("/{recipe_id}", response_model=RecipeResponse)
async def update_recipe(recipe_id: str, recipe: RecipeUpdate, service: RecipeService = Depends()):
    """Partially update a recipe."""
    return await service.update_recipe(recipe_id, recipe)

@router.delete("/{recipe_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_recipe(recipe_id: str, service: RecipeService = Depends()):
    """Delete a recipe."""
    await service.delete_recipe(recipe_id)
```

### Step 7: Add Query Parameters
- Pagination: `skip`, `limit`
- Sorting: `sort_by`, `order` (asc/desc)
- Filtering: Resource-specific filters
- Search: `q` or `search`

### Step 8: Implement Error Handling
- Use FastAPI's HTTPException
- Return consistent error response format
- Include error details and codes

### Step 9: Add Documentation
- Use docstrings for endpoint descriptions
- Add parameter descriptions
- Include response examples
- FastAPI auto-generates OpenAPI docs

### Step 10: Write Tests
- Test all endpoints with FastAPI TestClient
- Test success and error scenarios
- Test validation and status codes

## Expected Output

**Files:**
- `backend/app/api/{resource}.py` - Router with endpoints
- `backend/app/schemas/{resource}.py` - Request/response schemas
- `backend/app/tests/integration/test_{resource}_api.py` - Integration tests

**Endpoint Characteristics:**
- RESTful URL structure
- Proper HTTP methods and status codes
- Request/response validation
- Comprehensive error handling
- Auto-generated API documentation
- Type hints throughout

## Constraints

- **MUST** use plural nouns for resource names
- **MUST** follow REST principles and HTTP semantics
- **MUST** use appropriate status codes
- **MUST** validate all inputs with Pydantic
- **MUST** use dependency injection for services
- **MUST** include type hints for all parameters
- **MUST** add docstrings for documentation
- **MUST NOT** use verbs in URLs (except for actions)
- **MUST NOT** return sensitive data in responses
- **MUST** implement pagination for list endpoints

## Notes

- Consider versioning strategy (URL vs header)
- Add rate limiting for public endpoints
- Implement CORS configuration
- Add request/response logging
- Consider implementing HATEOAS for discoverability
- Plan for API deprecation strategy
- Add health check endpoint: `/api/v1/health`
- Implement consistent error response format across all endpoints