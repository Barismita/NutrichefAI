# NutriChefAI – AI Cooking Assistant Feature

## Feature Overview

Build an **AI Cooking Assistant** for NutriChefAI that enables users to have natural conversations about cooking, recipes, ingredients, nutrition, and food preparation.

The assistant should leverage the existing AI Provider and follow the project's established architecture and coding standards.

---

# Tech Stack

- Python 3.11+
- FastAPI
- MongoDB
- Beanie ODM
- Pydantic v2
- Async Programming
- Existing AI Provider

---

# Existing Project

The backend already contains:

- Pantry Management
- Recipe CRUD
- AI Recipe Generation
- Ingredient Substitution
- User Profiles

This feature should integrate seamlessly without modifying existing functionality.

---

# Goal

Allow users to ask questions such as:

- I have potatoes, onions and cheese. What can I cook?
- Can I replace eggs with yogurt?
- My pasta is too salty.
- Is this chicken fully cooked?
- Give me a healthy breakfast recipe.
- Suggest a vegetarian dinner.

The assistant should provide intelligent, structured responses.

---

# Project Structure

Create the following files:

```text
app/
├── api/
│   └── assistant_api.py
│
├── services/
│   └── assistant_service.py
│
├── schemas/
│   └── assistant_schema.py
```

Do not modify unrelated modules.

---

# API Endpoint

## POST

```
/assistant/chat
```

---

# Request Body

```json
{
    "message": "I have potatoes, onions and cheese. What can I cook?",
    "profile_id": "optional"
}
```

---

# Response Body

```json
{
    "reply": "You can make a cheesy potato bake.",
    "suggested_recipes": [
        "Cheesy Potato Bake",
        "Potato Cheese Pancakes"
    ],
    "tips": [
        "Boil potatoes before baking.",
        "Season after tasting."
    ]
}
```

---

# Schema Requirements

## AssistantChatRequest

Fields

- message (required)
- profile_id (optional)

Validation

- message cannot be empty
- trim whitespace
- minimum length validation

---

## AssistantChatResponse

Fields

- reply
- suggested_recipes
- tips

Use proper Pydantic validation.

---

# Service Requirements

Implement the business logic inside

```
assistant_service.py
```

Responsibilities:

- Validate request
- Build AI prompt
- Call existing AI Provider
- Parse AI response
- Validate returned JSON
- Return structured response

The service should remain independent from the API layer.

---

# Prompt Engineering

Construct a detailed prompt instructing the AI to:

- behave as an experienced professional chef
- answer only cooking and food-related questions
- recommend recipes when appropriate
- provide ingredient substitutions
- give concise cooking advice
- include useful cooking tips
- avoid hallucinating unavailable ingredients
- keep responses practical
- always return valid JSON
- never return markdown
- never include explanations outside JSON

---

# AI Response Format

The AI must return only JSON.

Example:

```json
{
    "reply": "...",
    "suggested_recipes": [],
    "tips": []
}
```

No markdown.

No extra text.

No code blocks.

---

# API Requirements

Create

```
assistant_api.py
```

Requirements

- FastAPI APIRouter
- Async endpoints
- Thin controller layer
- Import service functions directly
- Proper HTTP status codes
- Proper exception handling

Endpoint

```
POST /assistant/chat
```

---

# Error Handling

Return meaningful HTTPExceptions for

- Invalid request
- Invalid AI response
- Provider failure
- JSON parsing failure
- Internal server errors

---

# Coding Standards

Follow the existing NutriChefAI project style.

Requirements:

- Async throughout
- Type hints everywhere
- Clear function names
- Production-ready code
- Small reusable functions
- Business logic only in services
- No duplicated code
- Clean imports
- PEP8 compliant

---

# Deliverables

Generate complete production-ready code for:

- assistant_schema.py
- assistant_service.py
- assistant_api.py

Include:

- all imports
- validation
- prompt builder
- AI integration
- exception handling
- response parsing

The generated code should compile immediately and integrate with the existing NutriChefAI backend without requiring further modifications.