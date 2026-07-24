---
name: "User Profile Management"
description: "Refactor the User Profile Management module to support single-user cooking profiles without authentication."
category: "Backend Development"
tags:
  - fastapi
  - beanie
  - mongodb
  - profile-management
  - crud
  - clean-architecture
  - refactoring
---

# User Profile Management Refactoring

## Objective

Refactor the existing User Profile Management module for NutriChef AI.

The application is a **single-user system** and does **not** support authentication or multiple user accounts.

Profiles represent **Cooking Profiles** that customize recipe recommendations for different lifestyles and dietary needs.

The implementation should align with the existing Pantry and Recipe modules and preserve the current project architecture.

---

## Project Context

NutriChef AI is built using:

- Python 3.11
- FastAPI
- MongoDB
- Beanie ODM
- Pydantic v2
- Clean Architecture
- Service Layer Pattern

Existing modules:

- Pantry Management
- Recipe Management
- AI Recipe Generation

Search the existing project before generating code and reuse existing patterns, utilities, and conventions.

---

## Refactoring Requirements

Refactor the existing Profile feature.

Do **not** create a new feature from scratch.

Modify only the Profile module and any required registrations.

Do not modify Pantry, Recipe, AI Generation, or unrelated infrastructure.

---

## Business Rules

NutriChef AI supports a **single user**.

There is no authentication.

There are no user accounts.

A profile represents a cooking preference, not a person.

Examples:

- Child
- Teen
- Gym Enthusiast
- Working Professional
- Senior Citizen
- Vegetarian

The application may contain multiple cooking profiles.

The user simply selects one profile when requesting recipe recommendations.

---

## Model Changes

Remove any authentication or multi-user concepts.

Remove:

- user_id

Rename:

- profile_name → name
- profile_type → category

The Profile model should contain:

- id
- name
- category
- dietary_preferences
- allergies
- health_goal
- favorite_cuisines
- spice_level
- created_at
- updated_at

Use timezone-aware timestamps.

Follow Beanie and Pydantic v2 best practices.

---

## CRUD Operations

Implement CRUD operations for Cooking Profiles.

Endpoints:

POST /profiles

GET /profiles

GET /profiles/{profile_id}

PUT /profiles/{profile_id}

DELETE /profiles/{profile_id}

The implementation should match the style used by the existing Pantry and Recipe APIs.

Do not introduce authentication.

Do not use OAuth.

Do not use JWT.

Do not create placeholder authentication methods.

---

## Validation Rules

Ensure:

- name is required
- category must be one of the supported profile categories
- duplicate profile names are rejected
- proper HTTP status codes are returned
- meaningful validation messages are provided

---

## Service Layer

Refactor the existing ProfileService.

Remove every dependency on user_id.

Service methods should become:

- create_profile()
- get_profile()
- get_all_profiles()
- update_profile()
- delete_profile()

Keep business logic inside the service layer.

---

## API Layer

Generate or update only:

```
app/api/profile.py
```

The API should:

- follow existing Pantry API conventions
- remain asynchronous
- use APIRouter
- avoid repetitive code
- return appropriate response models
- not implement authentication

---

## Project Integration

Update only the required files to integrate the Profile module.

Examples:

- Beanie initialization
- Router registration in main.py

Do not modify unrelated files.

---

## Code Quality

Follow:

- Clean Architecture
- SOLID principles
- Async programming
- Type hints
- PEP 8
- Reusable code
- Existing project conventions

Avoid code duplication.

---

## Testing

Suggest unit tests covering:

- Profile creation
- Duplicate profile validation
- Profile retrieval
- Profile update
- Profile deletion
- Invalid category validation

---

## Expected Outcome

Produce a production-ready Cooking Profile Management module that integrates seamlessly with the existing NutriChef AI backend.

The resulting implementation should serve as the foundation for the next feature:

**Profile-Based Recipe Recommendation Engine.**