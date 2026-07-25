# Backend Feature Development Prompt

## Objective

Implement a new backend feature for the NutriChef AI application following the existing project architecture and
engineering standards.

---

## Project Context

NutriChef AI is an AI-powered smart kitchen assistant that generates personalized recipes based on pantry ingredients,
dietary preferences, health goals, and budget.

The backend is built using:

- Python 3.11
- FastAPI
- MongoDB Atlas
- Beanie ODM
- Pydantic

The application follows a layered architecture.

---

## Existing Architecture

Every feature should follow this structure:

```text
app/
├── api/
├── config/
├── database/
├── models/
├── schemas/
├── services/
└── utils/
```

---

## Implementation Requirements

For every new feature, generate or update the following where applicable:

- Beanie Document model
- Pydantic request schemas
- Pydantic response schemas
- Service layer implementation
- FastAPI router
- Router registration
- Database initialization
- Unit tests
- Documentation

---

## Coding Standards

### API Layer

- Keep routes lightweight.
- Do not place business logic inside route handlers.
- Use dependency injection where appropriate.
- Return appropriate HTTP status codes.

### Service Layer

- Contain all business logic.
- Handle database interactions.
- Raise meaningful exceptions.
- Keep methods focused and reusable.

### Models

- Use Beanie `Document`.
- Add indexes where appropriate.
- Follow existing naming conventions.

### Schemas

- Separate request and response models.
- Use Pydantic validation.
- Keep schemas independent of database models.

---

## Database

- Use asynchronous database operations.
- Reuse the existing database initialization.
- Follow existing collection naming conventions.

---

## Error Handling

Generate robust error handling for:

- Invalid requests
- Missing resources
- Database failures
- Unexpected exceptions

---

## Testing

Generate or update Pytest tests for:

- Successful requests
- Validation failures
- Error scenarios

---

## Documentation

Update project documentation when introducing new features or changing existing behaviour.

---

## Expected Output

Provide:

1. Required files to create or modify.
2. Complete implementation for each file.
3. Explanation of architectural decisions.
4. Suggested tests.
5. Any follow-up tasks required.