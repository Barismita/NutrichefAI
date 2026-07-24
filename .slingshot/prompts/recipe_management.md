# Feature: Recipe Management

## Context

You are working on NutriChef AI, a production-ready AI-powered recipe recommendation application.

Current technology stack:

- Python 3.11
- FastAPI
- Beanie ODM
- MongoDB Atlas
- Pydantic v2

Current architecture:

    backend/
    └── app/
        ├── api/
        ├── config/
        ├── core/
        ├── database/
        ├── models/
        ├── schemas/
        ├── services/
        ├── utils/
        └── main.py

Pantry Management has already been implemented.

Do not modify existing Pantry functionality.

---

## Objective

Implement Recipe Management using clean architecture.

The implementation should be production-ready and follow FastAPI best practices.

---

## Functional Requirements

Implement the following endpoints.

### POST /recipes

Create a new recipe.

### GET /recipes

Return all recipes.

Support optional query parameters:

- cuisine
- difficulty
- dietary_tag

### GET /recipes/{recipe_id}

Return a single recipe.

Return HTTP 404 if not found.

### PUT /recipes/{recipe_id}

Update an existing recipe.

Only update fields provided in the request.

Return HTTP 404 if not found.

### DELETE /recipes/{recipe_id}

Delete a recipe.

Return success message.

Return HTTP 404 if recipe does not exist.

---

## Recipe Model

Create a Beanie document.

Collection:

- recipes

Fields:

- title
- description
- ingredients
- instructions
- cooking_time_minutes
- servings
- difficulty
- cuisine
- dietary_tags
- nutrition
- image_url
- created_at
- updated_at

---

## Nutrition Model

Nutrition should be a nested object.

Fields:

- calories
- protein
- carbohydrates
- fat

Use proper Pydantic models instead of dictionaries.

---

## Schemas

Create separate schemas.

Examples:

- RecipeCreate
- RecipeUpdate
- RecipeResponse

Never expose internal Beanie implementation details.

---

## Service Layer

Implement all business logic inside:

services/recipe_service.py

Responsibilities include:

- create recipe
- fetch recipe
- update recipe
- delete recipe
- filtering
- validation

Routes should contain no business logic.

---

## API Layer

Create:

api/recipe_api.py

Use APIRouter.

Register the router in main.py.

---

## Validation

Validate:

- title cannot be empty
- ingredients cannot be empty
- instructions cannot be empty
- cooking time must be positive
- servings must be positive

Reject invalid requests using proper HTTP exceptions.

---

## Error Handling

Return:

400 for invalid input

404 when recipe does not exist

500 only for unexpected server errors

---

## Code Quality

Requirements:

- async everywhere
- type hints
- SOLID principles
- clean architecture
- reusable functions
- concise methods
- descriptive names
- production-ready code

Avoid duplication.

---

## Testing

Create basic API tests covering:

- recipe creation
- recipe retrieval
- recipe update
- recipe deletion
- recipe not found

---

## Deliverables

Generate:

- models/recipe_model.py 
- schemas/recipe_schema.py 
- services/recipe_service.py 
- api/recipe_api.py 
- tests/test_recipe_api.py

Update:

- database/mongodb.py 
- main.py

Do not modify unrelated files.

Ensure the application starts without errors.