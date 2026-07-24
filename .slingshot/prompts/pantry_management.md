# Feature: Pantry Management

## Context

You are working on NutriChef AI, a production-quality AI recipe recommendation application.

Current technology stack:

- FastAPI
- Beanie ODM
- MongoDB Atlas
- Pydantic v2
- Python 3.11

Current project structure:

    backend/
    └── app/
        ├── api/
        ├── config/
        ├── database/
        ├── models/
        ├── schemas/
        ├── services/
        └── main.py

MongoDB is already configured.

Beanie is already initialized.

Do NOT modify existing infrastructure.

---

## Objective

Implement Pantry Management.

A pantry belongs to a single user.

For now authentication is not implemented.

Use a placeholder user id:

"user123"

The design should make it easy to replace this with JWT authentication later.

---

## Functional Requirements

Implement the following endpoints.

### POST /pantry

Creates a pantry if one does not exist.

If the pantry already exists, merge ingredients.

Requirements:

- convert ingredients to lowercase
- trim whitespace
- remove duplicates
- return updated pantry

---

### GET /pantry

Return the pantry.

If none exists, return an empty pantry.

---

### DELETE /pantry/{ingredient}

Delete one ingredient.

Return the updated pantry.

If ingredient does not exist, return HTTP 404.

---

## Database

Create a Pantry Beanie document.

Fields:

- user_id
- ingredients

Collection name:

pantries

---

## Schemas

Create request and response schemas.

Do not expose database implementation details.

---

## Service Layer

All business logic must live inside:

services/pantry_service.py

Routes must contain no business logic.

---

## API Layer

Create:

api/pantry.py

Use APIRouter.

---

## Validation

Normalize ingredient names.

Example:

    " Egg "

becomes

    "egg"

Reject empty ingredient strings.

---

## Error Handling

Return proper HTTP exceptions.

---

## Code Quality

Follow production-grade FastAPI practices.

Use:

- type hints
- async functions
- clean architecture
- reusable functions

Avoid duplicated code.

Keep functions short.

Follow SOLID principles where appropriate.

---

## Deliverables

Generate:
- models/pantry.py 
- schemas/pantry.py 
- services/pantry_service.py 
- api/pantry.py

Update main.py to register the router.

Update mongodb.py if required.

Do not modify unrelated files.