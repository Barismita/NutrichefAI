# Pantry Expiry Suggestions

## Feature Overview

Implement an AI-powered Pantry Expiry Suggestions feature for NutriChef AI.

The feature analyzes pantry items and their expiry dates, determines which ingredients are expiring soon or already expired, assigns an urgency level, and recommends how to use or dispose of them.

The implementation must follow the exact architecture already used for:

- AI Assistant
- Nutrition Insights
- Leftover Food Rescue

Reuse the existing AIProvider for all AI interactions.

---

## Files to Create

Create the following files:

```
app/
├── api/
│   └── expiry_api.py
├── schemas/
│   └── expiry_schema.py
├── services/
│   └── expiry_service.py
├── utils/
│   └── expiry_prompt_builder.py
```

---

## API Endpoint

```
POST /expiry/analyze
```

---

## Request

```json
{
  "ingredients": [
    {
      "name": "Milk",
      "expiry_date": "2026-07-28"
    },
    {
      "name": "Bread",
      "expiry_date": "2026-07-25"
    }
  ]
}
```

---

## Response

```json
{
  "expiring_soon": [
    {
      "ingredient": "Milk",
      "days_remaining": 2,
      "urgency": "Medium",
      "recommendation": "Use it for smoothies or pancakes."
    }
  ],
  "expired": [
    {
      "ingredient": "Bread",
      "recommendation": "Discard safely."
    }
  ],
  "general_tips": [
    "Store dairy products below 4°C.",
    "Freeze bread to extend shelf life."
  ]
}
```

---

## Schemas

Create the following models.

### ExpiryIngredient

Fields:

- name: str
- expiry_date: str

---

### ExpiryRequest

Fields:

- ingredients: List[ExpiryIngredient]

Validation:

- At least one ingredient is required.
- Ingredient names cannot be empty.
- Expiry dates cannot be empty.

---

### ExpiringIngredient

Fields:

- ingredient
- days_remaining
- urgency
- recommendation

---

### ExpiredIngredient

Fields:

- ingredient
- recommendation

---

### ExpiryResponse

Fields:

- expiring_soon: List[ExpiringIngredient]
- expired: List[ExpiredIngredient]
- general_tips: List[str]

---

## Prompt Builder

Create

```
build_expiry_prompt()
```

Input:

```
ExpiryRequest
```

The prompt should instruct the AI to:

- analyse pantry items
- compare expiry dates
- identify expired ingredients
- identify ingredients expiring soon
- assign urgency
- recommend how to use ingredients before they expire
- recommend safe disposal for expired ingredients
- provide food-storage tips

Return ONLY valid JSON.

Return no markdown.

Return no explanation.

Return JSON matching this schema exactly:

```json
{
  "expiring_soon": [
    {
      "ingredient": "",
      "days_remaining": 0,
      "urgency": "",
      "recommendation": ""
    }
  ],
  "expired": [
    {
      "ingredient": "",
      "recommendation": ""
    }
  ],
  "general_tips": [
    ""
  ]
}
```

Rules:

- days_remaining must be numeric.
- urgency must be one of:
    - Low
    - Medium
    - High
- expiring_soon must always be an array.
- expired must always be an array.
- general_tips must always be an array.
- Return valid JSON only.

---

## Service

Create

```
analyze_expiry()
```

Pattern should be identical to:

- nutrition_service.py
- assistant_service.py
- leftover_service.py

Requirements:

- Build prompt.
- Create AIProvider().
- await provider.generate(prompt)
- Parse JSON.
- Validate required fields.
- Validate list types.
- Validate required object fields.
- Return

```
ExpiryResponse.model_validate(...)
```

Return

```
HTTPException(status_code=502)
```

for:

- AI provider failures
- invalid JSON
- missing fields
- invalid schema

---

## API

Create router

```
prefix="/expiry"
```

Endpoint

```
POST /analyze
```

Response model

```
ExpiryResponse
```

Import the service directly.

```
return await analyze_expiry(request)
```

---

## main.py

Register

```python
from app.api.expiry_api import router as expiry_router
```

Include

```python
app.include_router(expiry_router)
```

---

## Tests

Create

```
tests/test_expiry.py
```

Include approximately 8 tests.

Service tests:

- successful response
- provider failure
- malformed JSON
- missing required fields
- invalid request validation

API tests:

- successful endpoint
- validation error
- invalid response handling

Use:

- pytest
- monkeypatch
- ASGITransport
- AsyncClient

Follow the same style and coding conventions as the existing Nutrition, Assistant, and Leftover test files.

---

## Coding Standards

- Follow PEP 8.
- Use async functions.
- Use Pydantic v2.
- Use model_validate().
- Use descriptive docstrings.
- Keep line lengths consistent with the project.
- Do not introduce any new dependencies.
- Reuse the existing AIProvider.
- Maintain consistency with the project's architecture and naming conventions.