# Feature: Ingredient Substitution Recommendations

## Goal

Implement an AI-powered ingredient substitution feature for NutriChef AI.

## Requirements

Create a REST endpoint:

POST /recipes/substitute

Request:

```json
{
    "ingredient": "Cream"
}
```

Response:

```json
{
    "ingredient": "Cream",
    "substitutes": [
        "Milk + Butter",
        "Greek Yogurt",
        "Coconut Milk"
    ]
}
```

## Implementation

- Follow the existing project architecture.
- Add request and response Pydantic schemas.
- Implement business logic in `AIService`.
- Create a new FastAPI endpoint.
- Initially use a mock implementation with predefined substitutions.
- Design the service so it can later be replaced with a real AI provider without changing the API.

## Acceptance Criteria

- Endpoint returns appropriate substitutions.
- Returns a meaningful error if no substitution is available.
- Uses async functions.
- Follows the project's coding standards.
- Includes OpenAPI documentation.