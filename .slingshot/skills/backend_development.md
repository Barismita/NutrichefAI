# Backend Development Skill

## Purpose

Implement scalable backend features for NutriChef AI using FastAPI while maintaining clean architecture, modularity, and
code quality.

---

## Technology Stack

- Python 3.11
- FastAPI
- MongoDB Atlas
- Beanie ODM
- Pydantic

---

## Responsibilities

When implementing backend features:

- Create API routes.
- Implement business logic in services.
- Define request and response schemas.
- Interact with the database.
- Handle validation.
- Handle exceptions.
- Write reusable code.

---

## Architecture

Always follow:

API
↓
Service
↓
Database

Business logic must never reside inside route handlers.

---

## Best Practices

- Keep functions focused.
- Avoid duplicated logic.
- Use dependency injection.
- Use asynchronous database operations.
- Return meaningful HTTP responses.
- Validate all input.

---

## Error Handling

Handle:

- Validation errors
- Missing resources
- Duplicate resources
- Internal server errors

Provide clear API responses.

---

## Quality Checklist

- Modular
- Readable
- Tested
- Documented
- Follows project conventions