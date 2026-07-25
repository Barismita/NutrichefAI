# Objective

Generate comprehensive unit tests for the feature that has just been implemented.

The generated tests must integrate seamlessly with the existing NutriChef AI codebase instead of creating a generic project structure.

---

# Project Context

## Tech Stack

- Python 3.11
- FastAPI
- MongoDB
- Beanie ODM
- Pydantic v2
- Pytest
- pytest-asyncio
- pytest-mock
- pytest-cov

---

## Current Project Structure

```
backend/
└── app/
    ├── api/
    ├── config/
    ├── database/
    ├── models/
    ├── schemas/
    ├── services/
    ├── utils/
    └── tests/
```

Generate tests using the existing package names and imports.

Do NOT invent new folders or rename existing modules.

---

# Instructions

## Understand the feature

Before generating tests:

- Analyse the implementation.
- Understand the existing architecture.
- Use the current codebase as the source of truth.
- Do NOT assume services, exceptions or models that do not exist.

---

## Generate tests for

Generate tests only for components modified by the current feature.

Possible targets include:

- Service layer
- API endpoints
- Pydantic schemas
- Utility functions
- AI services
- Constants (where applicable)

Only generate tests for files that actually exist.

---

## Testing Guidelines

### Service Tests

- Test successful execution
- Test validation
- Test error scenarios
- Test edge cases
- Mock all database operations
- Mock all AI provider calls
- Never connect to MongoDB

---

### API Tests

Test:

- Success responses
- Invalid request payloads
- Missing resources
- HTTP status codes
- Response schemas

Use FastAPI TestClient or AsyncClient depending on the existing project.

---

### Schema Tests

Validate:

- Required fields
- Optional fields
- Invalid values
- Field validation
- Default values

---

### AI Tests

For AI-related features:

- Mock AI responses
- Test successful AI output
- Test empty responses
- Test invalid inputs
- Test fallback behaviour
- Never call a real AI provider

---

### Constants

If the feature uses constants (for example ingredient substitutions or profile categories):

Test that:

- Lookup works correctly
- Input is case-insensitive (if implemented)
- Unknown values return expected behaviour

---

# Test Design

Every test should follow AAA:
- Arrange
- Act 
- Assert

Test behaviour rather than implementation.

Use descriptive test names.

One behaviour per test.

Use fixtures whenever appropriate.

Use parameterized tests where possible.

---

# Mocking Rules

Always mock:

- MongoDB
- Beanie
- AI providers
- External services

Never perform network requests.

Never use a real database.

---

# Coverage

Target:

- 90%+ coverage for the modified feature.
- 100% coverage for business logic whenever practical.

Focus on meaningful coverage instead of simply increasing percentages.

---

# Deliverables

Generate only the files required for the current feature.

Examples:

```
tests/
├── test_recipe_service.py
├── test_profile_service.py
├── test_pantry_service.py
├── test_ai_service.py
├── test_recipe_api.py
├── test_profile_schema.py
└── ...
```

Do not regenerate tests for modules that have not changed.

---
## IMPORTANT

Do NOT assume the project architecture.

Before generating a single test:

1. Read every referenced implementation file.
2. Read every schema used by that implementation.
3. Read every router.
4. Use the implementation as the ONLY source of truth.

If the implementation does not contain a class, function, endpoint, schema or exception, DO NOT invent one.

Never generate code for hypothetical features.

Never generate CRUD operations unless they already exist.

Never generate service classes unless they already exist.

Never rename functions.

Never rename schemas.

Never rename endpoints.

Never invent helper methods.

Never invent internal attributes.

Never invent exceptions.

Generate tests ONLY for the functions, routes and schemas that exist in the current implementation.

-----

# Constraints

MUST

- Use pytest
- Use pytest-asyncio for async functions
- Use pytest-mock
- Follow the project's existing architecture
- Match existing imports exactly
- Generate production-quality tests

MUST NOT

- Invent classes or exceptions
- Rename project modules
- Create duplicate code
- Use a real MongoDB instance
- Use a real AI provider
- Modify production code unless required to improve testability

---

# Expected Behaviour

The generated tests should run successfully against the existing NutriChef AI project with minimal or no manual modifications.

If additional fixtures or small refactoring are required to improve testability, explain why before generating the tests.