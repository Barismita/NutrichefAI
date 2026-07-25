# API Design Prompt

## Objective

Design and implement RESTful API endpoints for NutriChef AI that follow FastAPI best practices, maintain consistency
across the application, and integrate seamlessly with the existing service layer.

---

## Project Context

NutriChef AI exposes REST APIs for managing pantry items, recipes, nutrition data, cooking assistance, and other
application features.

Technology stack:

- Python 3.11
- FastAPI
- MongoDB Atlas
- Beanie ODM
- Pydantic

---

## Existing Architecture

The backend follows a layered architecture.

```text
Client
    │
    ▼
API Routes
    │
    ▼
Service Layer
    │
    ▼
Database Models
    │
    ▼
MongoDB
```

Business logic must remain inside the service layer.

---

## API Design Principles

Design APIs that are:

- RESTful
- Consistent
- Predictable
- Easy to extend
- Easy to document

Every endpoint should have a clear responsibility.

---

## Route Organization

Create feature-based routers under:

```text
app/api/
```

Each router should expose only the endpoints related to its feature.

Example:

```text
app/api/
├── pantry.py
├── recipes.py
├── nutrition.py
└── assistant.py
```

---

## Endpoint Requirements

For every endpoint:

- Choose the appropriate HTTP method.
- Define the request schema.
- Define the response schema.
- Validate incoming data.
- Return meaningful HTTP status codes.
- Handle expected error scenarios.

---

## Request Validation

Use Pydantic models for:

- Request bodies
- Path parameters
- Query parameters
- Response models

Avoid using raw dictionaries unless absolutely necessary.

---

## Response Design

Responses should be:

- Consistent
- Clearly documented
- JSON serializable
- Easy for frontend consumption

Avoid exposing internal implementation details.

---

## Error Handling

Handle common scenarios including:

- Invalid input
- Missing resources
- Duplicate resources
- Database failures
- Unexpected server errors

Provide meaningful error messages.

---

## Documentation

Ensure every endpoint includes:

- Summary
- Description
- Request model
- Response model
- Status codes

Leverage FastAPI's automatic OpenAPI generation.

---

## Testing

Recommend tests for:

- Successful requests
- Validation failures
- Error handling
- Edge cases

---

## Expected Output

Provide:

1. API endpoints.
2. HTTP methods.
3. Request models.
4. Response models.
5. Router implementation.
6. Required service updates.
7. Testing recommendations.
8. Documentation updates.