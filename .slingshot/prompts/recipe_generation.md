# Feature: AI Recipe Generation

## Context

You are working on NutriChef AI, a production-ready AI-powered recipe recommendation application.

Current technology stack:

- Python 3.11
- FastAPI
- Beanie ODM
- MongoDB Atlas
- Pydantic v2

Current project structure:

backend/
└── app/
    ├── api/
    ├── config/
    ├── database/
    ├── models/
    ├── schemas/
    ├── services/
    ├── utils/
    └── main.py

The following features are already implemented:

- Pantry Management
- Recipe Management

Do not modify any existing functionality.

---

## Existing Project Constraints

Do not replace or modify existing infrastructure.

Preserve:

- settings.py
- mongodb.py
- .env configuration
- database initialization
- existing routers
- existing models

Only add the files required for this feature.

Use the existing project conventions.

Never introduce placeholder implementations that replace working code.

---

## Objective

Implement AI Recipe Generation.

This feature should generate recipes using an AI provider based on user preferences and available ingredients.

Generated recipes should NOT be automatically stored in MongoDB.

Recipe generation and recipe persistence must remain separate features.

---

## Functional Requirements

Implement the following endpoint.

### POST /recipes/generate

Generate a recipe using AI.

The endpoint should accept:

- ingredients
- cuisine (optional)
- diet (optional)
- max_cooking_time (optional)
- servings (optional)
- additional_instructions (optional)

Return a structured recipe.

Do not save the generated recipe.

---

## Request Schema

The request should support fields similar to:

- ingredients
- cuisine
- diet
- max_cooking_time
- servings
- additional_instructions

Use proper Pydantic models.

---

## Response Schema

Return a structured recipe containing:

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
- image_prompt (optional)

The response should follow a consistent schema.

---

## Architecture

Create the following files.

api/
- recipe_generation_api.py

schemas/
- recipe_generation_schema.py

services/
- recipe_generation_service.py

utils/
- prompt_builder.py

Do not create a database model for generated recipes.

---

## Prompt Builder

Create a dedicated prompt builder.

Responsibilities:

- build a clear system prompt
- include pantry ingredients
- include user preferences
- enforce structured JSON output
- encourage realistic recipes
- prevent hallucinated ingredients when possible

Keep prompt construction separate from business logic.

---

## Service Layer

Implement all business logic inside:

services/recipe_generation_service.py

Responsibilities:

- validate request
- build prompt
- call AI provider
- parse AI response
- validate generated recipe
- return structured response

Routes should contain no business logic.

---

## AI Provider

Design the service so that the AI provider can be replaced easily.

Create a dedicated method responsible for communicating with the provider.

The implementation should make it easy to switch between providers such as:

- OpenAI
- Gemini
- Claude
- Local LLM

Do not tightly couple business logic with a specific provider.

---

## Error Handling

Handle:

- invalid requests
- malformed AI responses
- provider failures
- timeout errors

Return appropriate HTTP status codes.

---

## Validation

Ensure:

- ingredients list is not empty
- generated recipe contains ingredients
- generated recipe contains instructions
- nutrition fields are present
- cooking time is positive

Reject invalid responses.

---

## Code Quality

Requirements:

- async implementation
- type hints
- SOLID principles
- clean architecture
- reusable methods
- descriptive naming
- production-ready code

Avoid duplicated logic.

---

## Future Compatibility

Design the implementation so that future features can easily support:

- saving generated recipes
- recipe regeneration
- recipe rating
- meal planning
- shopping list generation

Do not implement these features now.

---

## Testing

Create tests covering:

- successful recipe generation
- invalid requests
- provider failure
- malformed AI response

---

## Deliverables

Generate:

api/recipe_generation_api.py

schemas/recipe_generation_schema.py

services/recipe_generation_service.py

utils/prompt_builder.py

tests/test_recipe_generation_api.py

Update:

main.py

Do not modify unrelated files.

Ensure the application starts without errors.

## Existing Project Constraints

Do not replace existing infrastructure.

Preserve:

- settings.py
- mongodb.py
- .env usage
- database initialization
- existing routers

Only modify files required for this feature.

Use existing imports.

Never introduce placeholder connection strings.

Never replace working code.