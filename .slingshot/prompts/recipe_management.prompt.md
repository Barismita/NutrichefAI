---
name: "Recipe Management CRUD Operations"
description: "Guide implementation of complete recipe management with search, filter, and relationship handling"
category: "Feature Development"
tags: ["recipe", "crud", "search", "relationships", "fastapi"]
---

## Objective

Implement comprehensive recipe management functionality including CRUD operations, advanced search/filter capabilities, ingredient relationship management, and nutritional data integration.

## Context

**Tech Stack:**
- Python 3.11
- FastAPI for API endpoints
- Beanie ODM for MongoDB operations
- PyMongo Async for async database queries
- Pydantic v2 for data validation
- MongoDB for data storage

**Architecture Layers:**
- API: `backend/app/api/recipe.py`
- Service: `backend/app/services/recipe_service.py`
- Model: `backend/app/models/recipe.py`
- Schema: `backend/app/schemas/recipe.py`

**Related Models:**
- Ingredient model for relationships
- User model for recipe ownership
- Nutritional data embedded documents

## Instructions

### Step 1: Analyze Existing Code
- Search @Workspace for existing recipe implementations
- Identify reusable patterns from other CRUD features
- Check for existing ingredient and user models

### Step 2: Define Recipe Model
- Create Beanie Document in `backend/app/models/recipe.py`
- Fields: title, description, ingredients (List), instructions, prep_time, cook_time, servings, difficulty, cuisine_type, dietary_tags, nutritional_info, image_url, user_id, created_at, updated_at
- Add compound indexes: [("user_id", 1), ("created_at", -1)]
- Add text index on title and description for search

### Step 3: Create Schemas
- Define in `backend/app/schemas/recipe.py`:
  - `RecipeCreate`: Required fields for creation
  - `RecipeUpdate`: Optional fields for partial updates
  - `RecipeResponse`: Complete recipe data for responses
  - `RecipeListResponse`: Paginated list response
  - `RecipeSearchQuery`: Search/filter parameters
- Use Pydantic v2 validators for prep_time > 0, servings > 0, valid difficulty levels

### Step 4: Implement Service Layer
- Create `backend/app/services/recipe_service.py` with methods:
  - `create_recipe(recipe_data: RecipeCreate, user_id: str) -> Recipe`
  - `get_recipe_by_id(recipe_id: str) -> Optional[Recipe]`
  - `get_user_recipes(user_id: str, skip: int, limit: int) -> List[Recipe]`
  - `update_recipe(recipe_id: str, recipe_data: RecipeUpdate) -> Recipe`
  - `delete_recipe(recipe_id: str) -> None`
  - `search_recipes(query: RecipeSearchQuery) -> List[Recipe]`
  - `get_recipes_by_ingredients(ingredient_ids: List[str]) -> List[Recipe]`
- Implement text search using MongoDB $text operator
- Add filtering by cuisine_type, dietary_tags, difficulty

### Step 5: Build API Endpoints
- Create router in `backend/app/api/recipe.py`:
  - `POST /api/v1/recipes` - Create recipe
  - `GET /api/v1/recipes` - List recipes with pagination
  - `GET /api/v1/recipes/{recipe_id}` - Get single recipe
  - `PUT /api/v1/recipes/{recipe_id}` - Full update
  - `PATCH /api/v1/recipes/{recipe_id}` - Partial update
  - `DELETE /api/v1/recipes/{recipe_id}` - Delete recipe
  - `GET /api/v1/recipes/search` - Search with filters
  - `POST /api/v1/recipes/by-ingredients` - Find by ingredients
- Add query parameters for pagination, sorting, filtering

### Step 6: Implement Relationships
- Link recipes to ingredients using ingredient IDs
- Populate ingredient details in responses
- Handle cascade operations (e.g., what happens when ingredient is deleted)

### Step 7: Add Nutritional Calculations
- Calculate total nutritional values from ingredients
- Store calculated values in recipe document
- Recalculate when ingredients or quantities change

### Step 8: Write Comprehensive Tests
- Unit tests: `backend/app/tests/unit/test_recipe_service.py`
- Integration tests: `backend/app/tests/integration/test_recipe_api.py`
- Test search functionality, filtering, pagination
- Test relationship handling

## Expected Output

**Files:**
1. `backend/app/models/recipe.py` - Recipe document model
2. `backend/app/schemas/recipe.py` - All recipe schemas
3. `backend/app/services/recipe_service.py` - Business logic
4. `backend/app/api/recipe.py` - API endpoints
5. Test files for unit and integration testing

**Features:**
- Complete CRUD operations
- Advanced search with text queries
- Filter by cuisine, dietary tags, difficulty
- Pagination and sorting
- Ingredient relationship management
- Nutritional data integration

## Constraints

- **MUST** use async/await for all database operations
- **MUST** follow Clean Architecture layer separation
- **MUST** reuse existing ingredient and user models
- **MUST** implement proper error handling (404, 400, 403)
- **MUST** validate recipe ownership before updates/deletes
- **MUST** use MongoDB text indexes for search performance
- **MUST NOT** allow users to modify other users' recipes
- **MUST** include type hints and docstrings

## Notes

- Consider implementing recipe versioning for edit history
- Add recipe rating and review functionality in future
- Implement recipe sharing and privacy settings
- Consider adding recipe collections/cookbooks
- Plan for recipe import from external sources (URLs)
- Add image upload and storage integration
- Implement recipe scaling (adjust servings)
- Consider meal planning integration